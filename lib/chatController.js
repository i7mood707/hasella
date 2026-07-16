const { getMusanedWorkers } = require('../marketData/musaned');

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const CHAT_MODEL = 'meta/llama-3.1-8b-instruct';

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

const TOKEN_INTENT_PROMPT = `مهمتك الوحيدة: تحليل آخر رسالة من المستخدم (مع سياق المحادثة) لمعرفة إن كان يطلب صراحة إنشاء رمز "مدّ" (رمز دفع مؤقت) بمبلغ محدد.
أجب حصريًا بكائن JSON بأحد الشكلين التاليين، بدون أي نص إضافي:
إذا كان الطلب واضحًا ومكتملاً (يوجد مبلغ رقمي محدد بوضوح):
{"create_token":true,"amount":500,"bank_name":"الراجحي","duration_type":"once","minutes":null}
حيث bank_name اختياري (اكتب null إن لم يُذكر اسم بنك محدد). duration_type تكون "once" (استخدام واحد فقط، وهذا الافتراضي إن لم تُذكر مدة) أو "minutes" (مدة زمنية محددة). إذا كانت duration_type هي "minutes" حدد minutes بالدقائق (حوّل الساعات لدقائق، مثلاً ساعتين=120)، بحد أقصى 1440 دقيقة (24 ساعة).
إذا لم يكن طلب إنشاء رمز مدّ، أو كان ناقص المعلومات (لا يوجد مبلغ رقمي محدد):
{"create_token":false}`;

const BEST_OPPORTUNITY_INTENT_PROMPT = `مهمتك الوحيدة: حدد إذا كانت آخر رسالة من المستخدم (مع سياق المحادثة) تسأل عن أفضل الفرص الاستثمارية بالأسهم المتوفرة، أو أي سهم يشتري الآن، أو تطلب ترتيب الأسهم من الأفضل للأسوأ كفرصة استثمارية، أو تطلب بشكل عام خطة أو توصية استثمارية بالأسهم.
أجب حصريًا بكائن JSON بأحد الشكلين التاليين، بدون أي نص إضافي:
{"wants_best_opportunities":true}
{"wants_best_opportunities":false}`;

const INVESTOR_STUDIES_NOTE = `

حقيقة مؤكدة: المستخدم يسأل عن أفضل الفرص الاستثمارية بالأسهم. الأسهم المتوفرة موجودة في بيانات المستخدم تحت الحقل "stocks_market" فقط، وكل سهم فيه price و change_pct حقيقيان — اعتمد عليهما حصرًا ولا تخترع أرقامًا.
فلسفات الاستثمار الست (وازن بينها معًا لكل سهم، بدون فقرة منفصلة لكل مستثمر): وارن بافيت (قيمة طويلة الأمد وميزة تنافسية دائمة) — بنجامين جراهام (هامش أمان وسعر أقل من القيمة الجوهرية) — بيتر لينش (نمو بسعر معقول) — جورج سوروس (اختلال السعر عن الواقع الاقتصادي) — كارل إيكان (فرصة نشطة بمحرّك تحسّن واضح) — جيسي ليفرمور (زخم واتجاه السعر).

اختر أفضل 5 أسهم فقط من stocks_market (وليس كل الأسهم) ورتّبها من الأفضل للأسوأ. كل سهم يجب أن يكون مختلفًا عن غيره تمامًا — ممنوع منعًا باتًا تكرار نفس السهم مرتين في القائمة. لكل سهم اذكر بالتحديد رقم change_pct الخاص به بالسبب (أرقامها مختلفة فعليًا لكل سهم، فسبب كل سهم لازم يكون مختلف عن البقية).

اتبع هذا الشكل بالضبط، بدون أي تغيير: أول جملة قصيرة تنويه أن هذا تحليل عام وليس توصية معتمدة، ثم سطر فارغ، ثم 5 أسطر فقط، كل سطر بسطر مستقل تمامًا (سطر جديد حقيقي بين كل سهم والتالي له)، وكل سطر بنفس صيغة هذا المثال بالضبط (المثال للتوضيح فقط، لا تستخدم بياناته الوهمية):
1. **أرامكو السعودية** (2222) — بسعر 27.85 ريال وتغيّر يومي ‎+0.60%‎، أقرب لأسلوب وارن بافيت.
اكتب باقي الأربعة أسطر بنفس الصيغة بالضبط (رقم. **الاسم** (الرمز) — بسعره وتغيّره الحقيقيين، أقرب لأسلوب [اسم مستثمر واحد]).`;

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
  if(!mentionsGoal(question)) return null; // current message must literally reference a savings goal — don't trust stale conversation history
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

async function classifyTokenIntent(question, history){
  if(!mentionsToken(question)) return null; // current message must literally reference مدّ — don't trust stale conversation history
  const messages = [
    {role:'system', content: TOKEN_INTENT_PROMPT},
    ...(history || []).slice(-4),
    {role:'user', content: question}
  ];
  try{
    const raw = await callNvidia(messages, {max_tokens: 120, temperature: 0, response_format: {type:'json_object'}});
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
  const messages = [
    {role:'system', content: SYSTEM_PROMPT + automationNote + goalGroundTruthNote(goalIntent) + tokenGroundTruthNote(tokenIntent) + bestOpportunityNote + '\n\nبيانات المستخدم المالية:\n' + JSON.stringify(context)},
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
