const { buildInvestmentPlan } = require('../marketData/investmentPlans');
const { getMusanedWorkers } = require('../marketData/musaned');

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const CHAT_MODEL = 'meta/llama-3.1-8b-instruct';

const SYSTEM_PROMPT = `أنت المستشار المالي الذكي داخل تطبيق "حصيلة" لإدارة الأموال الشخصية في السعودية.
لديك بيانات المستخدم المالية الحقيقية بصيغة JSON، اعتمد عليها حصرًا في إجاباتك ولا تختلق أرقامًا غير موجودة فيها.
أجب بإيجاز ووضوح باللهجة العربية الفصحى المبسطة، بأسلوب ودود ومباشر، بدون مقدمات طويلة.
إذا سُئلت عن توصية استثمارية محددة خارج بيانات المستخدم، وضّح أن هذا رأي عام وليس نصيحة استثمارية معتمدة.
يمكنك أيضًا إنشاء تحويل تلقائي متكرر (أتمتة) للمستخدم عند طلبه صراحة، مثل "حوّل لمحمد 100 ريال كل شهر".
يمكنك أيضًا إنشاء هدف ادخار مالي جديد للمستخدم عند طلبه صراحة، مثل "ابغى هدف عمرة العائلة بمبلغ 15000 ريال".
مهم جدًا: لا تفترض أو تختلق أي تفصيل غير مذكور صراحة من المستخدم (اسم المستلم أو المبلغ أو التكرار). إذا كان الطلب مكتملاً (يوجد اسم مستلم ومبلغ رقمي واضحان في كلام المستخدم)، أكّد بجملة طبيعية موجزة بنفس التفاصيل التي ذكرها فقط، بدون أي رموز أو صيغ خاصة في ردك.
إذا كان الطلب ناقصًا (لا يوجد مبلغ محدد، أو لا يوجد اسم مستلم واضح)، لا تؤكد إنشاء أي تحويل إطلاقًا، واسأل المستخدم مباشرة عن المعلومة الناقصة فقط.
استثناء: إذا طلب المستخدم تحويل راتب عامل أو عاملة منزلية (خادمة، سائق، طباخ، عامل نظافة)، فلا تسأله عن الاسم أو المبلغ إطلاقًا — هذه البيانات تُجلب تلقائيًا من منصة "مساند" الرسمية ويوفرها لك النظام مباشرة.
إذا طلب المستخدم خطة أو صندوق استثماري: هناك ثلاثة مستويات مخاطرة متاحة فقط هي "منخفض المخاطرة" و"متوسط المخاطرة" و"مرتفع المخاطرة"، وكل مستوى عبارة عن صندوق يجمع بين الذهب والأسهم السعودية والأسهم الأمريكية بنسب مختلفة.
إذا لم يحدد المستخدم مستوى المخاطرة، اسأله يختار بين الثلاثة بالضبط بهذه الأسماء. لا تذكر أبدًا أي أسعار أو أسماء أسهم أو نسب توزيع بنفسك مهما كانت الحالة — بيانات الصندوق الحقيقية (بالأسعار الحية) تُعرض تلقائيًا من النظام بمجرد تحديد المستخدم لمستوى المخاطرة، فقط أخبره بجملة قصيرة أن الخطة جاهزة بالأسفل.
بيانات المستخدم قد تتضمن حقل "savings_goals" (أهداف ادخار حدّدها المستخدم بنفسه، كل هدف فيه اسم ومبلغ مستهدف ومبلغ مدّخر حاليًا ونسبة تقدّم وموعد مستهدف اختياري). إذا كانت موجودة، اربط نصيحتك بها كلما كان ذلك مناسبًا للسؤال: اذكر الفجوة المتبقية (remaining) بينه وبين الهدف، وإذا كان هناك موعد مستهدف احسب تقريبيًا المبلغ الشهري اللازم للوصول للهدف في وقته بناءً على المدة المتبقية. لا تخترع هدفًا غير موجود في البيانات، ولا تذكر أهدافًا إذا لم يوجد الحقل أو كان فارغًا.
مهم جدًا بخصوص نطاق الحديث: أنت مختص حصرًا بالمال الشخصي (الميزانية، المصاريف، الديون، الادخار، الاستثمار، التحويلات). ممنوع منعًا باتًا أن تذكر أي نصيحة أو توجيه خارج المال — دينية أو صحية أو اجتماعية أو عبادات أو عادات يومية — حتى لو كان سؤال المستخدم يتضمن مناسبة أو سياق غير مالي (مثل رمضان أو العيد أو سفر). لا تقل مثلاً "ركّز على الصلاة" أو "احرص على صحتك" أو أي جملة من هذا النوع مهما كانت الحالة.
إذا كان سؤال المستخدم غامضًا أو يتطرق لموضوع غير مالي: إذا كان هناك جانب مالي واضح ومنطقي مرتبط بالموضوع (مثل ميزانية رمضان أو مصاريف العيد أو تكاليف مناسبة معينة)، اقتصر ردك حصرًا على ذلك الجانب المالي (مثلاً: تقليل المصاريف، تأجيل الالتزامات، ضبط الميزانية) بدون أي إضافة من خارج المال. إذا لم يوجد أي جانب مالي منطقي إطلاقًا، وضّح بلطف وإيجاز أنك مختص بالمال الشخصي فقط واطلب من المستخدم توضيح سؤاله المالي.`;

const AUTOMATION_INTENT_PROMPT = `مهمتك الوحيدة: تحليل آخر رسالة من المستخدم (مع الأخذ بعين الاعتبار سياق المحادثة) لمعرفة إن كان يطلب صراحة إنشاء تحويل مالي تلقائي متكرر (أتمتة) لشخص أو جهة معينة بمبلغ محدد.
أجب حصريًا بكائن JSON بأحد الشكلين التاليين، بدون أي نص إضافي:
إذا كان الطلب واضحًا ومكتملاً (يوجد اسم مستلم ومبلغ رقمي):
{"create_automation":true,"recipient":"اسم المستلم","amount":100,"frequency":"شهريًا"}
حيث frequency تكون واحدة فقط من "شهريًا" أو "أسبوعيًا" أو "يوميًا" (استنتجها من الرسالة، وإن لم تُذكر استخدم "شهريًا").
إذا لم يكن طلب أتمتة تحويل، أو كان ناقص المعلومات (لا يوجد اسم مستلم أو لا يوجد مبلغ):
{"create_automation":false}`;

const DOMESTIC_WORKER_INTENT_PROMPT = `مهمتك الوحيدة: حدد إذا كانت آخر رسالة من المستخدم (مع سياق المحادثة) تطلب إنشاء أو تفعيل تحويل تلقائي متكرر لراتب عامل أو عاملة منزلية (خادمة، سائق خاص، طباخ، عامل نظافة منزلي)، بغض النظر عن ذكر اسم العامل أو المبلغ من عدمه — لأن هذه البيانات تُجلب تلقائيًا من منصة "مساند".
أجب حصريًا بكائن JSON بأحد الشكلين التاليين، بدون أي نص إضافي:
{"is_domestic_worker_payroll":true}
{"is_domestic_worker_payroll":false}`;

const GOAL_INTENT_PROMPT = `مهمتك الوحيدة: تحليل آخر رسالة من المستخدم (مع سياق المحادثة) لمعرفة إن كان يطلب صراحة إنشاء هدف ادخار مالي جديد باسم ومبلغ مستهدف محددين.
أجب حصريًا بكائن JSON بأحد الشكلين التاليين، بدون أي نص إضافي:
إذا كان الطلب واضحًا ومكتملاً (يوجد اسم هدف ومبلغ مستهدف رقمي):
{"create_goal":true,"name":"اسم الهدف","target_amount":15000,"target_date":"2026-12-31"}
حيث target_date اختياري (null إن لم يُذكر تاريخ أو موعد مستهدف صراحة).
إذا لم يكن طلب إنشاء هدف، أو كان ناقص المعلومات (لا يوجد اسم أو لا يوجد مبلغ مستهدف):
{"create_goal":false}`;

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

const BEST_OPPORTUNITY_INTENT_PROMPT = `مهمتك الوحيدة: حدد إذا كانت آخر رسالة من المستخدم (مع سياق المحادثة) تسأل عن أفضل الفرص الاستثمارية بالأسهم المتوفرة، أو أي سهم يشتري الآن، أو تطلب ترتيب الأسهم من الأفضل للأسوأ كفرصة استثمارية.
أجب حصريًا بكائن JSON بأحد الشكلين التاليين، بدون أي نص إضافي:
{"wants_best_opportunities":true}
{"wants_best_opportunities":false}`;

const INVESTOR_STUDIES_NOTE = `

حقيقة مؤكدة: المستخدم يسأل عن أفضل الفرص الاستثمارية بالأسهم. حلّل الأسهم المتوفرة في بيانات المستخدم تحت الحقل "stocks_market" فقط (الأسعار ونسب التغيّر اليومي المعطاة حقيقية، اعتمد عليها حصرًا ولا تخترع أرقامًا غير موجودة)، وقيّمها مجتمعة باستخدام فلسفات الاستثمار الست التالية معًا لكل سهم:
- وارن بافيت: قيمة استثمارية طويلة الأمد، ميزة تنافسية دائمة (خندق اقتصادي)، أرباح وإدارة مستقرة.
- بنجامين جراهام: هامش أمان واضح، سعر أقل من القيمة الجوهرية، حذر شديد من المضاربة.
- بيتر لينش: نمو بسعر معقول (GARP)، شركات مفهومة وقريبة من المستهلك اليومي.
- جورج سوروس: قراءة الاتجاهات الكبرى واختلال السعر عن الواقع الاقتصادي، جرأة عند وضوح الفرصة.
- كارل إيكان: فرص نشطة في شركات مقيّمة بأقل من قيمتها الحقيقية مع محرّك تحسّن واضح.
- جيسي ليفرمور: زخم واتجاه السعر والحجم، دخول مع الاتجاه الصاعد وخروج سريع عند انقلابه.
رتّب الأسهم المتوفرة من الأفضل للأسوأ فرصة حاليًا بناءً على مجموع هذه الفلسفات الست، واذكر لكل سهم رقم ترتيبه، اسمه ورمزه، وسببًا موجزًا بسطر أو سطرين. لا تخصص فقرة منفصلة لكل مستثمر — وازن بين الفلسفات الست معًا بكل سهم. اذكر في بداية ردك بجملة قصيرة أن هذا تحليل عام مبني على منهجيات استثمارية معروفة وليس توصية استثمارية معتمدة.`;

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

function numbersMentionedIn(text){
  return (String(text || '').match(/\d+(?:\.\d+)?/g) || []).map(Number);
}

const DOMESTIC_WORKER_KEYWORDS = ['عامل','عاملة','عمالة','خادم','خادمة','خدم','سائق','طباخ','طباخة','نظافة','منزلي','منزلية','مساند'];
function mentionsDomesticWorker(text){
  const t = String(text || '');
  return DOMESTIC_WORKER_KEYWORDS.some(k => t.includes(k));
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
      const mentionedNumbers = numbersMentionedIn(question);
      if(!mentionedNumbers.includes(amount)){
        return null; // amount isn't in the CURRENT message — refuse to act on a number only seen earlier in history (stale-context hallucination)
      }
      return {recipient: String(parsed.recipient), amount, frequency: String(parsed.frequency || 'شهريًا')};
    }
    return null;
  }catch(err){
    return null;
  }
}

async function classifyDomesticWorkerIntent(question, history){
  if(!mentionsDomesticWorker(question)) return false; // current message must literally reference a domestic worker — don't trust stale conversation history
  const messages = [
    {role:'system', content: DOMESTIC_WORKER_INTENT_PROMPT},
    ...(history || []).slice(-4),
    {role:'user', content: question}
  ];
  try{
    const raw = await callNvidia(messages, {max_tokens: 40, temperature: 0, response_format: {type:'json_object'}});
    const parsed = JSON.parse(raw);
    return !!(parsed && parsed.is_domestic_worker_payroll === true);
  }catch(err){
    return false;
  }
}

async function classifyGoalIntent(question, history){
  const messages = [
    {role:'system', content: GOAL_INTENT_PROMPT},
    ...(history || []).slice(-4),
    {role:'user', content: question}
  ];
  try{
    const raw = await callNvidia(messages, {max_tokens: 120, temperature: 0, response_format: {type:'json_object'}});
    const parsed = JSON.parse(raw);
    if(parsed && parsed.create_goal === true && parsed.name && parsed.target_amount){
      const amount = Number(parsed.target_amount);
      const mentionedNumbers = numbersMentionedIn(question);
      if(!mentionedNumbers.includes(amount)){
        return null; // amount isn't in the CURRENT message — refuse to act on a number only seen earlier in history (stale-context hallucination)
      }
      return {name: String(parsed.name), targetAmount: amount, targetDate: parsed.target_date || null};
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

async function classifyBestOpportunityIntent(question, history){
  const messages = [
    {role:'system', content: BEST_OPPORTUNITY_INTENT_PROMPT},
    ...(history || []).slice(-4),
    {role:'user', content: question}
  ];
  try{
    const raw = await callNvidia(messages, {max_tokens: 40, temperature: 0, response_format: {type:'json_object'}});
    const parsed = JSON.parse(raw);
    return !!(parsed && parsed.wants_best_opportunities === true);
  }catch(err){
    return false;
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

function goalGroundTruthNote(goalIntent){
  return goalIntent
    ? `\n\nحقيقة مؤكدة: تم بالفعل إنشاء هدف ادخار جديد باسم "${goalIntent.name}" بمبلغ مستهدف ${goalIntent.targetAmount} ريال${goalIntent.targetDate ? ` بموعد مستهدف ${goalIntent.targetDate}` : ''}. أخبر المستخدم بذلك بجملة قصيرة ومباشرة، ولا تذكر أي تفاصيل أخرى غير هذه.`
    : `\n\nحقيقة مؤكدة: لم يتم إنشاء أي هدف ادخار جديد حتى الآن. إذا كانت رسالة المستخدم الأخيرة طلب إنشاء هدف وينقصها اسم الهدف أو المبلغ المستهدف، اسأله عن المعلومة الناقصة تحديدًا. لا تدّعي إطلاقًا أنك أنشأت أي هدف ولا تذكر أي مبلغ لم يذكره المستخدم بنفسه.`;
}

async function callChatModel(question, context, history, automationGroundTruth, planState, goalIntent, wantsBestOpportunities){
  const automationNote = automationGroundTruth
    ? (automationGroundTruth.source === 'musaned'
        ? `\n\nحقيقة مؤكدة: جلب النظام بيانات العامل من منصة "مساند" وأنشأ تحويلاً تلقائيًا شهريًا بمبلغ ${automationGroundTruth.amount} ريال إلى ${automationGroundTruth.recipient} (${automationGroundTruth.jobTitle}). أخبر المستخدم بذلك بجملة قصيرة ومباشرة تذكر أن البيانات جاءت من مساند، ولا تذكر أي تفاصيل أخرى غير هذه.`
        : `\n\nحقيقة مؤكدة: تم بالفعل إنشاء تحويل تلقائي بمبلغ ${automationGroundTruth.amount} ريال ${automationGroundTruth.frequency} إلى ${automationGroundTruth.recipient}. أخبر المستخدم بذلك بجملة قصيرة ومباشرة، ولا تذكر أي تفاصيل أخرى غير هذه.`)
    : `\n\nحقيقة مؤكدة: لم يتم إنشاء أي تحويل تلقائي جديد حتى الآن. إذا كانت رسالة المستخدم الأخيرة طلب إنشاء تحويل تلقائي وينقصها اسم المستلم أو المبلغ، اسأله عن المعلومة الناقصة تحديدًا. لا تدّعي إطلاقًا أنك أنشأت أي تحويل ولا تذكر أي مبلغ لم يذكره المستخدم بنفسه.`;
  const bestOpportunityNote = wantsBestOpportunities ? INVESTOR_STUDIES_NOTE : '';
  const messages = [
    {role:'system', content: SYSTEM_PROMPT + automationNote + planGroundTruthNote(planState) + goalGroundTruthNote(goalIntent) + bestOpportunityNote + '\n\nبيانات المستخدم المالية:\n' + JSON.stringify(context)},
    ...(history || []),
    {role:'user', content: question}
  ];
  return callNvidia(messages, {max_tokens: 700, temperature: 0.4});
}

async function handleChatRequest(question, context, history){
  if(!NVIDIA_API_KEY){
    const err = new Error('server missing NVIDIA_API_KEY');
    err.status = 500;
    throw err;
  }

  let automation = null;
  const isDomesticWorkerPayroll = await classifyDomesticWorkerIntent(question, history || []);
  if(isDomesticWorkerPayroll){
    const workers = await getMusanedWorkers();
    if(workers && workers[0]){
      const w = workers[0];
      automation = {recipient: w.name, amount: w.monthlySalary, frequency: 'شهريًا', source: 'musaned', jobTitle: w.jobTitle};
    }
  }
  if(!automation){
    automation = await classifyAutomationIntent(question, history || []);
  }

  const goal = await classifyGoalIntent(question, history || []);
  const wantsBestOpportunities = await classifyBestOpportunityIntent(question, history || []);

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

  let answer = await callChatModel(question, context || {}, history || [], automation, planState, goal, wantsBestOpportunities);
  const claimsSuccess = /تم إنشاء|قمت بإنشاء|تم تفعيل|تم تحويل|سيتم تحويل|سأنشئ|أنشأت|✅/.test(answer);
  if(!automation && !goal && claimsSuccess){
    // model claimed it created an automation/goal despite the verified ground truth saying otherwise — never let a false claim reach the user
    answer = 'محتاج أعرف التفاصيل بالضبط (مثل اسم المستلم والمبلغ، أو اسم الهدف والمبلغ المستهدف) عشان أقدر أنفّذ طلبك — تقدر تكتبها لي؟';
  }

  return {answer, automation, investmentPlan, goal};
}

module.exports = { handleChatRequest };
