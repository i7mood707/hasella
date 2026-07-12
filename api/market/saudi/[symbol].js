const { getSaudiQuote } = require('../../../marketData/saudiMarket');

module.exports = async (req, res) => {
  const symbol = req.query.symbol;
  if(!symbol){
    res.status(400).json({error:true, source:'saudi', message:'missing symbol'});
    return;
  }
  try{
    res.status(200).json(await getSaudiQuote(symbol));
  }catch(err){
    res.status(502).json({error:true, source:'saudi', symbol, message: err.message});
  }
};
