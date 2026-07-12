const { fetchYahooQuote } = require('./yahooQuote');

async function getSaudiQuote(symbol, name){
  const ySymbol = symbol.includes('.') ? symbol : `${symbol}.SR`;
  return fetchYahooQuote(ySymbol, 'saudi', symbol, name);
}

module.exports = { getSaudiQuote };
