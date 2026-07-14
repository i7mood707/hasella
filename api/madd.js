const { createToken, getToken, redeemToken } = require('../lib/maddTokenStore');

const ALLOWED_ORIGINS = [
  'https://pay-app-for-hassela.vercel.app',
  'https://hasella.vercel.app',
  'http://localhost:8743',
  'http://localhost:3000'
];

function applyCors(req, res){
  const origin = req.headers.origin;
  if(ALLOWED_ORIGINS.includes(origin)){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
  applyCors(req, res);
  if(req.method === 'OPTIONS'){ res.status(204).end(); return; }

  try{
    if(req.method === 'GET'){
      const code = req.query.code;
      if(!code){ res.status(400).json({error:'missing code'}); return; }
      const token = await getToken(code);
      if(!token){ res.status(404).json({found:false}); return; }
      res.status(200).json({found:true, ...token});
      return;
    }

    if(req.method === 'POST'){
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const { action } = body;

      if(action === 'create'){
        const { code, amount, accounts, isOneTime, expiresAt } = body;
        if(!code || !amount){ res.status(400).json({error:'missing code or amount'}); return; }
        const token = await createToken(code, {amount, accounts, isOneTime, expiresAt});
        res.status(200).json({ok:true, token});
        return;
      }

      if(action === 'redeem'){
        const { code, amount } = body;
        if(!code || amount == null){ res.status(400).json({error:'missing code or amount'}); return; }
        const result = await redeemToken(code, amount);
        res.status(result.ok ? 200 : 409).json(result);
        return;
      }

      res.status(400).json({error:'unknown action'});
      return;
    }

    res.status(405).json({error:'method not allowed'});
  }catch(err){
    res.status(500).json({error: err.message});
  }
};
