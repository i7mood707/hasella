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
  {id:'a1', bank:'مصرف الراجحي', type:'حساب جاري', balance:12450.75, logo:'logos/alrajhi.png', iban:'SA•• •••• •••• •••• 2290', linked:true, lastSync:'قبل 4 دقائق'},
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
  {name:'أرامكو السعودية', ticker:'2222', qty:100, price:27.85, chg:0.6},
  {name:'مصرف الراجحي', ticker:'1120', qty:30, price:89.40, chg:-0.3},
  {name:'سابك', ticker:'2010', qty:50, price:66.10, chg:1.2},
  {name:'stc', ticker:'7010', qty:40, price:38.20, chg:0.4},
];

const transfersData = [
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

const debtsTotal = 640 + 900 + 18500 + 2100 + 31200;

/* ---------------- Persisted state (accounts / stocks / automations) ---------------- */
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

function persistState(){
  localStorage.setItem('hasila_accounts', JSON.stringify(accounts));
  localStorage.setItem('hasila_stocks', JSON.stringify(stocks));
  localStorage.setItem('hasila_automations', JSON.stringify(automations));
  localStorage.setItem('hasila_bnpl', JSON.stringify(bnplProviders));
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
