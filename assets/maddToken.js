/* ---------------- مدّ token issuance widget — shared by home.html's modal and token.html's page ---------------- */
const MAX_TOKEN_MINUTES = 24 * 60;
let currentTokenCode = '';
let currentOtpCode = '';
let tokenIsOneTime = false;
let tokenExpiresAt = null;
let tokenExpired = false;
let tokenCountdownTimer = null;
let tokenPollTimer = null;

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(()=>t.classList.remove('show'), 3200);
}

function onDurationChange(){
  const isCustom = document.getElementById('token-duration').value === 'custom';
  document.getElementById('token-custom-wrap').style.display = isCustom ? 'block' : 'none';
}

function fmtDuration(minutes){
  if(minutes % 60 === 0) return `${minutes/60} ${minutes/60===1?'ساعة':'ساعات'}`;
  return `${minutes} دقيقة`;
}

function fmtCountdown(ms){
  const totalSec = Math.max(0, Math.ceil(ms/1000));
  const h = Math.floor(totalSec/3600);
  const m = Math.floor((totalSec%3600)/60);
  const s = totalSec%60;
  return [h,m,s].map(v=>String(v).padStart(2,'0')).join(':');
}

function setTokenStatus(text, color){
  if(tokenExpired) return;
  tokenExpired = true;
  clearInterval(tokenCountdownTimer);
  clearInterval(tokenPollTimer);
  const statusEl = document.getElementById('token-status-value');
  if(statusEl) statusEl.innerHTML = `<span style="color:${color};">${text}</span>`;
  const btn = document.getElementById('token-copy-btn');
  if(btn){ btn.disabled = true; btn.style.opacity = '0.45'; btn.style.cursor = 'not-allowed'; }
}

function markTokenExpired(reason){
  setTokenStatus(reason, 'var(--brick)');
}

function tickTokenCountdown(){
  if(tokenExpiresAt == null) return;
  const remaining = tokenExpiresAt - Date.now();
  if(remaining <= 0){
    markTokenExpired('منتهي الصلاحية ✗');
    return;
  }
  const statusEl = document.getElementById('token-status-value');
  if(statusEl) statusEl.textContent = `صالح لمدة ${fmtCountdown(remaining)}`;
}

function copyTokenCode(){
  if(!currentTokenCode || tokenExpired) return;
  navigator.clipboard.writeText(currentTokenCode).then(()=>{
    showToast('تم نسخ رمز مدّ.');
  }).catch(()=>{
    showToast('تعذر نسخ الرمز.');
  });
}

function genOtpCode(){
  return String(Math.floor(100000 + Math.random()*900000));
}

function copyOtpCode(){
  if(!currentOtpCode || tokenExpired) return;
  navigator.clipboard.writeText(currentOtpCode).then(()=>{
    showToast('تم نسخ رمز التحقق (OTP).');
  }).catch(()=>{
    showToast('تعذر نسخ الرمز.');
  });
}

function startTokenPoll(code){
  clearInterval(tokenPollTimer);
  tokenPollTimer = setInterval(async ()=>{
    if(tokenExpired || code !== currentTokenCode){ clearInterval(tokenPollTimer); return; }
    try{
      const res = await fetch('/api/madd?code=' + encodeURIComponent(code));
      const data = await res.json();
      if(data.found && data.used) applyTokenDeduction(data);
    }catch(err){ /* transient network error — try again next tick */ }
  }, 4000);
}

function recordTokenTransactions(tokenRecord, debitedAccounts){
  const today = new Date();
  const dateLabel = today.toLocaleDateString('ar-SA', {day:'numeric', month:'long'});
  const dateISO = today.toISOString().slice(0,10);
  const name = tokenRecord.desc ? `دفع بمدّ — ${tokenRecord.desc}` : 'دفع بمدّ';
  debitedAccounts.forEach(({acc, amt})=>{
    transactions.unshift({name, date:dateLabel, dateISO, amount:-amt, ic:'◎', accountId:acc.id});
  });
}

function applyTokenDeduction(tokenRecord){
  const debitedAccounts = [];
  (tokenRecord.accounts || []).forEach(c=>{
    const acc = accounts.find(a=>a.bank === c.bank);
    if(acc){ acc.balance -= c.amt; debitedAccounts.push({acc, amt:c.amt}); }
  });
  recordTokenTransactions(tokenRecord, debitedAccounts);
  persistState();
  renderTokenAccounts();
  if(typeof renderHome === 'function') renderHome();
  setTokenStatus(`✅ تم الدفع بموقع الدفع — خُصم ${fmt(tokenRecord.amount)} ر.س`, 'var(--emerald-deep)');
}

function renderTokenAccounts(){
  document.getElementById('token-accounts').innerHTML = accounts.map((a,i)=>`
    <div class="token-account">
      <input type="checkbox" id="tok-chk-${i}">
      <img class="bank-logo" style="width:32px; height:32px; border-radius:9px; padding:4px;" src="${a.logo}" alt="${a.bank}" title="${a.bank}">
      <div style="flex:1;">
        <div class="acc-name">${a.bank}</div>
        <div class="acc-type">${a.type} — الرصيد: ${money(a.balance)}</div>
      </div>
      <input type="number" class="amt-input" id="tok-amt-${i}" placeholder="0.00" oninput="onTokenAmountInput(${i})">
    </div>`).join('');
}
function onTokenAmountInput(i){
  const amt = parseFloat(document.getElementById('tok-amt-'+i).value);
  document.getElementById('tok-chk-'+i).checked = !!(amt && amt>0);
}
/* Headless core: creates + syncs a مدّ token with the server. No DOM dependency —
   usable both from the account-picker UI below and from the chat advisor flow. */
function issueMaddToken({accounts: chosen, isOneTime, minutes}){
  const total = chosen.reduce((s,c)=>s+c.amt,0);
  const code = 'TKN-' + Math.random().toString(36).slice(2,6).toUpperCase() + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
  const otp = genOtpCode();
  const durationLabel = isOneTime ? 'استخدام واحد فقط' : fmtDuration(minutes);
  const expiresAt = isOneTime ? null : Date.now() + minutes*60000;

  currentTokenCode = code;
  currentOtpCode = otp;
  clearInterval(tokenCountdownTimer);
  clearInterval(tokenPollTimer);
  tokenIsOneTime = isOneTime;
  tokenExpired = false;
  tokenExpiresAt = expiresAt;

  const syncPromise = fetch('/api/madd', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({action:'create', code, amount: total, accounts: chosen, isOneTime, expiresAt, otp})
  }).then(async res=>{
    const data = await res.json().catch(()=>null);
    return !!(res.ok && data && data.ok !== false);
  }).catch(()=> false);

  startTokenPoll(code);
  return {code, otp, total, chosen, durationLabel, expiresAt, isOneTime, syncPromise};
}

function generateToken(){
  const chosen = [];
  accounts.forEach((a,i)=>{
    const chk = document.getElementById('tok-chk-'+i);
    const amt = parseFloat(document.getElementById('tok-amt-'+i).value)||0;
    if(chk.checked && amt>0) chosen.push({bank:a.bank, amt});
  });
  if(chosen.length===0){ alert('اختر حسابًا واحدًا على الأقل وحدد مبلغًا.'); return; }

  const durationChoice = document.getElementById('token-duration').value;
  const customErr = document.getElementById('token-custom-error');
  customErr.style.display = 'none';

  let isOneTime = false;
  let minutes = null;

  if(durationChoice === 'once'){
    isOneTime = true;
  } else if(durationChoice === 'custom'){
    const value = parseFloat(document.getElementById('token-custom-value').value);
    const unit = document.getElementById('token-custom-unit').value;
    if(!value || value <= 0){
      customErr.textContent = 'حدد مدة صحيحة أكبر من صفر.';
      customErr.style.display = 'block';
      return;
    }
    minutes = unit === 'hours' ? value*60 : value;
    if(minutes > MAX_TOKEN_MINUTES){
      customErr.textContent = 'الحد الأقصى لمدة مدّ هو 24 ساعة.';
      customErr.style.display = 'block';
      return;
    }
  } else {
    minutes = Number(durationChoice);
  }

  const {code, otp, total, durationLabel, syncPromise} = issueMaddToken({accounts: chosen, isOneTime, minutes});

  const placeholder = document.getElementById('token-placeholder');
  if(placeholder) placeholder.style.display = 'none';
  const wrap = document.getElementById('token-receipt-wrap');
  wrap.style.display='block';
  const initialStatus = isOneTime ? 'صالح لاستخدام واحد فقط' : `صالح لمدة ${fmtCountdown(tokenExpiresAt - Date.now())}`;
  document.getElementById('token-receipt').innerHTML = `
    <div style="text-align:center; font-size:11px; color:var(--text-muted); margin-bottom:8px;">إيصال مدّ الدفع</div>
    <div style="display:flex; align-items:center; justify-content:center; gap:10px;">
      <div class="code">${code}</div>
      <button class="copy-code-btn" id="token-copy-btn" onclick="copyTokenCode()" aria-label="نسخ الرمز" title="نسخ الرمز">⧉</button>
    </div>
    <div class="tline" style="border-bottom:none; padding-top:0;">
      <span>رمز التحقق (OTP)</span>
      <span style="display:inline-flex; align-items:center; gap:6px;">
        <span style="font-family:var(--font-mono); letter-spacing:2px; font-weight:600;">${otp}</span>
        <button class="copy-code-btn" onclick="copyOtpCode()" aria-label="نسخ رمز التحقق" title="نسخ رمز التحقق" style="width:22px; height:22px; font-size:12px;">⧉</button>
      </span>
    </div>
    <div class="perforation" style="background:repeating-linear-gradient(90deg, rgba(36,48,61,0.2) 0 6px, transparent 6px 12px);"></div>
    ${chosen.map(c=>`<div class="tline"><span>${c.bank}</span><span>${money(c.amt)}</span></div>`).join('')}
    <div class="tline" style="border-bottom:none; padding-top:12px; font-size:14px; font-weight:600;"><span>الإجمالي</span><span style="color:var(--gold);">${money(total)}</span></div>
    <div class="tline" style="border-bottom:none;"><span>الصلاحية</span><span>${durationLabel}</span></div>
    <div class="tline" style="border-bottom:none;"><span>الحالة</span><span id="token-status-value">${initialStatus}</span></div>
    <p id="token-sync-warning" style="font-size:11.5px; color:var(--brick); margin-top:8px; display:none;"></p>
  `;

  if(!isOneTime){
    tokenCountdownTimer = setInterval(tickTokenCountdown, 1000);
  }

  syncPromise.then(ok=>{
    if(!ok && code === currentTokenCode){
      const warn = document.getElementById('token-sync-warning');
      if(warn){
        warn.textContent = '⚠️ تعذّر مزامنة هذا الرمز مع موقع الدفع — الدفع به من موقع آخر لن يعمل الآن.';
        warn.style.display = 'block';
      }
    }
  });
}

if(document.getElementById('token-accounts')) renderTokenAccounts();
