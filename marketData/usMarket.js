const { fetchYahooQuote } = require('./yahooQuote');

async function getUsQuote(symbol, name){
  return fetchYahooQuote(symbol, 'us', symbol, name);
}

module.exports = { getUsQuote };
