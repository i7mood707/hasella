const { getGoldPrice } = require('../../marketData/goldPrice');
const { getSaudiQuote } = require('../../marketData/saudiMarket');
const { getUsQuote } = require('../../marketData/usMarket');

module.exports = async (req, res) => {
  const [gold, saudi, us] = await Promise.all([
    getGoldPrice().catch(err => ({error:true, source:'gold', message: err.message})),
    getSaudiQuote('2222', 'أرامكو السعودية').catch(err => ({error:true, source:'saudi', message: err.message})),
    getUsQuote('AAPL', 'Apple').catch(err => ({error:true, source:'us', message: err.message}))
  ]);
  res.status(200).json({gold, saudi, us});
};
