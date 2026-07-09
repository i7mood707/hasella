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
  {name:'تحويل الإيجار الشهري', detail:`3,000 ${SAR} — كل يوم 1 من الشهر`, on:true},
  {name:'ادخار تلقائي', detail:`500 ${SAR} أسبوعيًا إلى حساب التوفير`, on:true},
  {name:'دعم عائلي', detail:`1,000 ${SAR} شهريًا`, on:false},
];

const DEFAULT_BNPL = [
  {id:'b1', bank:'تابي', logo:'logos/tabby.png', linked:true, lastSync:'قبل ساعة'},
  {id:'b2', bank:'تمارا', logo:'logos/tamara.jpg', linked:true, lastSync:'قبل يوم'},
];

const DEFAULT_INVESTMENTS = [
  {id:'v1', bank:'عوائد', logo:'logos/awaed.jpg', linked:true, lastSync:'قبل 20 دقيقة'},
];

const debtsTotal = 640 + 900 + 18500 + 2100 + 31200;

/* ---------------- Persisted state (accounts / stocks / automations) ---------------- */
const DATA_VERSION = '4';
if(localStorage.getItem('hasila_data_version') !== DATA_VERSION){
  ['hasila_accounts','hasila_stocks','hasila_automations','hasila_bnpl','hasila_investments','hasila_transfers'].forEach(k=>localStorage.removeItem(k));
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

function persistState(){
  localStorage.setItem('hasila_accounts', JSON.stringify(accounts));
  localStorage.setItem('hasila_stocks', JSON.stringify(stocks));
  localStorage.setItem('hasila_automations', JSON.stringify(automations));
  localStorage.setItem('hasila_bnpl', JSON.stringify(bnplProviders));
  localStorage.setItem('hasila_investments', JSON.stringify(investmentPlatforms));
  localStorage.setItem('hasila_transfers', JSON.stringify(transfersData));
}

/* ---------------- Formatting ---------------- */
const fmt = n => n.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});

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
