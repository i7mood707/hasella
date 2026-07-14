const fs = require('fs');
const path = require('path');

const BLOB_PATHNAME = 'madd-tokens.json';
const LOCAL_STORE_PATH = path.join(__dirname, '..', 'data', 'madd-tokens.json');

function usingBlob(){
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function readAllFromDisk(){
  try{
    return JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf8'));
  }catch(err){
    return {};
  }
}

function writeAllToDisk(tokens){
  fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), {recursive:true});
  fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(tokens));
}

async function readAllFromBlob(){
  const { list } = require('@vercel/blob');
  const { blobs } = await list({prefix: BLOB_PATHNAME, limit: 1});
  const match = blobs.find(b => b.pathname === BLOB_PATHNAME);
  if(!match) return {};
  const res = await fetch(match.url, {cache:'no-store'});
  if(!res.ok) return {};
  return await res.json();
}

async function writeAllToBlob(tokens){
  const { put } = require('@vercel/blob');
  await put(BLOB_PATHNAME, JSON.stringify(tokens), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });
}

function readAll(){
  return usingBlob() ? readAllFromBlob() : Promise.resolve(readAllFromDisk());
}

function writeAll(tokens){
  return usingBlob() ? writeAllToBlob(tokens) : Promise.resolve(writeAllToDisk(tokens));
}

async function createToken(code, {amount, accounts, isOneTime, expiresAt}){
  const tokens = await readAll();
  tokens[code] = {
    amount: Number(amount),
    accounts: accounts || [],
    isOneTime: !!isOneTime,
    expiresAt: expiresAt || null,
    used: false,
    usedAt: null,
    createdAt: Date.now()
  };
  await writeAll(tokens);
  return tokens[code];
}

async function getToken(code){
  const tokens = await readAll();
  return tokens[code] || null;
}

async function redeemToken(code, amount){
  const tokens = await readAll();
  const token = tokens[code];
  if(!token) return {ok:false, error:'not_found'};
  if(token.used) return {ok:false, error:'already_used'};
  if(token.expiresAt && Date.now() > token.expiresAt) return {ok:false, error:'expired'};
  if(Math.round(Number(amount)*100) !== Math.round(Number(token.amount)*100)){
    return {ok:false, error:'amount_mismatch', expectedAmount: token.amount};
  }
  token.used = true;
  token.usedAt = Date.now();
  tokens[code] = token;
  await writeAll(tokens);
  return {ok:true, token};
}

module.exports = { createToken, getToken, redeemToken };
