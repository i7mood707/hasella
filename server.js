const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleChatRequest } = require('./lib/chatController');
const { getGoldPrice } = require('./marketData/goldPrice');
const { getSaudiQuote } = require('./marketData/saudiMarket');
const { getUsQuote } = require('./marketData/usMarket');
const { createToken, getToken, redeemToken } = require('./lib/maddTokenStore');

const MADD_ALLOWED_ORIGINS = [
  'https://pay-app-for-hassela.vercel.app',
  'https://hasella.vercel.app',
  'http://localhost:8743',
  'http://localhost:3000'
];

const PORT = process.env.PORT || 8743;
const ROOT = __dirname;

const MIME = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp',
  '.svg':'image/svg+xml; charset=utf-8', '.ico':'image/x-icon'
};

function sendJson(res, status, body){
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8'});
  res.end(JSON.stringify(body));
}

async function handleMarketRoute(req, res, pathname, searchParams){
  if(pathname !== '/api/market/gold'
    && !pathname.startsWith('/api/market/saudi/')
    && !pathname.startsWith('/api/market/us/')
    && pathname !== '/api/market/summary'){
    return false; // not a market route — let the caller fall through to static file serving
  }
  try{
    if(pathname === '/api/market/gold'){
      sendJson(res, 200, await getGoldPrice());
      return true;
    }
    if(pathname.startsWith('/api/market/saudi/')){
      const symbol = decodeURIComponent(pathname.split('/').pop());
      if(!symbol){ sendJson(res, 400, {error:true, source:'saudi', message:'missing symbol'}); return true; }
      sendJson(res, 200, await getSaudiQuote(symbol));
      return true;
    }
    if(pathname.startsWith('/api/market/us/')){
      const symbol = decodeURIComponent(pathname.split('/').pop());
      if(!symbol){ sendJson(res, 400, {error:true, source:'us', message:'missing symbol'}); return true; }
      sendJson(res, 200, await getUsQuote(symbol));
      return true;
    }
    if(pathname === '/api/market/summary'){
      const [gold, saudi, us] = await Promise.all([
        getGoldPrice().catch(err => ({error:true, source:'gold', message: err.message})),
        getSaudiQuote('2222', 'أرامكو السعودية').catch(err => ({error:true, source:'saudi', message: err.message})),
        getUsQuote('AAPL', 'Apple').catch(err => ({error:true, source:'us', message: err.message}))
      ]);
      sendJson(res, 200, {gold, saudi, us});
      return true;
    }
  }catch(err){
    sendJson(res, 502, {error:true, source:'market', message: err.message});
  }
  return true;
}

function serveStatic(req, res){
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if(reqPath === '/') reqPath = '/index.html';
  const filePath = path.normalize(path.join(ROOT, reqPath));
  if(!filePath.startsWith(ROOT)){
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, data)=>{
    if(err){ res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {'Content-Type': MIME[ext] || 'application/octet-stream'});
    res.end(data);
  });
}

function applyMaddCors(req, res){
  const origin = req.headers.origin;
  if(MADD_ALLOWED_ORIGINS.includes(origin)){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function handleMaddRoute(req, res, pathname, searchParams){
  if(pathname !== '/api/madd') return false;
  applyMaddCors(req, res);
  if(req.method === 'OPTIONS'){ res.writeHead(204); res.end(); return true; }

  if(req.method === 'GET'){
    const code = searchParams.get('code');
    if(!code){ sendJson(res, 400, {error:'missing code'}); return true; }
    const token = await getToken(code);
    if(!token){ sendJson(res, 404, {found:false}); return true; }
    sendJson(res, 200, {found:true, ...token});
    return true;
  }

  if(req.method === 'POST'){
    let body = '';
    req.on('data', chunk=> body += chunk);
    await new Promise(resolve=> req.on('end', resolve));
    try{
      const { action, code, amount, accounts, isOneTime, expiresAt, desc } = JSON.parse(body || '{}');
      if(action === 'create'){
        if(!code || !amount){ sendJson(res, 400, {error:'missing code or amount'}); return true; }
        const token = await createToken(code, {amount, accounts, isOneTime, expiresAt});
        sendJson(res, 200, {ok:true, token});
        return true;
      }
      if(action === 'redeem'){
        if(!code || amount == null){ sendJson(res, 400, {error:'missing code or amount'}); return true; }
        const result = await redeemToken(code, amount, desc);
        sendJson(res, result.ok ? 200 : 409, result);
        return true;
      }
      sendJson(res, 400, {error:'unknown action'});
    }catch(err){
      sendJson(res, 500, {error: err.message});
    }
    return true;
  }

  sendJson(res, 405, {error:'method not allowed'});
  return true;
}

const server = http.createServer((req, res)=>{
  if(req.url.split('?')[0] === '/api/madd'){
    const { pathname, searchParams } = new URL(req.url, 'http://localhost');
    handleMaddRoute(req, res, pathname, searchParams);
    return;
  }
  if(req.method === 'POST' && req.url === '/api/chat'){
    let body = '';
    req.on('data', chunk=> body += chunk);
    req.on('end', async ()=>{
      try{
        const { question, context, history } = JSON.parse(body);
        if(!question || typeof question !== 'string'){
          sendJson(res, 400, {error:'missing question'});
          return;
        }
        const result = await handleChatRequest(question, context, history);
        sendJson(res, 200, result);
      }catch(err){
        sendJson(res, err.status || 502, {error: err.message});
      }
    });
    return;
  }
  if(req.method === 'GET'){
    const { pathname, searchParams } = new URL(req.url, 'http://localhost');
    if(pathname.startsWith('/api/market/')){
      handleMarketRoute(req, res, pathname, searchParams).then(handled=>{
        if(!handled) serveStatic(req, res);
      });
      return;
    }
    serveStatic(req, res);
    return;
  }
  res.writeHead(405); res.end('Method not allowed');
});

server.listen(PORT, ()=>{
  console.log(`hasella server running on http://localhost:${PORT}`);
});
