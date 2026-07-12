const { getGoldPrice } = require('./goldPrice');
const { getSaudiQuote } = require('./saudiMarket');
const { getUsQuote } = require('./usMarket');

const RISK_PROFILES = {
  low: {
    risk: 'low',
    label: 'منخفض المخاطرة',
    description: 'يركّز على الذهب كملاذ آمن مع نسبة محدودة من الأسهم المستقرة، مناسب لمن يفضّل الحفاظ على رأس المال.',
    allocation: {gold: 50, saudi: 30, us: 20},
    saudi: [{symbol:'1120', name:'مصرف الراجحي'}],
    us: [{symbol:'AAPL', name:'Apple'}, {symbol:'MSFT', name:'Microsoft'}]
  },
  medium: {
    risk: 'medium',
    label: 'متوسط المخاطرة',
    description: 'توزيع متوازن بين الذهب والأسهم السعودية والأمريكية، مناسب لمن يقبل مخاطرة معتدلة مقابل نمو أفضل.',
    allocation: {gold: 30, saudi: 35, us: 35},
    saudi: [{symbol:'2222', name:'أرامكو السعودية'}, {symbol:'2010', name:'سابك'}],
    us: [{symbol:'AAPL', name:'Apple'}, {symbol:'GOOGL', name:'Alphabet'}, {symbol:'AMZN', name:'Amazon'}]
  },
  high: {
    risk: 'high',
    label: 'مرتفع المخاطرة',
    description: 'تركيز أكبر على أسهم النمو في السوقين السعودي والأمريكي مقابل نسبة صغيرة من الذهب، مناسب لمن يتحمّل تقلبات أعلى طلبًا لعوائد أكبر.',
    allocation: {gold: 10, saudi: 40, us: 50},
    saudi: [{symbol:'7010', name:'stc'}, {symbol:'1211', name:'معادن'}],
    us: [{symbol:'NVDA', name:'Nvidia'}, {symbol:'TSLA', name:'Tesla'}]
  }
};

async function buildInvestmentPlan(risk){
  const profile = RISK_PROFILES[risk];
  if(!profile) throw new Error(`invalid risk level: ${risk}`);

  const [gold, saudiHoldings, usHoldings] = await Promise.all([
    getGoldPrice().catch(err => ({error:true, source:'gold', message: err.message})),
    Promise.all(profile.saudi.map(s =>
      getSaudiQuote(s.symbol, s.name).catch(err => ({error:true, source:'saudi', symbol:s.symbol, name:s.name, message: err.message}))
    )),
    Promise.all(profile.us.map(s =>
      getUsQuote(s.symbol, s.name).catch(err => ({error:true, source:'us', symbol:s.symbol, name:s.name, message: err.message}))
    ))
  ]);

  return {
    risk: profile.risk,
    label: profile.label,
    description: profile.description,
    allocation: profile.allocation,
    gold,
    saudi_holdings: saudiHoldings,
    us_holdings: usHoldings,
    generated_at: new Date().toISOString()
  };
}

module.exports = { RISK_PROFILES, buildInvestmentPlan };
