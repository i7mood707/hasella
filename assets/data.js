/* ---------------- Currency symbol (new official Saudi Riyal sign) ---------------- */
const SAR = '<svg class="sar" viewBox="0 0 1124.14 1256.39" aria-hidden="true"><path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/><path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/></svg>';

/* ---------------- Auth guard ---------------- */
function requireAuth(){
  if(localStorage.getItem('hasila_logged_in') !== '1'){
    location.href = 'index.html';
  }
}
function doLogout(){
  localStorage.removeItem('hasila_logged_in');
  location.href = 'index.html';
}

/* ---------------- Mock Data ---------------- */
const DEFAULT_ACCOUNTS = [
  {id:'a1', bank:'مصرف الراجحي', type:'حساب جاري', balance:12450.75, logo:'logos/alrajhi.png', iban:'SA•• •••• •••• •••• 2290', linked:true, lastSync:'قبل 4 دقائق', primary:true},
  {id:'a2', bank:'البنك الأهلي السعودي', type:'حساب توفير', balance:34200.00, logo:'logos/snb.jpg', iban:'SA•• •••• •••• •••• 7714', linked:true, lastSync:'قبل ساعة'},
  {id:'a3', bank:'بنك الرياض', type:'حساب جاري', balance:5860.40, logo:'logos/riyadbank.webp', iban:'SA•• •••• •••• •••• 1038', linked:true, lastSync:'قبل ساعتين'},
  {id:'a4', bank:'STC Bank', type:'محفظة رقمية', balance:1240.00, logo:'logos/stc-bank.jpg', iban:'966•• •••• 5560', linked:true, lastSync:'قبل 30 دقيقة'},
  {id:'a5', bank:'مصرف الإنماء', type:'حساب توفير', balance:8930.20, logo:'logos/alinma.jpg', iban:'SA•• •••• •••• •••• 4821', linked:false, lastSync:'—'},
];

const transactions = [
  {name:'فاتورة جوال — موبايلي', date:'٦ يوليو', dateISO:'2026-07-06', amount:-120.00, logo:'logos/mobily.png', accountId:'a3'},
  {name:'راتب شهري — أرامكو السعودية', date:'٥ يوليو', dateISO:'2026-07-05', amount:11200.00, logo:'logos/aramco.jpg', accountId:'a1'},
  {name:'اشتراك STC', date:'٤ يوليو', dateISO:'2026-07-04', amount:-249.00, logo:'logos/stc-bank.jpg', accountId:'a4'},
  {name:'تحويل إلى محمد العتيبي', date:'٢ يوليو', dateISO:'2026-07-02', amount:-500.00, ic:'↗️', accountId:'a1'},
  {name:'إيجار الشقة — تحويل آيبان', date:'١ يوليو', dateISO:'2026-07-01', amount:-3000.00, ic:'🏠', accountId:'a1'},
  {name:'خصم تابي — Apple Store', date:'١ يوليو', dateISO:'2026-07-01', amount:-160.00, logo:'logos/tabby.png', accountId:'a1'},
  {name:'بيع سهم سابك', date:'٢٩ يونيو', dateISO:'2026-06-29', amount:1322.00, ic:'📈', accountId:'a1'},
  {name:'شحن رصيد — موبايلي', date:'٣٠ يونيو', dateISO:'2026-06-30', amount:-50.00, logo:'logos/mobily.png', accountId:'a4'},
  {name:'مطعم نجد الأصيل', date:'٢٨ يونيو', dateISO:'2026-06-28', amount:-47.00, ic:'🍽️', accountId:'a3'},
  {name:'حوالة دولية — SWIFT', date:'٢٨ يونيو', dateISO:'2026-06-28', amount:-1200.00, ic:'🌍', accountId:'a5'},
  {name:'محطة وقود أرامكو', date:'٢٧ يونيو', dateISO:'2026-06-27', amount:-140.00, logo:'logos/aramco.jpg', accountId:'a1'},
  {name:'سحب نقدي — صراف آلي', date:'٢٦ يونيو', dateISO:'2026-06-26', amount:-400.00, ic:'💵', accountId:'a1'},
  {name:'من: سارة العتيبي', date:'٢٥ يونيو', dateISO:'2026-06-25', amount:800.00, ic:'↙️', accountId:'a3'},
  {name:'تسوق أونلاين — نون', date:'٢٤ يونيو', dateISO:'2026-06-24', amount:-215.50, logo:'logos/noon.png', accountId:'a2'},
  {name:'فاتورة كهرباء — الشركة السعودية للكهرباء', date:'٢٢ يونيو', dateISO:'2026-06-22', amount:-310.00, logo:'logos/sec.svg', accountId:'a5'},
  {name:'من: عبدالرحمن العتيبي', date:'٢٠ يونيو', dateISO:'2026-06-20', amount:250.00, ic:'↙️', accountId:'a1'},
  {name:'STC Bank إلى عبدالله', date:'٢٠ يونيو', dateISO:'2026-06-20', amount:-250.00, ic:'↗️', accountId:'a4'},
  {name:'اشتراك نتفليكس', date:'١٨ يونيو', dateISO:'2026-06-18', amount:-45.00, logo:'logos/netflix.png', accountId:'a2'},
  {name:'بقالة العائلة', date:'١٥ يونيو', dateISO:'2026-06-15', amount:-96.75, ic:'🧺', accountId:'a3'},
  {name:'اشتراك سبوتيفاي', date:'١٤ يونيو', dateISO:'2026-06-14', amount:-19.99, logo:'logos/spotify.png', accountId:'a2'},
  {name:'شراء من جرير للتسويق', date:'١٢ يونيو', dateISO:'2026-06-12', amount:-540.00, logo:'logos/jarir.jpg', accountId:'a2'},
  {name:'فاتورة مياه — شركة المياه الوطنية', date:'١٠ يونيو', dateISO:'2026-06-10', amount:-85.00, ic:'💧', accountId:'a5'},
  {name:'خصم تمارا — أثاث المنزل', date:'٩ يونيو', dateISO:'2026-06-09', amount:-320.00, logo:'logos/tamara.jpg', accountId:'a1'},
  {name:'اشتراك نادي رياضي', date:'٧ يونيو', dateISO:'2026-06-07', amount:-299.00, ic:'🏋️', accountId:'a2'},
  {name:'مكافأة أداء', date:'٥ يونيو', dateISO:'2026-06-05', amount:2000.00, ic:'🎁', accountId:'a1'},
  {name:'شحن رصيد — موبايلي', date:'١ يونيو', dateISO:'2026-06-01', amount:-30.00, logo:'logos/mobily.png', accountId:'a3'},
  {name:'اشتراك نتفليكس', date:'١٨ مارس', dateISO:'2026-03-18', amount:-45.00, logo:'logos/netflix.png', accountId:'a2'},
  {name:'فاتورة كهرباء — الشركة السعودية للكهرباء', date:'١٥ ديسمبر', dateISO:'2025-12-15', amount:-280.00, logo:'logos/sec.svg', accountId:'a5'},
  {name:'شراء لابتوب — جرير للتسويق', date:'١٠ سبتمبر', dateISO:'2025-09-10', amount:-3200.00, logo:'logos/jarir.jpg', accountId:'a2'},
  {name:'مكافأة نهاية السنة', date:'٢٠ أغسطس', dateISO:'2025-08-20', amount:3000.00, ic:'🎁', accountId:'a1'},
  {name:'إيجار الشقة السابقة — تحويل آيبان', date:'١ أبريل', dateISO:'2025-04-01', amount:-2800.00, ic:'🏠', accountId:'a1'},
];

const DEFAULT_STOCKS = [
  {name:'أرامكو السعودية', ticker:'2222', qty:100, price:27.85, chg:0.6, logo:'logos/aramco.jpg'},
  {name:'مصرف الراجحي', ticker:'1120', qty:30, price:89.40, chg:-0.3, logo:'logos/alrajhi.png'},
  {name:'سابك', ticker:'2010', qty:50, price:66.10, chg:1.2, logo:'logos/sabic.png'},
  {name:'stc', ticker:'7010', qty:40, price:38.20, chg:0.4, logo:'logos/stc-stock.jpg'},
  {name:'معادن', ticker:'1211', qty:0, price:52.30, chg:-0.8, logo:'logos/maaden.webp'},
  {name:'المراعي', ticker:'2280', qty:0, price:58.90, chg:0.5, logo:'logos/almarai.jpg'},
  {name:'موبايلي', ticker:'7020', qty:0, price:42.15, chg:1.5, logo:'logos/mobily.png'},
  {name:'بنك البلاد', ticker:'1140', qty:0, price:33.60, chg:-0.2, logo:'logos/albilad.png'},
  {name:'جرير للتسويق', ticker:'4190', qty:0, price:165.00, chg:0.9, logo:'logos/jarir.jpg'},
  {name:'مصرف الإنماء', ticker:'1150', qty:0, price:28.75, chg:0.3, logo:'logos/alinma.jpg'},
];

const DEFAULT_SUKUK = [
  {name:'صكوك حكومية سعودية', code:'GOV-SUK-2030', qty:20, price:1005.50, chg:0.08, rate:'5.10%'},
  {name:'صكوك أرامكو السعودية', code:'ARMCO-SUK-2027', qty:10, price:998.20, chg:-0.04, rate:'4.85%'},
  {name:'صكوك سابك', code:'SABIC-SUK-2026', qty:0, price:1002.75, chg:0.02, rate:'4.95%'},
  {name:'صكوك stc', code:'STC-SUK-2028', qty:0, price:1000.00, chg:0.0, rate:'5.00%'},
  {name:'صكوك مصرف الراجحي', code:'RJHI-SUK-2029', qty:0, price:1010.30, chg:0.05, rate:'5.20%'},
];

const DEFAULT_GOLD_HOLDING = {ounces:3};

const GOAL_ICONS = ['🎯','🕋','🚗','🏠','🎓','💍','✈️','💰','🏥'];
const DEFAULT_GOALS = [
  {id:'go1', name:'عمرة العائلة', icon:'🕋', targetAmount:15000, savedAmount:6000, targetDate:'2026-12-01', createdAt:'2026-04-01'},
  {id:'go2', name:'سيارة جديدة', icon:'🚗', targetAmount:100000, savedAmount:22000, targetDate:'2027-06-01', createdAt:'2026-01-05'},
];

const DEFAULT_TRANSFERS = [
  {name:'إيجار الشقة — تحويل آيبان', date:'١ يوليو', amount:-3000, ic:'🏠'},
  {name:'حوالة دولية — SWIFT', date:'٢٨ يونيو', amount:-1200, ic:'🌍'},
  {name:'من: سارة العتيبي', date:'٢٥ يونيو', amount:800, ic:'↙️'},
  {name:'STC Bank إلى عبدالله', date:'٢٠ يونيو', amount:-250, ic:'↗️'},
];

const DEFAULT_AUTOMATIONS = [
  {name:'تحويل الإيجار الشهري', detail:`3,000 ${SAR} — كل يوم 1 من الشهر`, on:true, accountId:'a1'},
  {name:'ادخار تلقائي', detail:`500 ${SAR} أسبوعيًا إلى حساب التوفير`, on:true, accountId:'a1'},
  {name:'دعم عائلي', detail:`1,000 ${SAR} شهريًا`, on:false, accountId:'a3'},
];

const DEFAULT_BNPL = [
  {id:'b1', bank:'تابي', logo:'logos/tabby.png', linked:true, lastSync:'قبل ساعة'},
  {id:'b2', bank:'تمارا', logo:'logos/tamara.jpg', linked:true, lastSync:'قبل يوم'},
];

const DEFAULT_INVESTMENTS = [
  {id:'v1', bank:'عوائد', logo:'logos/awaed.jpg', linked:true, lastSync:'قبل 20 دقيقة', assetType:'أسهم'},
];

const DEFAULT_OTHER_INVESTMENTS = [
  {bank:'درايه للصكوك', logoText:'درا', assetType:'صكوك'},
];

const DEFAULT_OTHER_BANKS = [
  {bank:'البنك السعودي الأول SAB', logo:'logos/sab.svg'},
  {bank:'البنك العربي الوطني', logo:'logos/anb.png'},
  {bank:'البنك السعودي الفرنسي', logo:'logos/bsf.svg'},
  {bank:'البنك السعودي للاستثمار', logo:'logos/saib.png'},
  {bank:'بنك الجزيرة', logo:'logos/aljazira.png'},
  {bank:'بنك الخليج الدولي - السعودية', logo:'logos/gib.svg'},
  {bank:'بنك البلاد', logo:'logos/albilad.png'},
  {bank:'بنك D360', logo:'logos/d360.png'},
  {bank:'بنك فيجن', logo:'logos/visionbank.png'},
];

const debtsTotal = 640 + 900 + 18500 + 2100 + 31200;

/* ---------------- Persisted state (accounts / stocks / automations) ---------------- */
const DATA_VERSION = '7';
if(localStorage.getItem('hasila_data_version') !== DATA_VERSION){
  ['hasila_accounts','hasila_stocks','hasila_automations','hasila_bnpl','hasila_investments','hasila_transfers','hasila_other_banks'].forEach(k=>localStorage.removeItem(k));
  localStorage.setItem('hasila_data_version', DATA_VERSION);
}

function loadState(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  const clone = JSON.parse(JSON.stringify(fallback));
  localStorage.setItem(key, JSON.stringify(clone));
  return clone;
}
function accountLabel(accountId){
  const acc = accounts.find(a=>a.id === accountId);
  return acc ? `${acc.bank} — ${acc.type}` : '';
}
function accountLogo(accountId){
  const acc = accounts.find(a=>a.id === accountId);
  return acc ? acc.logo : '';
}
const accounts = loadState('hasila_accounts', DEFAULT_ACCOUNTS);
const stocks = loadState('hasila_stocks', DEFAULT_STOCKS);
const sukuk = loadState('hasila_sukuk', DEFAULT_SUKUK);
const goldHolding = loadState('hasila_gold', DEFAULT_GOLD_HOLDING);
const goals = loadState('hasila_goals', DEFAULT_GOALS);
const automations = loadState('hasila_automations', DEFAULT_AUTOMATIONS);
const bnplProviders = loadState('hasila_bnpl', DEFAULT_BNPL);
const investmentPlatforms = loadState('hasila_investments', DEFAULT_INVESTMENTS);
const otherInvestmentPlatforms = loadState('hasila_other_investments', DEFAULT_OTHER_INVESTMENTS);
const transfersData = loadState('hasila_transfers', DEFAULT_TRANSFERS);
const otherBanks = loadState('hasila_other_banks', DEFAULT_OTHER_BANKS);

const DEFAULT_SETTINGS = {lang:'ar', currency:'SAR', notifications:true, promotions:false, twoFactor:true, darkMode:false};
const APP_SETTINGS = loadState('hasila_settings', DEFAULT_SETTINGS);
function persistSettings(){ localStorage.setItem('hasila_settings', JSON.stringify(APP_SETTINGS)); }

function persistState(){
  localStorage.setItem('hasila_accounts', JSON.stringify(accounts));
  localStorage.setItem('hasila_stocks', JSON.stringify(stocks));
  localStorage.setItem('hasila_sukuk', JSON.stringify(sukuk));
  localStorage.setItem('hasila_gold', JSON.stringify(goldHolding));
  localStorage.setItem('hasila_goals', JSON.stringify(goals));
  localStorage.setItem('hasila_automations', JSON.stringify(automations));
  localStorage.setItem('hasila_bnpl', JSON.stringify(bnplProviders));
  localStorage.setItem('hasila_investments', JSON.stringify(investmentPlatforms));
  localStorage.setItem('hasila_other_investments', JSON.stringify(otherInvestmentPlatforms));
  localStorage.setItem('hasila_transfers', JSON.stringify(transfersData));
  localStorage.setItem('hasila_other_banks', JSON.stringify(otherBanks));
}

/* ---------------- Formatting ---------------- */
const fmt = n => n.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});

/* ---------------- Currency (all amounts are stored in SAR; this converts + labels for display) ---------------- */
const CURRENCIES = {
  SAR: {rate:1,             sym: SAR},
  USD: {rate:1/3.75,        sym:'<span class="cur-txt">$</span>'},
  AED: {rate:3.6725/3.75,   sym:'<span class="cur-txt">د.إ</span>'}
};
function curCode(){ return CURRENCIES[APP_SETTINGS.currency] ? APP_SETTINGS.currency : 'SAR'; }
function curSym(){ return CURRENCIES[curCode()].sym; }
function convToCur(sar){ return sar * CURRENCIES[curCode()].rate; }
function money(sar){ return fmt(convToCur(sar)) + ' ' + curSym(); }

/* ---------------- Transaction row markup (shared by the home preview + the full archive page) ---------------- */
function txRowHtml(t){
  const icon = t.logo ? `<img class="tx-logo" src="${t.logo}" alt="${t.name}">` : `<div class="tx-ic">${t.ic || '💳'}</div>`;
  const source = accountLabel(t.accountId);
  return `
    <div class="tx-row">
      <div class="tx-left">
        ${icon}
        <div><div class="tx-name">${t.name}</div><div class="tx-date">${t.date}</div>${source ? `<div class="tx-source">${source}</div>` : ''}</div>
      </div>
      <div class="tx-amt ${t.amount<0?'neg':'pos'}">${t.amount<0?'-':'+'}${money(Math.abs(t.amount))}</div>
    </div>`;
}
function usdToSar(usd){ return usd * 3.75; }

/* ---------------- Savings goals ---------------- */
function goalProgressPct(g){ return g.targetAmount > 0 ? Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100)) : 0; }
function goalRemaining(g){ return Math.max(0, g.targetAmount - g.savedAmount); }

/* Projects a completion date from the average daily saving rate since the goal was created
   (savedAmount / days elapsed) — the only signal we have without a full contribution history. */
function goalEstimatedCompletion(g){
  const remaining = goalRemaining(g);
  if(remaining <= 0) return {status:'done'};
  if(!g.createdAt || !g.savedAmount) return {status:'unknown'};
  const daysElapsed = Math.max(1, Math.floor((Date.now() - new Date(g.createdAt).getTime()) / 86400000));
  const dailyRate = g.savedAmount / daysElapsed;
  if(dailyRate <= 0) return {status:'unknown'};
  const daysRemaining = Math.ceil(remaining / dailyRate);
  const estDate = new Date(Date.now() + daysRemaining * 86400000);
  const monthsRemaining = Math.max(1, Math.round(daysRemaining / 30));
  return {status:'estimated', daysRemaining, monthsRemaining, estDate};
}
function formatGoalEstimate(g){
  const est = goalEstimatedCompletion(g);
  if(est.status !== 'estimated') return est.status;
  const m = est.monthsRemaining;
  const monthsLabel = m === 1 ? 'شهر واحد' : m === 2 ? 'شهرين' : m <= 10 ? `${m} أشهر` : `${m} شهرًا`;
  const dateStr = est.estDate.toISOString().slice(0, 10);
  return {monthsLabel, dateStr};
}

/* ---------------- Language (interface strings only — data content stays Arabic) ---------------- */
const I18N_EN = {
  // nav + shell
  'الرئيسية':'Home', 'الحوالات':'Transfers', 'مدّ':'Madd', 'الديون':'Debts', 'الأسهم':'Stocks',
  'الاستثمارات':'Investments', 'الذهب':'Gold', 'الصكوك':'Sukuk',
  'التمويل':'Financing', 'المستشار المالي':'Financial Advisor', 'ربط الحسابات':'Link Accounts',
  'الحساب':'Account', 'الدعم الفني':'Support', 'تسجيل الخروج':'Log out', 'حساب تجريبي':'Demo account',
  // page-head titles + subtitles
  'إصدار مدّ الدفع':'Issue Payment Madd',
  'نظرة عامة على وضعك المالي اليوم':'An overview of your finances today',
  'حوالاتك المحلية والدولية وإمكانية أتمتتها':'Your local and international transfers, with automation',
  'حدد الحسابات، المبلغ من كل حساب، ومدة صلاحية مدّ':'Choose accounts, the amount from each, and the Madd validity period',
  'تابي، تمارا، وأقساط البنوك في جميع حساباتك':'Tabby, Tamara, and bank installments across all your accounts',
  'محفظتك متزامنة عبر تطبيق عوائد':'Your portfolio is synced via Awaed',
  'تابع أسهمك، ذهبك، وصكوكك بأسعار محدثة':'Track your stocks, gold, and sukuk with live prices',
  'قارن عروض الأقساط أو اطلب تمويلًا لشركتك':'Compare installment offers or request business financing',
  'يرى حساباتك وديونك، ويتوقع احتياجك القادم':'Sees your accounts and debts, and anticipates your next need',
  'أدر اتصال حساباتك البنكية وخدمات الدفع الآجل في مكان واحد':'Manage your bank and BNPL connections in one place',
  'معلومات حسابك وتفضيلاتك الشخصية':'Your account information and personal preferences',
  'نحن هنا لمساعدتك — تواصل معنا أو ارفع شكوى':'We are here to help — contact us or file a complaint',
  // card titles
  'حساباتك والبنوك':'Your accounts & banks', 'أرشيف العمليات':'Transaction history',
  'إصدار مدّ دفع':'Issue payment Madd', 'مستشار مالي سريع':'Quick financial advisor',
  'المستشار المالي الذكي':'Smart financial advisor', 'الحوالات التلقائية':'Automatic transfers',
  'سجل الحوالات':'Transfer log', 'إجمالي الديون':'Total debts', 'جميع الأقساط':'All installments',
  'البنوك':'Banks', 'خدمات الدفع الآجل':'Buy now, pay later', 'منصات الاستثمار':'Investment platforms',
  'حساباتك المرتبطة':'Your linked accounts', 'اختر الحسابات':'Choose accounts', 'إيصال مدّ':'Madd receipt',
  'صافي ثروتك من الأسهم':'Your net stock wealth', 'صافي ثروتك من الاستثمارات':'Your net investment wealth', 'مقتنياتك':'Your holdings',
  'مقارنة عروض الأقساط':'Compare installment offers', 'طلب تمويل للشركات':'Business financing request',
  'المعلومات الشخصية':'Personal information', 'التفضيلات والإعدادات':'Preferences & settings',
  'رفع شكوى أو طلب دعم':'File a complaint or request support', 'شكاواي السابقة':'Your past complaints',
  'ربط بنك جديد':'Link a new bank', 'حوالة جديدة':'New transfer',
  'اسأل المستشار الذكي':'Ask the smart advisor',
  'الإجابات مبنية على تحليل الذكاء الاصطناعي الفعلي لبياناتك أعلاه':'Answers are based on real AI analysis of your data above',
  // home hero
  'إجمالي الرصيد في جميع الحسابات':'Total balance across all accounts', 'عدد الحسابات':'Accounts',
  'صافي الأسهم':'Net stocks', 'صافي الاستثمارات':'Net investments', 'إجمالي الديون':'Total debts', 'عمليات هذا الشهر':'Transactions this month',
  // sub-labels
  'تحليل مباشر بالذكاء الاصطناعي':'Live AI analysis', 'بياناتك التعريفية':'Your identity details',
  'تُحفظ تلقائيًا':'Saved automatically', 'نرد خلال 24 ساعة':'We reply within 24 hours',
  'جميع الجهات':'All providers', 'حسب سياسة كل بنك':'Per each bank\'s policy', 'اختياري':'Optional',
  // buttons
  'إرسال':'Send', '+ حوالة جديدة':'+ New transfer', '+ ربط بنك جديد':'+ Link new bank',
  'تنفيذ الحوالة':'Execute transfer', 'حفظ المعلومات':'Save information', 'إرسال الشكوى':'Submit complaint',
  'إرسال الطلب':'Submit request', 'إصدار مدّ':'Issue Madd', 'تأكيد':'Confirm', 'تأكيد الربط':'Confirm link',
  'إغلاق':'Close', 'إصدار مدّ جديد ←':'Issue new Madd →',
  // field labels
  'الاسم الكامل':'Full name', 'البريد الإلكتروني':'Email', 'رقم الجوال':'Mobile number',
  'رقم الهوية الوطنية':'National ID', 'اللغة':'Language', 'العملة':'Currency', 'نوع الطلب':'Request type',
  'عنوان الشكوى':'Complaint subject', 'تفاصيل المشكلة':'Problem details', 'من حساب':'From account',
  'نوع الحوالة':'Transfer type', 'اختر الحسابات والمبلغ من كل حساب':'Choose accounts and the amount from each',
  'اسم المستلم / الجهة':'Recipient name / entity', 'رقم الحساب / الآيبان':'Account number / IBAN',
  'التكرار':'Frequency', 'اليوم':'Day', 'المبلغ':'Amount', 'عدد الأسهم':'Number of shares',
  'يُخصم من حساب':'Charged from account', 'مدة صلاحية مدّ':'Madd validity period', 'اسم الشركة':'Company name',
  'رقم السجل التجاري':'Commercial registration no.', 'المبلغ المطلوب':'Requested amount',
  'الغرض من التمويل':'Financing purpose',
  // settings rows + contact labels
  'الإشعارات':'Notifications', 'تنبيهات العمليات والحوالات على جهازك':'Transaction and transfer alerts on your device',
  'رسائل العروض':'Promotional messages', 'استقبال العروض والأخبار التسويقية':'Receive offers and marketing news',
  'المصادقة الثنائية':'Two-factor authentication', 'طبقة حماية إضافية عند تسجيل الدخول':'An extra layer of protection at login',
  'الوضع الليلي':'Dark mode', 'مظهر داكن مريح للعين (قريبًا)':'A dark, eye-friendly theme (coming soon)',
  'الرقم الموحّد':'Unified number', 'جوال الطوارئ المالية':'Financial emergency line', 'ساعات العمل':'Working hours',
  '✔ حساب موثّق':'✔ Verified account',
  // placeholders
  'اكتب سؤالك عن وضعك المالي...':'Type your question about your finances...',
  'مثال: عبدالله العتيبي':'e.g., Abdullah Alotaibi',
  'مثال: لم تصل حوالتي إلى المستلم':'e.g., My transfer did not reach the recipient',
  'اشرح لنا المشكلة بالتفصيل حتى نقدر نساعدك بسرعة...':'Describe the problem in detail so we can help you quickly...'
};

const _i18nOrigText = new WeakMap();
const _i18nOrigPh = new WeakMap();
function _i18nTr(str){
  const key = (str || '').trim();
  if(!key) return str;
  const en = I18N_EN[key];
  return (APP_SETTINGS.lang === 'en' && en) ? str.replace(key, en) : str;
}
function _i18nTranslateEl(el){
  el.childNodes.forEach(n=>{
    if(n.nodeType !== 3) return; // text nodes only — leaves nested icons/badges/counters alone
    if(!_i18nOrigText.has(n)) _i18nOrigText.set(n, n.nodeValue);
    n.nodeValue = _i18nTr(_i18nOrigText.get(n));
  });
}
function applyLanguage(){
  const lang = APP_SETTINGS.lang === 'en' ? 'en' : 'ar';
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
  const sels = '.nav-item, .page-head h1, .page-head p, h3, label.flabel, .btn, .logout-btn,'
    + ' .setting-title, .setting-desc, .contact-label, .sub, .urole, .chat-head div, .demo-pill,'
    + ' .hero-label, .hero-sub-row .item';
  document.querySelectorAll(sels).forEach(_i18nTranslateEl);
  document.querySelectorAll('[placeholder]').forEach(el=>{
    if(!_i18nOrigPh.has(el)) _i18nOrigPh.set(el, el.getAttribute('placeholder'));
    const orig = _i18nOrigPh.get(el);
    if(orig != null) el.setAttribute('placeholder', _i18nTr(orig));
  });
}

/* Convert amounts that are baked as static "123 <svg class="sar">" markup in the HTML
   (e.g. the debts table) when a non-SAR currency is selected. Runs once per page load;
   the static HTML is reset on every navigation, so no toggle-back handling is needed. */
function localizeStaticAmounts(){
  if(curCode() === 'SAR') return;
  const txt = curCode() === 'USD' ? '$' : (curCode() === 'AED' ? 'د.إ' : 'ر.س');
  document.querySelectorAll('svg.sar').forEach(svg=>{
    const prev = svg.previousSibling;
    if(!prev || prev.nodeType !== 3) return;
    const m = prev.nodeValue.match(/([\d,]+(?:\.\d+)?)\s*$/);
    if(!m) return;
    const sar = parseFloat(m[1].replace(/,/g, ''));
    if(isNaN(sar)) return;
    prev.nodeValue = prev.nodeValue.slice(0, m.index) + fmt(convToCur(sar)) + ' ';
    const span = document.createElement('span');
    span.className = 'cur-txt';
    span.textContent = txt;
    svg.replaceWith(span);
  });
}

function animateCount(el, target, suffixHtml, duration){
  duration = duration || 900;
  const start = 0;
  const startTime = performance.now();
  function tick(now){
    const p = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    const value = start + (target - start) * eased;
    el.innerHTML = fmt(value) + (suffixHtml || '');
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------------- Mobile nav drawer ---------------- */
function toggleMobileNav(){
  const sb = document.querySelector('.sidebar');
  const ov = document.querySelector('.sidebar-overlay');
  if(sb) sb.classList.toggle('open');
  if(ov) ov.classList.toggle('show');
}
function closeMobileNav(){
  const sb = document.querySelector('.sidebar');
  const ov = document.querySelector('.sidebar-overlay');
  if(sb) sb.classList.remove('open');
  if(ov) ov.classList.remove('show');
}
function initMobileNav(){
  const brand = document.querySelector('.sidebar-brand');
  if(brand && !brand.querySelector('.sidebar-close-btn')){
    const btn = document.createElement('button');
    btn.className = 'sidebar-close-btn';
    btn.setAttribute('aria-label', 'إغلاق القائمة');
    btn.textContent = '✕';
    btn.onclick = closeMobileNav;
    brand.appendChild(btn);
  }
  document.querySelectorAll('.nav-item').forEach(el=>el.addEventListener('click', closeMobileNav));
}
initMobileNav();
applyLanguage();
localizeStaticAmounts();
