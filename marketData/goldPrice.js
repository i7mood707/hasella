const { getCached, setCached } = require('./cache');

const CACHE_TTL_MS = 60000;
const CACHE_KEY = 'gold:XAU';

async function getGoldPrice(){
  const cached = getCached(CACHE_KEY, CACHE_TTL_MS);
  if(cached) return cached;

  const res = await fetch('https://api.gold-api.com/price/XAU', {signal: AbortSignal.timeout(8000)});
  if(!res.ok) throw new Error(`gold-api HTTP ${res.status}`);
  const data = await res.json();
  if(typeof data.price !== 'number') throw new Error('gold-api returned no price');

  const normalized = {
    source: 'gold',
    symbol: 'XAU',
    name: 'الذهب (أونصة)',
    price: data.price,
    change: null,
    changePercent: null,
    currency: data.currency || 'USD',
    timestamp: data.updatedAt || new Date().toISOString()
  };
  setCached(CACHE_KEY, normalized);
  return normalized;
}

module.exports = { getGoldPrice };
