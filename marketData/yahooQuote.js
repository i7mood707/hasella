const { getCached, setCached } = require('./cache');

const CACHE_TTL_MS = 45000;

async function fetchYahooQuote(ySymbol, source, symbol, fallbackName){
  const cacheKey = `${source}:${ySymbol}`;
  const cached = getCached(cacheKey, CACHE_TTL_MS);
  if(cached) return cached;

  const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}`, {
    headers: {'User-Agent': 'Mozilla/5.0'},
    signal: AbortSignal.timeout(8000)
  });
  if(!res.ok) throw new Error(`yahoo HTTP ${res.status}`);
  const data = await res.json();
  const meta = data.chart && data.chart.result && data.chart.result[0] && data.chart.result[0].meta;
  if(!meta || typeof meta.regularMarketPrice !== 'number') throw new Error(`no quote data for ${ySymbol}`);

  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? null;
  const change = (prevClose != null) ? price - prevClose : null;
  const changePercent = (change != null && prevClose) ? (change / prevClose) * 100 : null;

  const normalized = {
    source,
    symbol,
    name: fallbackName || meta.longName || meta.shortName || symbol,
    price,
    change,
    changePercent,
    currency: meta.currency || (source === 'saudi' ? 'SAR' : 'USD'),
    timestamp: new Date().toISOString()
  };
  setCached(cacheKey, normalized);
  return normalized;
}

module.exports = { fetchYahooQuote };
