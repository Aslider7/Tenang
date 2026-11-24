const CONFIG = {
  PAYMENT_URL: 'https://toyyibpay.com/', // Tukar ke pautan pembayaran sebenar anda
  VALID_CODES: ['TENANGPRO', 'TENANG30'],
  SUBSCRIPTION_DAYS: 30,
  STORAGE_KEY: 'tenang_app_state_v1'
};

const DEFAULT_STATE = {
  lang: 'ms',
  streak: 1,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  selectedMood: '😌',
  moods: [],
  proExpiresAt: null // timestamp ms
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_STATE, ...parsed };
    merged.streak = updateStreakValue(merged.streak, merged.lastActiveDate);
    merged.lastActiveDate = new Date().toISOString().slice(0, 10);
    return merged;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Abaikan jika storan penuh
  }
}

function updateStreakValue(currentStreak, lastDate) {
  const today = new Date().toISOString().slice(0, 10);
  if (lastDate === today) return Math.max(1, currentStreak || 1);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (lastDate === yesterday) return (currentStreak || 1) + 1;
  return 1;
}

function isProActive() {
  return typeof state.proExpiresAt === 'number' && state.proExpiresAt > Date.now();
}

function getProDaysRemaining() {
  if (!isProActive()) return 0;
  return Math.max(1, Math.ceil((state.proExpiresAt - Date.now()) / 86400000));
}

/* Kamus Dwibahasa BM / EN */
const I18N = {
  ms: {
    greet_morning: 'Selamat Pagi',
    greet_afternoon: 'Selamat Petang',
    greet_evening: 'Selamat Malam',
    greet_sub: 'Ambil nafas perlahan. Anda berada di ruang yang selamat.',
    sos_title: 'Mod SOS Panik & Stres',
    sos_desc: 'Rasa sesak dada, cemas, atau terlalu penat? Tekan butang di bawah untuk tenangkan sistem saraf dalam 60 saat.',
    sos_btn: '🫀 Mula Pernafasan SOS (1-Tap)',
    quick_access: 'Akses Pantas',
    q_box_title: 'Box Breathing',
    q_box_sub: 'Fokus & stabilkan minda',
    q_rain_title: 'Bunyi Hujan',
    q_rain_sub: 'Mainkan suasana tenang',
    q_release_title: 'Lepas Fikiran',
    q_release_sub: 'Buang beban kerisauan',
    q_sleep_title: 'Sleep Reset',
    q_sleep_sub: 'Program tidur 7 hari',
    guided_heading: 'Sesi Berpandu Pantas',
    program_heading: 'Program 7-Hari Sleep Reset',
    sleep_timer: '⏱️ Sleep Timer',
    timer_off: 'Tutup',
    stop_all_sounds: '⏹️ Hentikan Semua Bunyi',
    mood_title: 'Daftar Masuk Mood Hari Ini',
    mood_placeholder: 'Nota ringkas perasaan anda...',
    mood_save: 'Simpan Rekod Mood',
    release_title: '🔥 Lepaskan Fikiran',
    release_desc: 'Taip apa yang mengganggu fikiran anda sekarang. Ia tidak akan disimpan — tekan lepaskan untuk lenyapkannya.',
    release_placeholder: 'Tulis kerisauan anda di sini...',
    release_btn: '✨ Lepaskan & Lenyapkan',
    history_heading: 'Sejarah Mood Terkini',
    pro_active_title: '✨ Tenang Pro Aktif',
    pro_days_text: (days) => `Langganan aktif berbaki ${days} hari lagi.`,
    pro_heading: 'Buka Ketenangan Tanpa Had',
    pro_period: '/ bulan',
    pro_b1: '✅ Program penuh 7-Hari Sleep Reset (Hari 1–7)',
    pro_b2: '✅ Semua bunyi premium & frekuensi 432Hz',
    pro_b3: '✅ Akses penuh semua sesi berpandu & fokus',
    pro_b4: '✅ Kemas kini ciri baharu setiap bulan',
    pro_subscribe_btn: '👑 Langgan Tenang Pro Sekarang',
    code_title: 'Sudah Ada Kod Akses Bulanan?',
    code_desc: 'Masukkan kod yang diterima selepas pembayaran untuk aktifkan akses Pro selama 30 hari.',
    code_btn: 'Aktifkan',
    nav_home: 'Utama',
    nav_sessions: 'Sesi',
    nav_sounds: 'Bunyi',
    nav_journal: 'Jurnal',
    nav_pro: 'Pro',
    sos_modal_title: 'Pernafasan Tenang',
    breath_ready: 'Bersedia...',
    breath_inhale: 'Tarik Nafas...',
    breath_hold: 'Tahan Nafas...',
    breath_exhale: 'Hembus Perlahan...',
    breath_start: 'Mula Sesi',
    breath_stop: 'Berhenti',
    session_start: 'Mula Sesi',
    session_stop: 'Tamatkan Sesi',
    free_pill: 'PERCUMA',
    pro_pill: 'PRO',
    sound_on: 'AKTIF',
    sound_off: 'MAIN',
    toast_mood_saved: 'Rekod mood disimpan.',
    toast_mood_empty: 'Pilih emosi dahulu.',
    toast_thought_released: 'Kerisauan dilepaskan. Bernafaslah dengan lega.',
    toast_thought_empty: 'Tiada teks untuk dilepaskan.',
    toast_pro_required: 'Ciri ini khas untuk pelanggan Tenang Pro.',
    toast_code_invalid: 'Kod akses tidak sah. Semak semula.',
    toast_code_success: 'Tenang Pro diaktifkan untuk 30 hari!',
    toast_timer_ended: 'Sleep Timer tamat. Bunyi diperlahankan.'
  },
  en: {
    greet_morning: 'Good Morning',
    greet_afternoon: 'Good Afternoon',
    greet_evening: 'Good Evening',
    greet_sub: 'Take a slow breath. You are in a calm space.',
    sos_title: 'Panic & Stress SOS Mode',
    sos_desc: 'Feeling tight-chested, anxious, or overwhelmed? Tap below to calm your nervous system in 60 seconds.',
    sos_btn: '🫀 Start SOS Breathing (1-Tap)',
    quick_access: 'Quick Access',
    q_box_title: 'Box Breathing',
    q_box_sub: 'Focus & steady the mind',
    q_rain_title: 'Rain Sound',
    q_rain_sub: 'Play calm ambience',
    q_release_title: 'Release Thoughts',
    q_release_sub: 'Let go of mental weight',
    q_sleep_title: 'Sleep Reset',
    q_sleep_sub: '7-day sleep program',
    guided_heading: 'Quick Guided Sessions',
    program_heading: '7-Day Sleep Reset Program',
    sleep_timer: '⏱️ Sleep Timer',
    timer_off: 'Off',
    stop_all_sounds: '⏹️ Stop All Sounds',
    mood_title: 'Today’s Mood Check-In',
    mood_placeholder: 'Short note about how you feel...',
    mood_save: 'Save Mood Entry',
    release_title: '🔥 Thought Release',
    release_desc: 'Type what is weighing on your mind. Nothing is saved — tap release to let it fade away.',
    release_placeholder: 'Write your worries here...',
    release_btn: '✨ Release & Fade',
    history_heading: 'Recent Mood History',
    pro_active_title: '✨ Tenang Pro Active',
    pro_days_text: (days) => `${days} day(s) remaining on your monthly pass.`,
    pro_heading: 'Unlock Unlimited Calm',
    pro_period: '/ month',
    pro_b1: '✅ Full 7-Day Sleep Reset Program (Days 1–7)',
    pro_b2: '✅ All premium sounds & 432Hz frequency',
    pro_b3: '✅ Full access to guided & focus sessions',
    pro_b4: '✅ Monthly feature updates',
    pro_subscribe_btn: '👑 Subscribe to Tenang Pro',
    code_title: 'Have a Monthly Access Code?',
    code_desc: 'Enter the code received after payment to activate 30 days of Pro access.',
    code_btn: 'Activate',
    nav_home: 'Home',
    nav_sessions: 'Sessions',
    nav_sounds: 'Sounds',
    nav_journal: 'Journal',
    nav_pro: 'Pro',
    sos_modal_title: 'Calm Breathing',
    breath_ready: 'Get ready...',
    breath_inhale: 'Breathe In...',
    breath_hold: 'Hold...',
    breath_exhale: 'Breathe Out...',
    breath_start: 'Start Session',
    breath_stop: 'Stop',
    session_start: 'Start Session',
    session_stop: 'End Session',
    free_pill: 'FREE',
    pro_pill: 'PRO',
    sound_on: 'ON',
    sound_off: 'PLAY',
    toast_mood_saved: 'Mood entry saved.',
    toast_mood_empty: 'Select a mood first.',
    toast_thought_released: 'Thoughts released. Take a deep breath.',
    toast_thought_empty: 'Nothing to release yet.',
    toast_pro_required: 'This feature requires Tenang Pro.',
    toast_code_invalid: 'Invalid access code. Please check again.',
    toast_code_success: 'Tenang Pro activated for 30 days!',
    toast_timer_ended: 'Sleep Timer finished. Audio faded out.'
  }
};

function t(key) {
  return I18N[state.lang][key];
}

/* Data Sesi & Program 7-Hari */
const QUICK_SESSIONS = [
  {
    id: 'stress-3m',
    durationSec: 180,
    proOnly: false,
    title: { ms: 'Lepas Stres Kerja (3 min)', en: 'Work Stress Reset (3 min)' },
    sub: { ms: 'Kendurkan bahu & tenangkan fikiran', en: 'Drop shoulder tension & clear mind' },
    scripts: {
      ms: [
        'Jatuhkan bahu anda ke bawah dan lepaskan ketegangan di rahang.',
        'Perhatikan aliran udara masuk melalui hidung dan keluar perlahan.',
        'Anda tidak perlu selesaikan semua perkara dalam satu saat ini.'
      ],
      en: [
        'Drop your shoulders away from your ears and unclench your jaw.',
        'Notice the air flowing gently in and out without forcing it.',
        'You do not have to solve everything in this single moment.'
      ]
    }
  },
  {
    id: 'focus-5m',
    durationSec: 300,
    proOnly: false,
    title: { ms: 'Fokus Pantas Minda (5 min)', en: 'Quick Mind Focus (5 min)' },
    sub: { ms: 'Kembali hadir pada tugas semasa', en: 'Anchor attention to the present task' },
    scripts: {
      ms: [
        'Pusatkan perhatian pada satu titik atau nafas semula jadi anda.',
        'Jika fikiran melayang, sambut dengan tenang dan kembali fokus.',
        'Satu langkah kecil yang jelas lebih baik daripada tergesa-gesa.'
      ],
      en: [
        'Rest your attention gently on your natural breathing rhythm.',
        'When thoughts drift, simply notice them and return to now.',
        'One steady step beats rushing with a scattered mind.'
      ]
    }
  },
  {
    id: 'deep-calm-8m',
    durationSec: 480,
    proOnly: true,
    title: { ms: 'Pemulihan Emosi Mendalam (8 min)', en: 'Deep Emotional Reset (8 min)' },
    sub: { ms: 'Melembutkan rasa berat dalam dada', en: 'Soften inner heaviness & mental fatigue' },
    scripts: {
      ms: [
        'Letakkan tangan di dada dan rasakan kehangatan nafas anda.',
        'Setiap hembusan membawa keluar rasa penat yang tidak perlu.',
        'Beri diri anda izin untuk berehat tanpa rasa bersalah.'
      ],
      en: [
        'Place a hand over your chest and feel your steady rhythm.',
        'With every exhale, release lingering pressure and fatigue.',
        'Give yourself permission to rest without guilt.'
      ]
    }
  }
];

const SLEEP_DAYS = [
  { day: 1, proOnly: false, ms: 'Hari 1: Melepaskan Ketegangan Fizikal', en: 'Day 1: Releasing Physical Tension', desc: { ms: '5 min • Relaksasi otot sebelum tidur', en: '5 min • Pre-sleep muscle release' } },
  { day: 2, proOnly: false, ms: 'Hari 2: Menutup Buku Hari Ini', en: 'Day 2: Closing Today’s Chapter', desc: { ms: '6 min • Menenangkan fikiran esok', en: '6 min • Quieting tomorrow’s thoughts' } },
  { day: 3, proOnly: true, ms: 'Hari 3: Nafas Perlahan Gelombang Malam', en: 'Day 3: Slow Night-Wave Breath', desc: { ms: '7 min • Menurunkan degupan jantung', en: '7 min • Slowing evening heart rate' } },
  { day: 4, proOnly: true, ms: 'Hari 4: Mengosongkan Kepala', en: 'Day 4: Clearing Mental Clutter', desc: { ms: '7 min • Melepaskan overthinking', en: '7 min • Letting go of overthinking' } },
  { day: 5, proOnly: true, ms: 'Hari 5: Pengimbasan Tubuh Tenang', en: 'Day 5: Calm Body Scan', desc: { ms: '8 min • Dari hujung kepala ke kaki', en: '8 min • From crown to toes' } },
  { day: 6, proOnly: true, ms: 'Hari 6: Tenggelam dalam Kesunyian', en: 'Day 6: Drifting Into Stillness', desc: { ms: '8 min • Transisi lembut ke alam tidur', en: '8 min • Gentle drift toward sleep' } },
  { day: 7, proOnly: true, ms: 'Hari 7: Irama Tidur Baharu Anda', en: 'Day 7: Your Renewed Sleep Rhythm', en: '9 min • Mengukuhkan ketenangan malam', desc: { ms: '9 min • Anchoring restful nights', en: '9 min • Anchoring restful nights' } }
];

/* Enjin Bunyi Web Audio API (100% Sintetik) */
const SOUNDS_META = [
  { id: 'rain', icon: '🌧️', proOnly: false, ms: 'Bunyi Hujan Lembut', en: 'Soft Rain' },
  { id: 'waves', icon: '🌊', proOnly: false, ms: 'Ombak Pantai', en: 'Ocean Waves' },
  { id: 'wind', icon: '🍃', proOnly: false, ms: 'Angin Malam', en: 'Night Breeze' },
  { id: 'brown', icon: '🤎', proOnly: true, ms: 'Brown Noise Dalam', en: 'Deep Brown Noise' },
  { id: 'freq432', icon: '✨', proOnly: true, ms: 'Frekuensi Tenang 432Hz', en: '432Hz Calm Tone' }
];

const audioEngine = {
  ctx: null,
  masterGain: null,
  activeNodes: {},
  volumes: { rain: 0.4, waves: 0.4, wind: 0.35, brown: 0.45, freq432: 0.25 },

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  createNoiseBuffer(type) {
    const length = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 2.8;
      } else {
        data[i] = (lastOut + 0.08 * white) / 1.08;
        lastOut = data[i];
        data[i] *= 2.2;
      }
    }
    return buffer;
  },

  startSound(id) {
    this.ensureContext();
    if (this.activeNodes[id]) return;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.01, this.volumes[id]), this.ctx.currentTime + 0.6);
    gain.connect(this.masterGain);

    const stopList = [];

    if (id === 'rain' || id === 'brown') {
      const src = this.ctx.createBufferSource();
      src.buffer = this.createNoiseBuffer(id === 'brown' ? 'brown' : 'pink');
      src.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = id === 'brown' ? 'lowpass' : 'bandpass';
      filter.frequency.value = id === 'brown' ? 320 : 1100;
      src.connect(filter);
      filter.connect(gain);
      src.start();
      stopList.push(() => src.stop());
    } else if (id === 'waves') {
      const src = this.ctx.createBufferSource();
      src.buffer = this.createNoiseBuffer('brown');
      src.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 520;
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.12;
      lfoGain.gain.value = 260;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      src.connect(filter);
      filter.connect(gain);
      src.start();
      lfo.start();
      stopList.push(() => { src.stop(); lfo.stop(); });
    } else if (id === 'wind') {
      const src = this.ctx.createBufferSource();
      src.buffer = this.createNoiseBuffer('pink');
      src.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 480;
      filter.Q.value = 3.5;
      src.connect(filter);
      filter.connect(gain);
      src.start();
      stopList.push(() => src.stop());
    } else if (id === 'freq432') {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 432;
      osc2.frequency.value = 216;
      const subGain = this.ctx.createGain();
      subGain.gain.value = 0.35;
      osc1.connect(gain);
      osc2.connect(subGain);
      subGain.connect(gain);
      osc1.start();
      osc2.start();
      stopList.push(() => { osc1.stop(); osc2.stop(); });
    }

    this.activeNodes[id] = { gain, stop: () => stopList.forEach((fn) => fn()) };
    renderSounds();
  },

  stopSound(id) {
    const item = this.activeNodes[id];
    if (!item) return;
    try {
      item.gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.15);
      setTimeout(() => {
        try { item.stop(); } catch {}
      }, 300);
    } catch {}
    delete this.activeNodes[id];
    renderSounds();
  },

  setVolume(id, val) {
    this.volumes[id] = Number(val);
    const item = this.activeNodes[id];
    if (item && this.ctx) {
      item.gain.gain.setTargetAtTime(Math.max(0.001, this.volumes[id]), this.ctx.currentTime, 0.08);
    }
  },

  stopAll() {
    Object.keys(this.activeNodes).forEach((id) => this.stopSound(id));
  },

  fadeOutAndStopAll() {
    if (!this.ctx || !this.masterGain) {
      this.stopAll();
      return;
    }
    this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 1.5);
    setTimeout(() => {
      this.stopAll();
      this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
    }, 4500);
  }
};

/* Sleep Timer */
let sleepTimerInterval = null;
let sleepSecondsLeft = 0;

function setSleepTimer(minutes) {
  clearInterval(sleepTimerInterval);
  sleepTimerInterval = null;
  document.querySelectorAll('.timer-btn[data-minutes]').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.minutes) === minutes);
  });

  if (!minutes) {
    sleepSecondsLeft = 0;
    document.getElementById('timerCountdown').textContent = '';
    return;
  }

  audioEngine.ensureContext();
  sleepSecondsLeft = minutes * 60;
  updateTimerLabel();

  sleepTimerInterval = setInterval(() => {
    sleepSecondsLeft -= 1;
    updateTimerLabel();
    if (sleepSecondsLeft <= 0) {
      clearInterval(sleepTimerInterval);
      sleepTimerInterval = null;
      document.getElementById('timerCountdown').textContent = '';
      audioEngine.fadeOutAndStopAll();
      showToast(t('toast_timer_ended'));
    }
  }, 1000);
}

function updateTimerLabel() {
  const m = String(Math.floor(sleepSecondsLeft / 60)).padStart(2, '0');
  const s = String(sleepSecondsLeft % 60).padStart(2, '0');
  document.getElementById('timerCountdown').textContent = `${m}:${s}`;
}

/* Navigasi & Dwibahasa */
function switchTab(tabName) {
  document.querySelectorAll('.tab-section').forEach((sec) => {
    sec.classList.toggle('active', sec.id === `tab-${tabName}`);
  });
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applyLanguage() {
  document.documentElement.lang = state.lang === 'ms' ? 'ms' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (typeof I18N[state.lang][key] === 'string') {
      el.textContent = I18N[state.lang][key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (typeof I18N[state.lang][key] === 'string') {
      el.placeholder = I18N[state.lang][key];
    }
  });

  const hour = new Date().getHours();
  const greetKey = hour < 12 ? 'greet_morning' : hour < 18 ? 'greet_afternoon' : 'greet_evening';
  document.getElementById('greetingTitle').textContent = t(greetKey);
  document.getElementById('greetingSub').textContent = t('greet_sub');
  document.getElementById('streakBadge').textContent = `🔥 ${state.streak}`;

  renderSessions();
  renderSounds();
  renderMoodHistory();
  renderProStatus();
}

/* Render Sesi & Program */
function renderSessions() {
  const pro = isProActive();
  const qList = document.getElementById('quickSessionsList');
  qList.innerHTML = QUICK_SESSIONS.map((s) => {
    const locked = s.proOnly && !pro;
    return `
      <div class="session-item ${locked ? 'locked' : ''}" onclick="handleSessionClick('${s.id}')">
        <div class="session-meta">
          <h4>${s.title[state.lang]}</h4>
          <p>${s.sub[state.lang]}</p>
        </div>
        <span class="pill ${s.proOnly ? 'pill-pro' : 'pill-free'}">${locked ? '🔒 ' : ''}${s.proOnly ? t('pro_pill') : t('free_pill')}</span>
      </div>
    `;
  }).join('');

  const pList = document.getElementById('sleepProgramList');
  pList.innerHTML = SLEEP_DAYS.map((d) => {
    const locked = d.proOnly && !pro;
    return `
      <div class="session-item ${locked ? 'locked' : ''}" onclick="handleSleepDayClick(${d.day})">
  
