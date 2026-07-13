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
  {name:'مطعم نجد الأصيل', date:'٦ يوليو', amount:-186.00, ic:'🍽️'},
  {name:'راتب شهري', date:'٥ يوليو', amount:11200.00, ic:'💼'},
  {name:'اشتراك STC', date:'٤ يوليو', amount:-249.00, ic:'📶'},
  {name:'تحويل إلى محمد', date:'٢ يوليو', amount:-500.00, ic:'↗️'},
  {name:'خصم تابي', date:'١ يوليو', amount:-160.00, ic:'🛍️'},
  {name:'بيع سهم سابك', date:'٢٩ يونيو', amount:1322.00, ic:'📈'},
  {name:'كافيه ريفر', date:'٢٨ يونيو', amount:-32.00, ic:'☕'},
  {name:'محطة وقود أرامكو', date:'٢٧ يونيو', amount:-140.00, ic:'⛽'},
  {name:'سحب نقدي — صراف آلي', date:'٢٦ يونيو', amount:-400.00, ic:'💵'},
  {name:'تسوق أونلاين — نون', date:'٢٤ يونيو', amount:-215.50, ic:'📦'},
  {name:'فاتورة كهرباء', date:'٢٢ يونيو', amount:-310.00, ic:'💡'},
  {name:'من: عبدالرحمن العتيبي', date:'٢٠ يونيو', amount:250.00, ic:'↙️'},
  {name:'اشتراك نتفليكس', date:'١٨ يونيو', amount:-45.00, ic:'🎬'},
  {name:'بقالة العائلة', date:'١٥ يونيو', amount:-96.75, ic:'🧺'},
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
  {id:'v1', bank:'عوائد', logo:'logos/awaed.jpg', linked:true, lastSync:'قبل 20 دقيقة'},
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
const accounts = loadState('hasila_accounts', DEFAULT_ACCOUNTS);
const stocks = loadState('hasila_stocks', DEFAULT_STOCKS);
const automations = loadState('hasila_automations', DEFAULT_AUTOMATIONS);
const bnplProviders = loadState('hasila_bnpl', DEFAULT_BNPL);
const investmentPlatforms = loadState('hasila_investments', DEFAULT_INVESTMENTS);
const transfersData = loadState('hasila_transfers', DEFAULT_TRANSFERS);
const otherBanks = loadState('hasila_other_banks', DEFAULT_OTHER_BANKS);

const DEFAULT_SETTINGS = {lang:'ar', currency:'SAR', notifications:true, promotions:false, twoFactor:true, darkMode:false};
const APP_SETTINGS = loadState('hasila_settings', DEFAULT_SETTINGS);
function persistSettings(){ localStorage.setItem('hasila_settings', JSON.stringify(APP_SETTINGS)); }

function persistState(){
  localStorage.setItem('hasila_accounts', JSON.stringify(accounts));
  localStorage.setItem('hasila_stocks', JSON.stringify(stocks));
  localStorage.setItem('hasila_automations', JSON.stringify(automations));
  localStorage.setItem('hasila_bnpl', JSON.stringify(bnplProviders));
  localStorage.setItem('hasila_investments', JSON.stringify(investmentPlatforms));
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

/* ---------------- Language (interface strings only — data content stays Arabic) ---------------- */
const I18N_EN = {
  // nav + shell
  'الرئيسية':'Home', 'الحوالات':'Transfers', 'مدّ':'Madd', 'الديون':'Debts', 'الأسهم':'Stocks',
  'التمويل':'Financing', 'المستشار المالي':'Financial Advisor', 'ربط الحسابات':'Link Accounts',
  'الحساب':'Account', 'الدعم الفني':'Support', 'تسجيل الخروج':'Log out', 'حساب تجريبي':'Demo account',
  // page-head titles + subtitles
  'إصدار مدّ الدفع':'Issue Payment Madd',
  'نظرة عامة على وضعك المالي اليوم':'An overview of your finances today',
  'حوالاتك المحلية والدولية وإمكانية أتمتتها':'Your local and international transfers, with automation',
  'حدد الحسابات، المبلغ من كل حساب، ومدة صلاحية مدّ':'Choose accounts, the amount from each, and the Madd validity period',
  'تابي، تمارا، وأقساط البنوك في جميع حساباتك':'Tabby, Tamara, and bank installments across all your accounts',
  'محفظتك متزامنة عبر تطبيق عوائد':'Your portfolio is synced via Awaed',
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
  'صافي ثروتك من الأسهم':'Your net stock wealth', 'مقتنياتك':'Your holdings',
  'مقارنة عروض الأقساط':'Compare installment offers', 'طلب تمويل للشركات':'Business financing request',
  'المعلومات الشخصية':'Personal information', 'التفضيلات والإعدادات':'Preferences & settings',
  'رفع شكوى أو طلب دعم':'File a complaint or request support', 'شكاواي السابقة':'Your past complaints',
  'ربط بنك جديد':'Link a new bank', 'حوالة جديدة':'New transfer',
  'اسأل المستشار الذكي':'Ask the smart advisor',
  'الإجابات مبنية على تحليل الذكاء الاصطناعي الفعلي لبياناتك أعلاه':'Answers are based on real AI analysis of your data above',
  // home hero
  'إجمالي الرصيد في جميع الحسابات':'Total balance across all accounts', 'عدد الحسابات':'Accounts',
  'صافي الأسهم':'Net stocks', 'إجمالي الديون':'Total debts', 'عمليات هذا الشهر':'Transactions this month',
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
