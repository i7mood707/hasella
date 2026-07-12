const http = require('http');
const fs = require('fs');
const path = require('path');
const { getGoldPrice } = require('./marketData/goldPrice');
const { getSaudiQuote } = require('./marketData/saudiMarket');
const { getUsQuote } = require('./marketData/usMarket');
const { RISK_PROFILES, buildInvestmentPlan } = require('./marketData/investmentPlans');

const PORT = process.env.PORT || 8743;
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const CHAT_MODEL = 'meta/llama-3.1-8b-instruct';
const ROOT = __dirname;

const MIME = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp',
  '.svg':'image/svg+xml; charset=utf-8', '.ico':'image/x-icon'
};

const SYSTEM_PROMPT = `أنت المستشار المالي الذكي داخل تطبيق "حصيلة" لإدارة الأموال الشخصية في السعودية.
لديك بيانات المستخدم المالية الحقيقية بصيغة JSON، اعتمد عليها حصرًا في إجاباتك ولا تختلق أرقامًا غير موجودة فيها.
أجب بإيجاز ووضوح باللهجة العربية الفصحى المبسطة، بأسلوب ودود ومباشر، بدون مقدمات طويلة.
إذا سُئلت عن توصية استثمارية محددة خارج بيانات المستخدم، وضّح أن هذا رأي عام وليس نصيحة استثمارية معتمدة.
يمكنك أيضًا إنشاء تحويل تلقائي متكرر (أتمتة) للمستخدم عند طلبه صراحة، مثل "حوّل لمحمد 100 ريال كل شهر".
مهم جدًا: لا تفترض أو تختلق أي تفصيل غير مذكور صراحة من المستخدم (اسم المستلم أو المبلغ أو التكرار). إذا كان الطلب مكتملاً (يوجد اسم مستلم ومبلغ رقمي واضحان في كلام المستخدم)، أكّد بجملة طبيعية موجزة بنفس التفاصيل التي ذكرها فقط، بدون أي رموز أو صيغ خاصة في ردك.
إذا كان الطلب ناقصًا (لا يوجد مبلغ محدد، أو لا يوجد اسم مستلم واضح)، لا تؤكد إنشاء أي تحويل إطلاقًا، واسأل المستخدم مباشرة عن المعلومة الناقصة فقط.
إذا طلب المستخدم خطة أو صندوق استثماري: هناك ثلاثة مستويات مخاطرة متاحة فقط هي "منخفض المخاطرة" و"متوسط المخاطرة" و"مرتفع المخاطرة"، وكل مستوى عبارة عن صندوق يجمع بين الذهب والأسهم السعودية والأسهم الأمريكية بنسب مختلفة.
إذا لم يحدد المستخدم مستوى المخاطرة، اسأله يختار بين الثلاثة بالضبط بهذه الأسماء. لا تذكر أبدًا أي أسعار أو أسماء أسهم أو نسب توزيع بنفسك مهما كانت الحالة — بيانات الصندوق الحقيقية (بالأسعار الحية) تُعرض تلقائيًا من النظام بمجرد تحديد المستخدم لمستوى المخاطرة، فقط أخبره بجملة قصيرة أن الخطة جاهزة بالأسفل.`;

const AUTOMATION_INTENT_PROMPT = `مهمتك الوحيدة: تحليل آخر رسالة من المستخدم (مع الأخذ بعين الاعتبار سياق المحادثة) لمعرفة إن كان يطلب صراحة إنشاء تحويل مالي تلقائي متكرر (أتمتة) لشخص أو جهة معينة بمبلغ محدد.
أجب حصريًا بكائن JSON بأحد الشكلين التاليين، بدون أي نص إضافي:
إذا كان الطلب واضحًا ومكتملاً (يوجد اسم مستلم ومبلغ رقمي):
{"create_automation":true,"recipient":"اسم المستلم","amount":100,"frequency":"شهريًا"}
حيث frequency تكون واحدة فقط من "شهريًا" أو "أسبوعيًا" أو "يوميًا" (استنتجها من الرسالة، وإن لم تُذكر استخدم "شهريًا").
إذا لم يكن طلب أتمتة تحويل، أو كان ناقص المعلومات (لا يوجد اسم مستلم أو لا يوجد مبلغ):
{"create_automation":false}`;

const INVESTMENT_PLAN_INTENT_PROMPT = `مهمتك الوحيدة: تحليل رسالة المستخدم الأخيرة (مع سياق المحادثة) لمعرفة إذا كان يطلب خطة أو صندوق استثماري، وما مستوى المخاطرة الذي حدده إن وُجد.
مستويات المخاطرة الممكنة فقط: "low" (منخفض) أو "medium" (متوسط) أو "high" (مرتفع).
أجب حصريًا بكائن JSON بأحد الأشكال التالية، بدون أي نص إضافي:
إذا كان يطلب خطة استثمار وحدد مستوى المخاطرة صراحة (بالعربي أو الإنجليزي، أو ما يرادفها مثل "منخفض/آمن" أو "مرتفع/عالي المخاطرة"):
{"wants_plan":true,"risk":"low"}
{"wants_plan":true,"risk":"medium"}
{"wants_plan":true,"risk":"high"}
إذا كان يطلب خطة استثمار لكن لم يحدد مستوى المخاطرة بعد:
{"wants_plan":true,"risk":null}
إذا لم يكن يطلب خطة استثمار إطلاقًا:
{"wants_plan":false}`;

async function callNvidia(messages, opts){
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method:'POST',
    headers:{
      'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({model: CHAT_MODEL, messages, ...opts})
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

async function callChatModel(question, context, history, automationGroundTruth, planState){
  const automationNote = automationGroundTruth
    ? `\n\nحقيقة مؤكدة: تم بالفعل إنشاء تحويل تلقائي بمبلغ ${automationGroundTruth.amount} ريال ${automationGroundTruth.frequency} إلى ${automationGroundTruth.recipient}. أخبر المستخدم بذلك بجملة قصيرة ومباشرة، ولا تذكر أي تفاصيل أخرى غير هذه.`
    : `\n\nحقيقة مؤكدة: لم يتم إنشاء أي تحويل تلقائي جديد حتى الآن. إذا كانت رسالة المستخدم الأخيرة طلب إنشاء تحويل تلقائي وينقصها اسم المستلم أو المبلغ، اسأله عن المعلومة الناقصة تحديدًا. لا تدّعي إطلاقًا أنك أنشأت أي تحويل ولا تذكر أي مبلغ لم يذكره المستخدم بنفسه.`;
  const messages = [
    {role:'system', content: SYSTEM_PROMPT + automationNote + planGroundTruthNote(planState) + '\n\nبيانات المستخدم المالية:\n' + JSON.stringify(context)},
    ...(history || []),
    {role:'user', content: question}
  ];
  return callNvidia(messages, {max_tokens: 400, temperature: 0.4});
}

function numbersMentionedIn(text){
  return (String(text || '').match(/\d+(?:\.\d+)?/g) || []).map(Number);
}

async function classifyAutomationIntent(question, history){
  const messages = [
    {role:'system', content: AUTOMATION_INTENT_PROMPT},
    ...(history || []).slice(-4),
    {role:'user', content: question}
  ];
  try{
    const raw = await callNvidia(messages, {max_tokens: 120, temperature: 0, response_format: {type:'json_object'}});
    const parsed = JSON.parse(raw);
    if(parsed && parsed.create_automation === true && parsed.recipient && parsed.amount){
      const amount = Number(parsed.amount);
      const mentionedNumbers = [question, ...(history||[]).map(h=>h.content)].flatMap(numbersMentionedIn);
      if(!mentionedNumbers.includes(amount)){
        return null; // model invented an amount the user never actually said — refuse to act on it
      }
      return {recipient: String(parsed.recipient), amount, frequency: String(parsed.frequency || 'شهريًا')};
    }
    return null;
  }catch(err){
    return null;
  }
}

async function classifyInvestmentPlanIntent(question, history){
  const messages = [
    {role:'system', content: INVESTMENT_PLAN_INTENT_PROMPT},
    ...(history || []).slice(-4),
    {role:'user', content: question}
  ];
  try{
    const raw = await callNvidia(messages, {max_tokens: 60, temperature: 0, response_format: {type:'json_object'}});
    const parsed = JSON.parse(raw);
    if(!parsed || parsed.wants_plan !== true) return undefined; // not an investment-plan request at all
    const risk = ['low', 'medium', 'high'].includes(parsed.risk) ? parsed.risk : null;
    return {risk};
  }catch(err){
    return undefined;
  }
}

function planGroundTruthNote(planState){
  if(!planState) return '';
  if(planState.state === 'ask'){
    return `\n\nحقيقة مؤكدة: المستخدم يطلب خطة استثمار لكنه لم يحدد مستوى المخاطرة بعد. اسأله يختار بين "منخفض المخاطرة" أو "متوسط المخاطرة" أو "مرتفع المخاطرة" فقط، ولا تذكر أي أسعار أو أسهم أو نسب توزيع بنفسك.`;
  }
  if(planState.state === 'ready'){
    return `\n\nحقيقة مؤكدة: خطة استثمار "${planState.label}" جاهزة الآن وستُعرض للمستخدم تلقائيًا كبطاقة تفصيلية بالأسعار الحية أسفل ردك مباشرة. اكتفِ بجملة قصيرة تشير إلى أن الخطة جاهزة بالأسفل، ولا تذكر أي أسعار أو أسهم أو نسب بنفسك.`;
  }
  if(planState.state === 'error'){
    return `\n\nحقيقة مؤكدة: حاول النظام جلب بيانات خطة استثمار لكن حدث خطأ تقني في جلب الأسعار الحية. اعتذر للمستخدم بإيجاز واطلب منه المحاولة مرة أخرى بعد لحظات، ولا تقترح أي أرقام بديلة بنفسك.`;
  }
  return '';
}

function sendJson(res, status, body){
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8'});
  res.end(JSON.stringify(body));
}

async function handleMarketRoute(req, res, pathname, searchParams){
  if(pathname !== '/api/market/gold'
    && !pathname.startsWith('/api/market/saudi/')
    && !pathname.startsWith('/api/market/us/')
    && pathname !== '/api/market/summary'
    && pathname !== '/api/market/investment-plan'){
    return false; // not a market route — let the caller fall through to static file serving
  }
  try{
    if(pathname === '/api/market/gold'){
      sendJson(res, 200, await getGoldPrice());
      return true;
    }
    if(pathname.startsWith('/api/market/saudi/')){
      const symbol = decodeURIComponent(pathname.split('/').pop());
      if(!symbol){ sendJson(res, 400, {error:true, source:'saudi', message:'missing symbol'}); return true; }
      sendJson(res, 200, await getSaudiQuote(symbol));
      return true;
    }
    if(pathname.startsWith('/api/market/us/')){
      const symbol = decodeURIComponent(pathname.split('/').pop());
      if(!symbol){ sendJson(res, 400, {error:true, source:'us', message:'missing symbol'}); return true; }
      sendJson(res, 200, await getUsQuote(symbol));
      return true;
    }
    if(pathname === '/api/market/summary'){
      const [gold, saudi, us] = await Promise.all([
        getGoldPrice().catch(err => ({error:true, source:'gold', message: err.message})),
        getSaudiQuote('2222', 'أرامكو السعودية').catch(err => ({error:true, source:'saudi', message: err.message})),
        getUsQuote('AAPL', 'Apple').catch(err => ({error:true, source:'us', message: err.message}))
      ]);
      sendJson(res, 200, {gold, saudi, us});
      return true;
    }
    if(pathname === '/api/market/investment-plan'){
      const risk = searchParams.get('risk');
      if(!RISK_PROFILES[risk]){
        sendJson(res, 400, {error:true, source:'investment-plan', message:'risk must be one of: low, medium, high'});
        return true;
      }
      sendJson(res, 200, await buildInvestmentPlan(risk));
      return true;
    }
  }catch(err){
    sendJson(res, 502, {error:true, source:'market', message: err.message});
  }
  return true;
}

function serveStatic(req, res){
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if(reqPath === '/') reqPath = '/index.html';
  const filePath = path.normalize(path.join(ROOT, reqPath));
  if(!filePath.startsWith(ROOT)){
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, data)=>{
    if(err){ res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {'Content-Type': MIME[ext] || 'application/octet-stream'});
    res.end(data);
  });
}

const server = http.createServer((req, res)=>{
  if(req.method === 'POST' && req.url === '/api/chat'){
    let body = '';
    req.on('data', chunk=> body += chunk);
    req.on('end', async ()=>{
      try{
        const { question, context, history } = JSON.parse(body);
        if(!question || typeof question !== 'string'){
          res.writeHead(400, {'Content-Type':'application/json; charset=utf-8'});
          res.end(JSON.stringify({error:'missing question'}));
          return;
        }
        if(!NVIDIA_API_KEY){
          res.writeHead(500, {'Content-Type':'application/json; charset=utf-8'});
          res.end(JSON.stringify({error:'server missing NVIDIA_API_KEY'}));
          return;
        }
        const automation = await classifyAutomationIntent(question, history || []);

        const investmentIntent = await classifyInvestmentPlanIntent(question, history || []);
        let investmentPlan = null;
        let planState;
        if(investmentIntent === undefined){
          planState = undefined;
        } else if(!investmentIntent.risk){
          planState = {state:'ask'};
        } else {
          try{
            investmentPlan = await buildInvestmentPlan(investmentIntent.risk);
            planState = {state:'ready', label: investmentPlan.label};
          }catch(err){
            planState = {state:'error'};
          }
        }

        let answer = await callChatModel(question, context || {}, history || [], automation, planState);
        const claimsSuccess = /تم إنشاء|قمت بإنشاء|تم تفعيل|تم تحويل|سيتم تحويل|سأنشئ|أنشأت|✅/.test(answer);
        if(!automation && claimsSuccess){
          // model claimed it created an automation despite the verified ground truth saying otherwise — never let a false claim reach the user
          answer = 'محتاج أعرف اسم المستلم والمبلغ بالضبط عشان أقدر أنشئ التحويل التلقائي — تقدر تكتبهم لي؟';
        }
        res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
        res.end(JSON.stringify({answer, automation, investmentPlan}));
      }catch(err){
        res.writeHead(502, {'Content-Type':'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: err.message}));
      }
    });
    return;
  }
  if(req.method === 'GET'){
    const { pathname, searchParams } = new URL(req.url, 'http://localhost');
    if(pathname.startsWith('/api/market/')){
      handleMarketRoute(req, res, pathname, searchParams).then(handled=>{
        if(!handled) serveStatic(req, res);
      });
      return;
    }
    serveStatic(req, res);
    return;
  }
  res.writeHead(405); res.end('Method not allowed');
});

server.listen(PORT, ()=>{
  console.log(`hasella server running on http://localhost:${PORT}`);
});
