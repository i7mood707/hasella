const { getUsQuote } = require('../../../marketData/usMarket');

module.exports = async (req, res) => {
  const symbol = req.query.symbol;
  if(!symbol){
    res.status(400).json({error:true, source:'us', message:'missing symbol'});
    return;
  }
  try{
    res.status(200).json(await getUsQuote(symbol));
  }catch(err){
    res.status(502).json({error:true, source:'us', symbol, message: err.message});
  }
};
