const { getGoldPrice } = require('../../marketData/goldPrice');

module.exports = async (req, res) => {
  try{
    res.status(200).json(await getGoldPrice());
  }catch(err){
    res.status(502).json({error:true, source:'gold', message: err.message});
  }
};
