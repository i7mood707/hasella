const { getFinancialAdvice } = require('../lib/advisorController');

module.exports = async (req, res) => {
  if(req.method !== 'POST'){
    res.status(405).json({error:'method not allowed'});
    return;
  }
  try{
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const advice = await getFinancialAdvice(body);
    res.status(200).json({success:true, advice});
  }catch(err){
    res.status(err.status || 502).json({success:false, error: err.message});
  }
};
