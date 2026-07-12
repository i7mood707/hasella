const { RISK_PROFILES, buildInvestmentPlan } = require('../../marketData/investmentPlans');

module.exports = async (req, res) => {
  const risk = req.query.risk;
  if(!RISK_PROFILES[risk]){
    res.status(400).json({error:true, source:'investment-plan', message:'risk must be one of: low, medium, high'});
    return;
  }
  try{
    res.status(200).json(await buildInvestmentPlan(risk));
  }catch(err){
    res.status(502).json({error:true, source:'investment-plan', message: err.message});
  }
};
