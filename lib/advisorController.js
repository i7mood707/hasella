const Anthropic = require('@anthropic-ai/sdk');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ADVISOR_MODEL = 'claude-haiku-4-5';
const anthropic = new Anthropic({apiKey: ANTHROPIC_API_KEY});

const ADVISOR_SYSTEM_PROMPT = `أنت محلل مالي داخل تطبيق "حصيلة" لإدارة الأموال الشخصية في السعودية.
تستلم بيانات مالية حقيقية للمستخدم (الدخل، المصاريف حسب الفئة، الالتزامات الشهرية، والمبلغ المتبقي لأهداف الادخار)، ومهمتك تحليلها فقط — اعتمد حصرًا على الأرقام المُعطاة ولا تخترع أرقامًا غير موجودة فيها.
احسب financial_health_score بناءً على نسبة المصاريف والالتزامات إلى الدخل، ووجود فائض أو عجز شهري، وتقدّم أهداف الادخار.
flags تكون تحذيرات فقط عند وجود مشكلة فعلية واضحة في الأرقام (مثل التزامات تتجاوز نسبة معقولة من الدخل)، وإلا اتركها مصفوفة فارغة.
recommendations تكون 2 إلى 4 توصيات فقط، كل واحدة مبنية على فئة مصروف أو التزام محدد من البيانات المُعطاة، مع رقم توفير متوقع واقعي إن أمكن حسابه أو null إن لم يكن ممكنًا.`;

const ADVISOR_SCHEMA = {
  type: 'object',
  properties: {
    financial_health_score: {type: 'number', description: 'رقم من 0 إلى 100'},
    summary: {type: 'string', description: 'جملتين أو ثلاث بالعربية الفصحى المبسطة تلخص الوضع المالي العام'},
    flags: {type: 'array', items: {type: 'string'}},
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: {type: 'string'},
          detail: {type: 'string'},
          potential_saving: {type: ['number', 'null']}
        },
        required: ['title', 'detail', 'potential_saving'],
        additionalProperties: false
      }
    }
  },
  required: ['financial_health_score', 'summary', 'flags', 'recommendations'],
  additionalProperties: false
};

async function callAdvisorModel(userContent){
  let response;
  try{
    response = await anthropic.messages.create({
      model: ADVISOR_MODEL,
      max_tokens: 1600,
      temperature: 0.3,
      system: ADVISOR_SYSTEM_PROMPT,
      messages: [{role: 'user', content: userContent}],
      output_config: {format: {type: 'json_schema', schema: ADVISOR_SCHEMA}}
    });
  }catch(err){
    if(err instanceof Anthropic.RateLimitError){
      const e = new Error('تجاوزت حصة الطلبات المجانية اليومية لدى مزوّد الذكاء الاصطناعي — حاول لاحقًا بعد إعادة التعيين');
      e.status = 429;
      throw e;
    }
    const e = new Error(err.message || 'upstream request failed');
    e.status = err.status || 502;
    throw e;
  }
  const block = response.content.find(b => b.type === 'text');
  if(!block || !block.text) throw new Error('upstream returned no content');
  return block.text;
}

async function getFinancialAdvice(payload){
  if(!ANTHROPIC_API_KEY){
    const err = new Error('server missing ANTHROPIC_API_KEY');
    err.status = 500;
    throw err;
  }
  const { income, transactions, commitments, savings_goal } = payload || {};
  const userContent = JSON.stringify({income, transactions: transactions || [], commitments: commitments || [], savings_goal});
  return JSON.parse(await callAdvisorModel(userContent));
}

module.exports = { getFinancialAdvice };
