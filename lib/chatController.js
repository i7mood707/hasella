const { getMusanedWorkers } = require('../marketData/musaned');
const Anthropic = require('@anthropic-ai/sdk');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CHAT_MODEL = 'claude-haiku-4-5';
const anthropic = new Anthropic({apiKey: ANTHROPIC_API_KEY});

const SYSTEM_PROMPT = `أنت المستشار المالي الذكي داخل تطبيق "حصيلة" لإدارة الأموال الشخصية في السعودية.
لديك بيانات المستخدم المالية الحقيقية بصيغة JSON، اعتمد عليها حصرًا في إجاباتك ولا تختلق أرقامًا غير موجودة فيها.
أجب بإيجاز ووضوح باللهجة العربية الفصحى المبسطة، بأسلوب ودود ومباشر، بدون مقدمات طويلة.
ممنوع منعًا باتًا أن تعطي نصيحة عامة مجردة بدون أرقام (مثل "قلل مصاريفك غير الضرورية" فقط) إذا كانت بيانات المستخدم تحتوي على ما يخدم السؤال. ابحث دائمًا في البيانات (categories، transactions، income، expenses، debts، savings_goals، بحسب توفرها) عن الأرقام والفئات ذات الصلة المباشرة بسؤال المستخدم، واستخدمها بالاسم والمبلغ صراحة في ردك (مثلاً: اذكر أعلى فئة مصروف وقيمتها، أو الفرق بين الدخل والمصروف، أو مبلغ محدد يقترح تقليصه من فئة بعينها). لا تكتفِ بصياغة نصيحة صالحة لأي شخص — اجعلها مبنية على وضع هذا المستخدم تحديدًا وظروفه وأهدافه.
إذا سُئلت عن توصية استثمارية محددة خارج بيانات المستخدم، وضّح أن هذا رأي عام وليس نصيحة استثمارية معتمدة.
يمكنك أيضًا إنشاء تحويل تلقائي متكرر (أتمتة) للمستخدم عند طلبه صراحة، مثل "حوّل لمحمد 100 ريال كل شهر".
يمكنك أيضًا إنشاء هدف ادخار مالي جديد للمستخدم عند طلبه صراحة، مثل "ابغى هدف عمرة العائلة بمبلغ 15000 ريال".
يمكنك أيضًا إنشاء رمز "مدّ" (رمز دفع مؤقت) للمستخدم عند طلبه صراحة بمبلغ محدد، مثل "سوّي مدّ بمبلغ 500 ريال". إذا لم يذكر اسم حساب معيّن يُستخدم حسابه الرئيسي تلقائيًا، وإذا لم يذكر مدة معينة يكون الرمز صالحًا لاستخدام واحد فقط.
مهم جدًا: لا تفترض أو تختلق أي تفصيل غير مذكور صراحة من المستخدم (اسم المستلم أو المبلغ أو التكرار). إذا كان الطلب مكتملاً (يوجد اسم مستلم ومبلغ رقمي واضحان في كلام المستخدم)، أكّد بجملة طبيعية موجزة بنفس التفاصيل التي ذكرها فقط، بدون أي رموز أو صيغ خاصة في ردك.
إذا كان الطلب ناقصًا (لا يوجد مبلغ محدد، أو لا يوجد اسم مستلم واضح)، لا تؤكد إنشاء أي تحويل إطلاقًا، واسأل المستخدم مباشرة عن المعلومة الناقصة فقط.
استثناء: إذا طلب المستخدم تحويل راتب عامل أو عاملة منزلية (خادمة، سائق، طباخ، عامل نظافة)، فلا تسأله عن الاسم أو المبلغ إطلاقًا — هذه البيانات تُجلب تلقائيًا من منصة "مساند" الرسمية ويوفرها لك النظام مباشرة.
ممنوع منعًا باتًا أن تقترح شراء سهم معيّن، أو تذكر اسم سهم أو رمزه أو سعره كتوصية شراء، أو تقترح نقل أموال المستخدم من حساباته أو محفظته إلى الأسهم، إلا في حالة واحدة فقط: عندما يسأل المستخدم صراحة عن "أفضل الفرص الاستثمارية بالأسهم" أو ما شابه — عندها فقط اتبع التعليمات الإضافية المخصصة لتحليل الأسهم وترتيبها إن وُجدت.
إذا طلب المستخدم "خطة استثمار" بشكل عام، أو سأل كيف يستثمر فلوسه، أو أي سؤال استثماري لا يذكر فيه صراحة طلب "أفضل الفرص" بالأسهم: أعطه نصائح عامة فقط (نسبة مقترحة للادخار الشهري، أهمية صندوق الطوارئ، تنويع المدخرات، ربط النصيحة بأهدافه الادخارية إن وُجدت) بدون ذكر أي سهم أو صندوق أو منتج استثماري محدد بالاسم، ولا أي سعر أو رقم شراء.
بيانات المستخدم قد تتضمن حقل "savings_goals" (أهداف ادخار حدّدها المستخدم بنفسه، كل هدف فيه اسم ومبلغ مستهدف ومبلغ مدّخر حاليًا ونسبة تقدّم وموعد مستهدف اختياري). إذا كانت موجودة، اربط نصيحتك بها كلما كان ذلك مناسبًا للسؤال: اذكر الفجوة المتبقية (remaining) بينه وبين الهدف، وإذا كان هناك موعد مستهدف احسب تقريبيًا المبلغ الشهري اللازم للوصول للهدف في وقته بناءً على المدة المتبقية. لا تخترع هدفًا غير موجود في البيانات، ولا تذكر أهدافًا إذا لم يوجد الحقل أو كان فارغًا.
مهم جدًا بخصوص نطاق الحديث: أنت مختص حصرًا بالمال الشخصي (الميزانية، المصاريف، الديون، الادخار، الاستثمار، التحويلات). ممنوع منعًا باتًا أن تذكر أي نصيحة أو توجيه خارج المال — دينية أو صحية أو اجتماعية أو عبادات أو عادات يومية — حتى لو كان سؤال المستخدم يتضمن مناسبة أو سياق غير مالي (مثل رمضان أو العيد أو سفر). لا تقل مثلاً "ركّز على الصلاة" أو "احرص على صحتك" أو أي جملة من هذا النوع مهما كانت الحالة.
إذا كان سؤال المستخدم غامضًا أو يتطرق لموضوع غير مالي: إذا كان هناك جانب مالي واضح ومنطقي مرتبط بالموضوع (مثل ميزانية رمضان أو مصاريف العيد أو تكاليف مناسبة معينة)، اقتصر ردك حصرًا على ذلك الجانب المالي (مثلاً: تقليل المصاريف، تأجيل الالتزامات، ضبط الميزانية) بدون أي إضافة من خارج المال. إذا لم يوجد أي جانب مالي منطقي إطلاقًا، وضّح بلطف وإيجاز أنك مختص بالمال الشخصي فقط واطلب من المستخدم توضيح سؤاله المالي.`;

const AUTOMATION_INTENT_PROMPT = `مهمتك الوحيدة: تحليل آخر رسالة من المستخدم (مع الأخذ بعين الاعتبار سياق المحادثة) لمعرفة إن كان يطلب صراحة إنشاء تحويل مالي تلقائي متكرر (أتمتة) لشخص أو جهة معينة بمبلغ محدد.
إذا لم يكن الطلب واضحًا ومكتملاً (لا يوجد اسم مستلم، أو لا يوجد مبلغ رقمي)، اجعل create_automation بقيمة false واترك بقية الحقول null.
frequency تكون واحدة فقط من "شهريًا" أو "أسبوعيًا" أو "يوميًا" (استنتجها من الرسالة، وإن لم تُذكر استخدم "شهريًا").`;

const DOMESTIC_WORKER_INTENT_PROMPT = `مهمتك الوحيدة: حدد إذا كانت آخر رسالة من المستخدم (مع سياق المحادثة) تطلب إنشاء أو تفعيل تحويل تلقائي متكرر لراتب عامل أو عاملة منزلية (خادمة، سائق خاص، طباخ، عامل نظافة منزلي)، بغض النظر عن ذكر اسم العامل أو المبلغ من عدمه — لأن هذه البيانات تُجلب تلقائيًا من منصة "مساند".`;

const GOAL_INTENT_PROMPT = `مهمتك الوحيدة: تحليل آخر رسالة من المستخدم (مع سياق المحادثة) لمعرفة إن كان يطلب صراحة إنشاء هدف ادخار مالي جديد باسم ومبلغ مستهدف محددين.
إذا لم يكن الطلب واضحًا ومكتملاً (لا يوجد اسم هدف، أو لا يوجد مبلغ مستهدف رقمي)، اجعل create_goal بقيمة false واترك بقية الحقول null.
target_date اختياري (null إن لم يُذكر تاريخ أو موعد مستهدف صراحة).`;

const TOKEN_INTENT_PROMPT = `مهمتك الوحيدة: تحليل آخر رسالة من المستخدم (مع سياق المحادثة) لمعرفة إن كان يطلب صراحة إنشاء رمز "مدّ" (رمز دفع مؤقت) بمبلغ محدد.
إذا لم يكن الطلب واضحًا ومكتملاً (لا يوجد مبلغ رقمي محدد بوضوح)، اجعل create_token بقيمة false واترك بقية الحقول null.
bank_name اختياري (null إن لم يُذكر اسم بنك محدد). duration_type تكون "once" (استخدام واحد فقط، وهذا الافتراضي إن لم تُذكر مدة) أو "minutes" (مدة زمنية محددة). إذا كانت duration_type هي "minutes" حدد minutes بالدقائق (حوّل الساعات لدقائق، مثلاً ساعتين=120)، بحد أقصى 1440 دقيقة (24 ساعة).`;

const BEST_OPPORTUNITY_INTENT_PROMPT = `مهمتك الوحيدة: حدد إذا كانت آخر رسالة من المستخدم (مع سياق المحادثة) تسأل عن أفضل الفرص الاستثمارية بالأسهم المتوفرة، أو أي سهم يشتري الآن، أو تطلب ترتيب الأسهم من الأفضل للأسوأ كفرصة استثمارية، أو تطلب بشكل عام خطة أو توصية استثمارية بالأسهم.`;

const INVESTOR_STUDIES_NOTE = `

حقيقة مؤكدة: المستخدم يسأل عن أفضل الفرص الاستثمارية بالأسهم. الأسهم المتوفرة موجودة في بيانات المستخدم تحت الحقل "stocks_market" فقط، وكل سهم فيه price و change_pct حقيقيان — اعتمد عليهما حصرًا ولا تخترع أرقامًا.
فلسفات الاستثمار الست (وازن بينها معًا لكل سهم، بدون فقرة منفصلة لكل مستثمر): وارن بافيت (قيمة طويلة الأمد وميزة تنافسية دائمة) — بنجامين جراهام (هامش أمان وسعر أقل من القيمة الجوهرية) — بيتر لينش (نمو بسعر معقول) — جورج سوروس (اختلال السعر عن الواقع الاقتصادي) — كارل إيكان (فرصة نشطة بمحرّك تحسّن واضح) — جيسي ليفرمور (زخم واتجاه السعر).

اختر أفضل 5 أسهم فقط من stocks_market (وليس كل الأسهم) ورتّبها من الأفضل للأسوأ. كل سهم يجب أن يكون مختلفًا عن غيره تمامًا — ممنوع منعًا باتًا تكرار نفس السهم مرتين في القائمة. لكل سهم اذكر بالتحديد رقم change_pct الخاص به بالسبب (أرقامها مختلفة فعليًا لكل سهم، فسبب كل سهم لازم يكون مختلف عن البقية).

اتبع هذا الشكل بالضبط، بدون أي تغيير: أول جملة قصيرة تنويه أن هذا تحليل عام وليس توصية معتمدة، ثم سطر فارغ، ثم 5 أسطر فقط، كل سطر بسطر مستقل تمامًا (سطر جديد حقيقي بين كل سهم والتالي له)، وكل سطر بنفس صيغة هذا المثال بالضبط (المثال للتوضيح فقط، لا تستخدم بياناته الوهمية):
1. **أرامكو السعودية** (2222) — بسعر 27.85 ريال وتغيّر يومي ‎+0.60%‎، أقرب لأسلوب وارن بافيت.
اكتب باقي الأربعة أسطر بنفس الصيغة بالضبط (رقم. **الاسم** (الرمز) — بسعره وتغيّره الحقيقيين، أقرب لأسلوب [اسم مستثمر واحد]).`;

const AUTOMATION_SCHEMA = {
  type: 'object',
  properties: {
    create_automation: {type: 'boolean'},
    recipient: {type: ['string', 'null']},
    amount: {type: ['number', 'null']},
    frequency: {type: ['string', 'null'], enum: ['شهريًا', 'أسبوعيًا', 'يوميًا', null]}
  },
  required: ['create_automation', 'recipient', 'amount', 'frequency'],
  additionalProperties: false
};

const DOMESTIC_WORKER_SCHEMA = {
  type: 'object',
  properties: {is_domestic_worker_payroll: {type: 'boolean'}},
  required: ['is_domestic_worker_payroll'],
  additionalProperties: false
};

const GOAL_SCHEMA = {
  type: 'object',
  properties: {
    create_goal: {type: 'boolean'},
    name: {type: ['string', 'null']},
    target_amount: {type: ['number', 'null']},
    target_date: {type: ['string', 'null']}
  },
  required: ['create_goal', 'name', 'target_amount', 'target_date'],
  additionalProperties: false
};

const TOKEN_SCHEMA = {
  type: 'object',
  properties: {
    create_token: {type: 'boolean'},
    amount: {type: ['number', 'null']},
    bank_name: {type: ['string', 'null']},
    duration_type: {type: ['string', 'null'], enum: ['once', 'minutes', null]},
    minutes: {type: ['number', 'null']}
  },
  required: ['create_token', 'amount', 'bank_name', 'duration_type', 'minutes'],
  additionalProperties: false
};

const BEST_OPPORTUNITY_SCHEMA = {
  type: 'object',
  properties: {wants_best_opportunities: {type: 'boolean'}},
  required: ['wants_best_opportunities'],
  additionalProperties: false
};

// Anthropic requires the first message in a turn to have role "user" — the
// client's chat log always starts with a bot greeting, so any leading
// assistant-role turns left after slicing the last few messages must be
// dropped before sending history to the API.
function sanitizeHistory(history){
  const h = (history || []).slice();
  while(h.length && h[0].role === 'assistant') h.shift();
  return h;
}

async function callClaude({system, messages, maxTokens, temperature, schema}){
  let response;
  try{
    response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: maxTokens,
      temperature,
      system,
      messages,
      ...(schema ? {output_config: {format: {type: 'json_schema', schema}}} : {})
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

function numbersMentionedIn(text){
  return (String(text || '').match(/\d+(?:\.\d+)?/g) || []).map(Number);
}

const DOMESTIC_WORKER_KEYWORDS = ['عامل','عاملة','عمالة','خادم','خادمة','خدم','سائق','طباخ','طباخة','نظافة','منزلي','منزلية','مساند'];
function mentionsDomesticWorker(text){
  const t = String(text || '');
  return DOMESTIC_WORKER_KEYWORDS.some(k => t.includes(k));
}

const AUTOMATION_KEYWORDS = ['حول','حوّل','حوالة','حولة','ارسل','أرسل','تحويل','اتمتة','أتمتة'];
function mentionsAutomation(text){
  const t = String(text || '');
  return AUTOMATION_KEYWORDS.some(k => t.includes(k));
}

const GOAL_KEYWORDS = ['هدف','أهداف','اهداف'];
function mentionsGoal(text){
  const t = String(text || '');
  return GOAL_KEYWORDS.some(k => t.includes(k));
}

const TOKEN_KEYWORDS = ['مدّ','رمز دفع'];
function mentionsToken(text){
  const t = String(text || '');
  return TOKEN_KEYWORDS.some(k => t.includes(k));
}

const BEST_OPPORTUNITY_KEYWORDS = ['سهم','أسهم','اسهم','استثمار'];
function mentionsInvestment(text){
  const t = String(text || '');
  return BEST_OPPORTUNITY_KEYWORDS.some(k => t.includes(k));
}

async function classifyAutomationIntent(question, history){
  if(!mentionsAutomation(question)) return null; // current message must literally reference a transfer/automation — don't trust stale conversation history
  const messages = [...sanitizeHistory((history || []).slice(-4)), {role:'user', content: question}];
  try{
    const raw = await callClaude({system: AUTOMATION_INTENT_PROMPT, messages, maxTokens: 120, temperature: 0, schema: AUTOMATION_SCHEMA});
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
  const messages = [...sanitizeHistory((history || []).slice(-4)), {role:'user', content: question}];
  try{
    const raw = await callClaude({system: DOMESTIC_WORKER_INTENT_PROMPT, messages, maxTokens: 40, temperature: 0, schema: DOMESTIC_WORKER_SCHEMA});
    const parsed = JSON.parse(raw);
    return !!(parsed && parsed.is_domestic_worker_payroll === true);
  }catch(err){
    return false;
  }
}

async function classifyGoalIntent(question, history){
  if(!mentionsGoal(question)) return null; // current message must literally reference a savings goal — don't trust stale conversation history
  const messages = [...sanitizeHistory((history || []).slice(-4)), {role:'user', content: question}];
  try{
    const raw = await callClaude({system: GOAL_INTENT_PROMPT, messages, maxTokens: 120, temperature: 0, schema: GOAL_SCHEMA});
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

async function classifyTokenIntent(question, history){
  if(!mentionsToken(question)) return null; // current message must literally reference مدّ — don't trust stale conversation history
  const messages = [...sanitizeHistory((history || []).slice(-4)), {role:'user', content: question}];
  try{
    const raw = await callClaude({system: TOKEN_INTENT_PROMPT, messages, maxTokens: 120, temperature: 0, schema: TOKEN_SCHEMA});
    const parsed = JSON.parse(raw);
    if(parsed && parsed.create_token === true && parsed.amount){
      const amount = Number(parsed.amount);
      const mentionedNumbers = numbersMentionedIn(question);
      if(!mentionedNumbers.includes(amount)){
        return null; // amount isn't in the CURRENT message — refuse to act on a number only seen earlier in history (stale-context hallucination)
      }
      const durationType = parsed.duration_type === 'minutes' ? 'minutes' : 'once';
      let minutes = null;
      if(durationType === 'minutes'){
        minutes = Math.min(Math.max(Number(parsed.minutes) || 60, 1), 1440);
      }
      return {amount, bankName: parsed.bank_name ? String(parsed.bank_name) : null, durationType, minutes};
    }
    return null;
  }catch(err){
    return null;
  }
}

async function classifyBestOpportunityIntent(question, history){
  if(!mentionsInvestment(question)) return false; // current message must literally reference stocks/investment — don't trust stale conversation history
  const messages = [...sanitizeHistory((history || []).slice(-4)), {role:'user', content: question}];
  try{
    const raw = await callClaude({system: BEST_OPPORTUNITY_INTENT_PROMPT, messages, maxTokens: 40, temperature: 0, schema: BEST_OPPORTUNITY_SCHEMA});
    const parsed = JSON.parse(raw);
    return !!(parsed && parsed.wants_best_opportunities === true);
  }catch(err){
    return false;
  }
}

function goalGroundTruthNote(goalIntent){
  return goalIntent
    ? `\n\nحقيقة مؤكدة: تم بالفعل إنشاء هدف ادخار جديد باسم "${goalIntent.name}" بمبلغ مستهدف ${goalIntent.targetAmount} ريال${goalIntent.targetDate ? ` بموعد مستهدف ${goalIntent.targetDate}` : ''}. أخبر المستخدم بذلك بجملة قصيرة ومباشرة، ولا تذكر أي تفاصيل أخرى غير هذه.`
    : `\n\nحقيقة مؤكدة: لم يتم إنشاء أي هدف ادخار جديد حتى الآن. إذا كانت رسالة المستخدم الأخيرة طلب إنشاء هدف وينقصها اسم الهدف أو المبلغ المستهدف، اسأله عن المعلومة الناقصة تحديدًا. لا تدّعي إطلاقًا أنك أنشأت أي هدف ولا تذكر أي مبلغ لم يذكره المستخدم بنفسه.`;
}

function tokenGroundTruthNote(tokenIntent){
  return tokenIntent
    ? `\n\nحقيقة مؤكدة: تم بالفعل إنشاء رمز "مدّ" جديد بمبلغ ${tokenIntent.amount} ريال${tokenIntent.bankName ? ` من ${tokenIntent.bankName}` : ' من الحساب الرئيسي'}${tokenIntent.durationType === 'minutes' ? ` صالح لمدة ${tokenIntent.minutes} دقيقة` : ' صالح لاستخدام واحد فقط'}. سيظهر رمز مدّ وتفاصيله للمستخدم تلقائيًا أسفل ردك مباشرة، فاكتفِ بجملة قصيرة تخبره أن رمز مدّ جاهز بالأسفل، ولا تختلق رمزًا بنفسك ولا تذكر أي تفاصيل أخرى غير هذه.`
    : `\n\nحقيقة مؤكدة: لم يتم إنشاء أي رمز مدّ جديد حتى الآن. إذا كانت رسالة المستخدم الأخيرة طلب إنشاء رمز مدّ وينقصها مبلغ محدد، اسأله عن المبلغ تحديدًا. لا تدّعي إطلاقًا أنك أنشأت أي رمز مدّ ولا تذكر أي رمز أو مبلغ لم يذكره المستخدم بنفسه.`;
}

async function callChatModel(question, context, history, automationGroundTruth, goalIntent, wantsBestOpportunities, tokenIntent){
  const automationNote = automationGroundTruth
    ? (automationGroundTruth.source === 'musaned'
        ? `\n\nحقيقة مؤكدة: جلب النظام بيانات العامل من منصة "مساند" وأنشأ تحويلاً تلقائيًا شهريًا بمبلغ ${automationGroundTruth.amount} ريال إلى ${automationGroundTruth.recipient} (${automationGroundTruth.jobTitle}). أخبر المستخدم بذلك بجملة قصيرة ومباشرة تذكر أن البيانات جاءت من مساند، ولا تذكر أي تفاصيل أخرى غير هذه.`
        : `\n\nحقيقة مؤكدة: تم بالفعل إنشاء تحويل تلقائي بمبلغ ${automationGroundTruth.amount} ريال ${automationGroundTruth.frequency} إلى ${automationGroundTruth.recipient}. أخبر المستخدم بذلك بجملة قصيرة ومباشرة، ولا تذكر أي تفاصيل أخرى غير هذه.`)
    : `\n\nحقيقة مؤكدة: لم يتم إنشاء أي تحويل تلقائي جديد حتى الآن. إذا كانت رسالة المستخدم الأخيرة طلب إنشاء تحويل تلقائي وينقصها اسم المستلم أو المبلغ، اسأله عن المعلومة الناقصة تحديدًا. لا تدّعي إطلاقًا أنك أنشأت أي تحويل ولا تذكر أي مبلغ لم يذكره المستخدم بنفسه.`;
  const bestOpportunityNote = wantsBestOpportunities ? INVESTOR_STUDIES_NOTE : '';
  const system = SYSTEM_PROMPT + automationNote + goalGroundTruthNote(goalIntent) + tokenGroundTruthNote(tokenIntent) + bestOpportunityNote + '\n\nبيانات المستخدم المالية:\n' + JSON.stringify(context);
  const messages = [...sanitizeHistory(history), {role:'user', content: question}];
  return callClaude({system, messages, maxTokens: 700, temperature: 0.4});
}

async function handleChatRequest(question, context, history){
  if(!ANTHROPIC_API_KEY){
    const err = new Error('server missing ANTHROPIC_API_KEY');
    err.status = 500;
    throw err;
  }

  const [isDomesticWorkerPayroll, automationIntent, goal, tokenIntent, wantsBestOpportunities] = await Promise.all([
    classifyDomesticWorkerIntent(question, history || []),
    classifyAutomationIntent(question, history || []),
    classifyGoalIntent(question, history || []),
    classifyTokenIntent(question, history || []),
    classifyBestOpportunityIntent(question, history || [])
  ]);

  let automation = null;
  if(isDomesticWorkerPayroll){
    const workers = await getMusanedWorkers();
    if(workers && workers[0]){
      const w = workers[0];
      automation = {recipient: w.name, amount: w.monthlySalary, frequency: 'شهريًا', source: 'musaned', jobTitle: w.jobTitle};
    }
  }
  if(!automation){
    automation = automationIntent;
  }

  let answer = await callChatModel(question, context || {}, history || [], automation, goal, wantsBestOpportunities, tokenIntent);
  const claimsSuccess = /تم إنشاء|قمت بإنشاء|تم تفعيل|تم تحويل|سيتم تحويل|سأنشئ|أنشأت|✅/.test(answer);
  if(!automation && !goal && !tokenIntent && claimsSuccess){
    // model claimed it created an automation/goal/token despite the verified ground truth saying otherwise — never let a false claim reach the user
    answer = 'محتاج أعرف التفاصيل بالضبط (مثل اسم المستلم والمبلغ، أو اسم الهدف والمبلغ المستهدف، أو مبلغ رمز مدّ) عشان أقدر أنفّذ طلبك — تقدر تكتبها لي؟';
  }

  return {answer, automation, goal, tokenIntent};
}

module.exports = { handleChatRequest };
