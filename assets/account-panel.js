/* ---------------- Account panel (opens from the sidebar avatar instead of a full page) ---------------- */
const DEFAULT_PROFILE = {
  name: 'فيصل العتيبي',
  email: 'faisal.alotaibi@example.com',
  phone: '+966 55 123 4567',
  nid: '1•••• ••234'
};
const accountProfile = loadState('hasila_profile', DEFAULT_PROFILE);

const ACCOUNT_T = {
  nameEmpty:    {ar:'الاسم لا يمكن أن يكون فارغًا.', en:'Name cannot be empty.'},
  badEmail:     {ar:'صيغة البريد الإلكتروني غير صحيحة.', en:'Invalid email format.'},
  profileSaved: {ar:'تم حفظ معلوماتك الشخصية.', en:'Your personal information has been saved.'},
  updated:      {ar:'تم تحديث', en:'Updated'},
  on:           {ar:'مفعّل', en:'On'},
  off:          {ar:'متوقف', en:'Off'}
};
const accTr = k => ACCOUNT_T[k][APP_SETTINGS.lang === 'en' ? 'en' : 'ar'];
const accL = s => (APP_SETTINGS.lang === 'en' && I18N_EN[s]) ? I18N_EN[s] : s;

function _accToast(msg){
  let t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(()=>t.classList.remove('show'), 3200);
}

function buildAccountModal(){
  const wrap = document.createElement('div');
  wrap.className = 'modal-overlay';
  wrap.id = 'account-modal';
  wrap.style.display = 'none';
  wrap.innerHTML = `
    <div class="modal-box" style="max-width:480px;">
      <div style="display:flex; align-items:center; gap:14px; margin-bottom:20px;">
        <div class="avatar-lg" id="am-avatar">فع</div>
        <div style="flex:1; min-width:0;">
          <div style="font-family:var(--font-display); font-size:17px; font-weight:800;" id="am-name-display"></div>
          <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">عضو منذ يناير 2025 · حساب تجريبي</div>
        </div>
      </div>

      <h3>المعلومات الشخصية</h3>
      <div class="field-block" style="margin-top:14px;">
        <label class="flabel">الاسم الكامل</label>
        <input type="text" id="am-name" class="txt-input">
      </div>
      <div class="field-block">
        <label class="flabel">البريد الإلكتروني</label>
        <input type="email" id="am-email" class="txt-input" style="direction:ltr; text-align:right;">
      </div>
      <div class="field-block">
        <label class="flabel">رقم الجوال</label>
        <input type="tel" id="am-phone" class="txt-input" style="direction:ltr; text-align:right; font-family:var(--font-mono);">
      </div>
      <div class="field-block">
        <label class="flabel">رقم الهوية الوطنية</label>
        <input type="text" id="am-nid" class="txt-input" style="direction:ltr; text-align:right; font-family:var(--font-mono);" readonly>
      </div>
      <button class="btn btn-emerald" style="width:100%; margin-bottom:22px;" onclick="saveAccountProfile()">حفظ المعلومات</button>

      <h3>التفضيلات والإعدادات</h3>
      <div class="field-block" style="margin-top:14px;">
        <label class="flabel">اللغة</label>
        <select class="sel" id="am-lang" onchange="saveAccountSettings('اللغة')">
          <option value="ar">العربية</option>
          <option value="en">English</option>
        </select>
      </div>
      <div class="field-block">
        <label class="flabel">العملة</label>
        <select class="sel" id="am-currency" onchange="saveAccountSettings('العملة')">
          <option value="SAR">ريال سعودي (ر.س)</option>
          <option value="USD">دولار أمريكي (USD)</option>
          <option value="AED">درهم إماراتي (AED)</option>
        </select>
      </div>
      <div class="setting-row">
        <div><div class="setting-title">الإشعارات</div><div class="setting-desc">تنبيهات العمليات والحوالات على جهازك</div></div>
        <button class="toggle" id="am-tg-notif" onclick="toggleAccountSetting('notifications','am-tg-notif','الإشعارات')"></button>
      </div>
      <div class="setting-row">
        <div><div class="setting-title">رسائل العروض</div><div class="setting-desc">استقبال العروض والأخبار التسويقية</div></div>
        <button class="toggle" id="am-tg-promo" onclick="toggleAccountSetting('promotions','am-tg-promo','رسائل العروض')"></button>
      </div>
      <div class="setting-row">
        <div><div class="setting-title">المصادقة الثنائية</div><div class="setting-desc">طبقة حماية إضافية عند تسجيل الدخول</div></div>
        <button class="toggle" id="am-tg-2fa" onclick="toggleAccountSetting('twoFactor','am-tg-2fa','المصادقة الثنائية')"></button>
      </div>
      <div class="setting-row" style="border-bottom:none;">
        <div><div class="setting-title">الوضع الليلي</div><div class="setting-desc">مظهر داكن مريح للعين (قريبًا)</div></div>
        <button class="toggle" id="am-tg-dark" onclick="toggleAccountSetting('darkMode','am-tg-dark','الوضع الليلي')"></button>
      </div>

      <button class="btn btn-outline" style="width:100%; margin-top:20px;" onclick="closeAccountModal()">إغلاق</button>
    </div>`;
  document.body.appendChild(wrap);
  wrap.addEventListener('click', e=>{ if(e.target === wrap) closeAccountModal(); });
  return wrap;
}

function _accSetToggle(id, on){
  document.getElementById(id).classList.toggle('on', !!on);
}

function renderAccountModal(){
  const initials = (accountProfile.name || '').trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('') || 'فع';
  document.getElementById('am-avatar').textContent = initials;
  document.getElementById('am-name-display').textContent = accountProfile.name || '';
  document.getElementById('am-name').value = accountProfile.name || '';
  document.getElementById('am-email').value = accountProfile.email || '';
  document.getElementById('am-phone').value = accountProfile.phone || '';
  document.getElementById('am-nid').value = accountProfile.nid || '';
  document.getElementById('am-lang').value = APP_SETTINGS.lang;
  document.getElementById('am-currency').value = APP_SETTINGS.currency;
  _accSetToggle('am-tg-notif', APP_SETTINGS.notifications);
  _accSetToggle('am-tg-promo', APP_SETTINGS.promotions);
  _accSetToggle('am-tg-2fa', APP_SETTINGS.twoFactor);
  _accSetToggle('am-tg-dark', APP_SETTINGS.darkMode);
  applyLanguage();
}

function openAccountModal(){
  let modal = document.getElementById('account-modal');
  if(!modal) modal = buildAccountModal();
  renderAccountModal();
  modal.style.display = 'flex';
}
function closeAccountModal(){
  const modal = document.getElementById('account-modal');
  if(modal) modal.style.display = 'none';
}

function saveAccountProfile(){
  const name = document.getElementById('am-name').value.trim();
  const email = document.getElementById('am-email').value.trim();
  const phone = document.getElementById('am-phone').value.trim();
  if(!name){ _accToast(accTr('nameEmpty')); return; }
  if(email && !/^\S+@\S+\.\S+$/.test(email)){ _accToast(accTr('badEmail')); return; }
  accountProfile.name = name;
  accountProfile.email = email;
  accountProfile.phone = phone;
  localStorage.setItem('hasila_profile', JSON.stringify(accountProfile));
  document.querySelectorAll('.user-chip .uname').forEach(el=> el.textContent = name);
  renderAccountModal();
  _accToast(accTr('profileSaved'));
}

function saveAccountSettings(label){
  const prevLang = APP_SETTINGS.lang;
  APP_SETTINGS.lang = document.getElementById('am-lang').value;
  APP_SETTINGS.currency = document.getElementById('am-currency').value;
  persistSettings();
  if(APP_SETTINGS.lang !== prevLang) applyLanguage();
  _accToast(`${accTr('updated')}: ${accL(label)}.`);
}

function toggleAccountSetting(key, id, label){
  APP_SETTINGS[key] = !APP_SETTINGS[key];
  _accSetToggle(id, APP_SETTINGS[key]);
  persistSettings();
  _accToast(`${accL(label)}: ${APP_SETTINGS[key] ? accTr('on') : accTr('off')}.`);
}

function initAccountAvatarTrigger(){
  document.querySelectorAll('.user-chip').forEach(chip=> chip.addEventListener('click', openAccountModal));
}
initAccountAvatarTrigger();
