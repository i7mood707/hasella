const OPENROUTER_ADVISOR_API_KEY = process.env.OPENROUTER_ADVISOR_API_KEY;
const ADVISOR_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

const ADVISOR_SYSTEM_PROMPT = `أنت محلل مالي داخل تطبيق "حصيلة" لإدارة الأموال الشخصية في السعودية.
تستلم بيانات مالية حقيقية للمستخدم (الدخل، المصاريف حسب الفئة، الالتزامات الشهرية، والمبلغ المتبقي لأهداف الادخار)، ومهمتك تحليلها فقط — اعتمد حصرًا على الأرقام المُعطاة ولا تخترع أرقامًا غير موجودة فيها.
أجب حصريًا بكائن JSON بالشكل التالي بالضبط، بدون أي نص خارج الكائن:
{"financial_health_score": رقم من 0 إلى 100, "summary": "جملتين أو ثلاث بالعربية الفصحى المبسطة تلخص الوضع المالي العام", "flags": ["تحذير قصير 1", "تحذير قصير 2"], "recommendations": [{"title":"عنوان قصير","detail":"شرح موجز وقابل للتنفيذ","potential_saving": رقم أو null}]}
احسب financial_health_score بناءً على نسبة المصاريف والالتزامات إلى الدخل، ووجود فائض أو عجز شهري، وتقدّم أهداف الادخار.
flags تكون تحذيرات فقط عند وجود مشكلة فعلية واضحة في الأرقام (مثل التزامات تتجاوز نسبة معقولة من الدخل)، وإلا اتركها مصفوفة فارغة.
recommendations تكون 2 إلى 4 توصيات فقط، كل واحدة مبنية على فئة مصروف أو التزام محدد من البيانات المُعطاة، مع رقم توفير متوقع واقعي إن أمكن حسابه أو null إن لم يكن ممكنًا.
لا تكتب أي شرح أو مقدمة خارج كائن الـ JSON.`;

async function callOpenRouterAdvisor(messages, opts){
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method:'POST',
    headers:{
      'Authorization': `Bearer ${OPENROUTER_ADVISOR_API_KEY}`,
      'Content-Type': 'application/json; charset=utf-8',
      'HTTP-Referer': 'https://hasella.vercel.app',
      'X-Title': 'Hasella Advisor'
    },
    body: JSON.stringify({model: ADVISOR_MODEL, messages, ...opts})
  });
  if(!res.ok){
    const errText = await res.text().catch(()=> '');
    throw new Error(`upstream HTTP ${res.status}: ${errText.slice(0,300)}`);
  }
  const data = await res.json();
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if(!content) throw new Error('upstream returned no content');
  return content;
}

async function getFinancialAdvice(payload){
  if(!OPENROUTER_ADVISOR_API_KEY){
    const err = new Error('server missing OPENROUTER_ADVISOR_API_KEY');
    err.status = 500;
    throw err;
  }
  const { income, transactions, commitments, savings_goal } = payload || {};
  const messages = [
    {role:'system', content: ADVISOR_SYSTEM_PROMPT},
    {role:'user', content: JSON.stringify({income, transactions: transactions || [], commitments: commitments || [], savings_goal})}
  ];
  const raw = await callOpenRouterAdvisor(messages, {max_tokens: 700, temperature: 0.3, response_format: {type:'json_object'}});
  const advice = JSON.parse(raw);
  return advice;
}

module.exports = { getFinancialAdvice };
