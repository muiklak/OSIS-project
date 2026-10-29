// =========================================================================
// SCRIPT ENGINE 3-KOLOM PORTAL OSIS (RETRO 90S EDITION)
// Kolom 1: Inbound, Navigasi, PR Desk & PELACAK PENGUNJUNG GLOBAL (KENYA & WORLD)
// Kolom 2: Core Feed, Timeline Setahun, Proker, Struktur, Galeri, Aspirasi
// Kolom 3: Kotak Donasi (1 MENU QRIS & E-WALLET) + Retro Boombox + Stiker
// =========================================================================

// --- AUDIO & BOOMBOX MASTER PLAYER ENGINE (ORIGINAL TRACKS) ---
let audioCtx = null;
let sfxEnabled = true;
let isPlayingTrack = false;
let currentTrackIndex = 0;
let eqAnimInterval = null;
let ytAudioPlayer = null;
let isYtReady = false;

// 🎵 DAFTAR LAGU ASLI (ORIGINAL MASTER RECORDINGS - 100% OFFLINE LOCAL)
const originalTracks = [
    {
        title: "Avenged Sevenfold - Dear God",
        badge: "LAGU ASLI #01",
        artist: "Avenged Sevenfold",
        src: "audio/dear_god.mp3"
    },
    {
        title: "Avenged Sevenfold - Afterlife",
        badge: "LAGU ASLI #02",
        artist: "Avenged Sevenfold",
        src: "audio/afterlife.mp3"
    },
    {
        title: "Halstage - L",
        badge: "LAGU ASLI #03",
        artist: "Halstage (Hal)",
        src: "audio/halstage_l.mp3"
    }
];



function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// Retro Sound Effects (Clicks, Coins, Confetti Fanfare)
function playRetroSFX(type) {
    if (!sfxEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'coin') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, now);
            osc.frequency.setValueAtTime(1318.51, now + 0.08);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'stamp') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(70, now + 0.1);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'fanfare') {
            const melody = [523.25, 659.25, 783.99, 1046.50];
            melody.forEach((freq, idx) => {
                const noteOsc = ctx.createOscillator();
                const noteGain = ctx.createGain();
                noteOsc.type = 'triangle';
                noteOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
                noteGain.connect(ctx.destination);
                noteOsc.connect(noteGain);
                noteGain.gain.setValueAtTime(0.22, now + idx * 0.09);
                noteGain.gain.linearRampToValueAtTime(0.01, now + idx * 0.09 + 0.22);
                noteOsc.start(now + idx * 0.09);
                noteOsc.stop(now + idx * 0.09 + 0.22);
            });
        }
    } catch (e) {
        console.warn("Audio interaction waiting for gesture");
    }
}

// --- BOOMBOX PLAYBACK CONTROLS (LAGU ASLI) ---
function toggleCassetteTape() {
    if (isPlayingTrack) {
        stopAllAudioSources();
    } else {
        playTrack(currentTrackIndex);
    }
}

function playTrack(index) {
    if (index < 0) index = originalTracks.length - 1;
    if (index >= originalTracks.length) index = 0;
    currentTrackIndex = index;

    const track = originalTracks[currentTrackIndex];
    updateTrackInfoUI(track);

    stopAllAudioSources();

    const nativeAudio = document.getElementById("boombox-native-audio");
    if (nativeAudio && track.src) {
        nativeAudio.src = track.src;
        nativeAudio.load();
        const playPromise = nativeAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setBoomboxPlayingUI(true);
            }).catch(e => {
                console.warn("Audio playback error, trying m4a fallback:", e);
                // Jika mp3 mengalami kendala, gunakan fallback m4a
                if (track.src.endsWith(".mp3")) {
                    nativeAudio.src = track.src.replace(".mp3", ".m4a");
                    nativeAudio.load();
                    nativeAudio.play().then(() => {
                        setBoomboxPlayingUI(true);
                    }).catch(err => {
                        console.error("Audio failed to play:", err);
                        setBoomboxPlayingUI(false);
                    });
                } else {
                    setBoomboxPlayingUI(false);
                }
            });
        }
    }
}

function stopAllAudioSources() {
    const nativeAudio = document.getElementById("boombox-native-audio");
    if (nativeAudio) {
        nativeAudio.pause();
    }
    setBoomboxPlayingUI(false);
}

function prevCassetteTrack() {
    playRetroSFX('click');
    currentTrackIndex = (currentTrackIndex - 1 + originalTracks.length) % originalTracks.length;
    playTrack(currentTrackIndex);
}

function nextCassetteTrack() {
    playRetroSFX('click');
    currentTrackIndex = (currentTrackIndex + 1) % originalTracks.length;
    playTrack(currentTrackIndex);
}

function setBoomboxPlayingUI(playing) {
    isPlayingTrack = playing;
    const playIcon = document.getElementById("play-icon");
    const playText = document.getElementById("play-text");
    const stateText = document.getElementById("cassette-state-text");
    const reelLeft = document.getElementById("cassette-reel-left");
    const reelRight = document.getElementById("cassette-reel-right");

    if (playing) {
        if (playIcon) playIcon.className = "fa-solid fa-pause";
        if (playText) playText.textContent = "PAUSE";
        if (stateText) {
            stateText.textContent = "PLAYING";
            stateText.className = "text-retro-yellow animate-pulse";
        }
        if (reelLeft) reelLeft.classList.remove("spin-reel-paused");
        if (reelRight) reelRight.classList.remove("spin-reel-paused");

        startVisualizerAnimation();
    } else {
        if (playIcon) playIcon.className = "fa-solid fa-play";
        if (playText) playText.textContent = "PLAY";
        if (stateText) {
            stateText.textContent = "READY";
            stateText.className = "text-zinc-600";
        }
        if (reelLeft) reelLeft.classList.add("spin-reel-paused");
        if (reelRight) reelRight.classList.add("spin-reel-paused");

        stopVisualizerAnimation();
    }
}

function startVisualizerAnimation() {
    if (eqAnimInterval) clearInterval(eqAnimInterval);
    const eqBars = document.querySelectorAll(".eq-bar");
    eqAnimInterval = setInterval(() => {
        eqBars.forEach(bar => {
            const rndH = Math.floor(Math.random() * 18) + 4;
            bar.style.height = `${rndH}px`;
        });
    }, 100);
}

function stopVisualizerAnimation() {
    if (eqAnimInterval) clearInterval(eqAnimInterval);
    const eqBars = document.querySelectorAll(".eq-bar");
    eqBars.forEach(bar => {
        bar.style.height = '4px';
    });
}

function updateTrackInfoUI(track) {
    const trackNameEl = document.getElementById("current-track-name");
    const trackBadgeEl = document.getElementById("current-track-badge");
    if (trackNameEl) trackNameEl.textContent = track.title;
    if (trackBadgeEl) trackBadgeEl.textContent = track.badge;

    // Highlight pill tombol track aktif
    document.querySelectorAll(".boombox-track-btn").forEach((btn, idx) => {
        if (idx === currentTrackIndex) {
            btn.className = "boombox-track-btn brutal-btn py-1 px-1 bg-retro-yellow text-black rounded font-bold truncate text-[9px]";
        } else {
            btn.className = "boombox-track-btn brutal-btn py-1 px-1 bg-zinc-800 text-zinc-300 hover:text-white rounded truncate text-[9px]";
        }
    });
}


// --- MAIN LIFECYCLE ---
document.addEventListener("DOMContentLoaded", () => {
    renderUmum();
    renderTentang();
    renderTimeline();
    renderDonasi();
    renderPengurus();
    renderProker();
    renderGaleri();
    renderKontak();
    setupVisitorTracker();
    setupEventListeners();
    setupStickerBoard();
    setupTouchAndNavigation();
    setupScrollAnimationsAndTilt();
    if (typeof originalTracks !== 'undefined' && originalTracks.length > 0) {
        updateTrackInfoUI(originalTracks[0]);
    }
});


// 1. Render Data Umum (Header, Inbound Card, Hero)
function renderUmum() {
    if (typeof dataUmum === 'undefined') return;

    // Header & Brand
    document.title = `${dataUmum.namaSekolah} - Official 3-Column Portal & PR Hub`;
    document.getElementById("nav-logo-img").src = dataUmum.logo;
    document.getElementById("nav-school-name").textContent = dataUmum.namaSekolah;
    document.getElementById("nav-cabinet-name").textContent = `${dataUmum.namaKabinet} • ${dataUmum.periode}`;

    // Left Column: Inbound OSIS ID Card
    const inboundLogo = document.getElementById("inbound-logo-img");
    if (inboundLogo) inboundLogo.src = dataUmum.logo;

    // Center Column: Hero Console
    const h = dataUmum.hero;
    document.getElementById("hero-badge").textContent = h.badge;
    document.getElementById("hero-title-main").textContent = h.judulUtama;
    document.getElementById("hero-title-highlight").textContent = h.judulHighlight;
    document.getElementById("hero-desc").textContent = h.deskripsi;
    document.getElementById("hero-main-img").src = h.fotoHero;
    document.getElementById("hero-caption-title").textContent = h.heroCaptionJudul;
    document.getElementById("hero-badge-status").textContent = h.statusBadgeText;

    // Stats Grid
    const statsContainer = document.getElementById("hero-stats-container");
    statsContainer.innerHTML = h.statistik.map(stat => `
        <div class="p-2.5 bg-white border-2 border-black rounded-lg text-center shadow-brutal-sm">
            <div class="font-display font-black text-xl sm:text-2xl text-retro-pink">${stat.angka}</div>
            <div class="font-mono text-[10px] font-bold text-zinc-600">${stat.label}</div>
        </div>
    `).join('');
}


// 2. Render Sambutan Ketua, Visi & Misi
function renderTentang() {
    if (typeof dataTentang === 'undefined') return;

    // Ketua OSIS
    const k = dataTentang.ketua;
    document.getElementById("ketua-foto").src = k.foto;
    document.getElementById("ketua-nama").textContent = k.nama;
    document.getElementById("ketua-jabatan").textContent = `${k.jabatan}`;
    document.getElementById("ketua-kutipan").textContent = `"${k.kutipan}"`;

    // Visi
    document.getElementById("visi-title").textContent = dataTentang.visi.judul;
    document.getElementById("visi-text").textContent = `"${dataTentang.visi.teks}"`;

    // Misi
    document.getElementById("misi-title").textContent = dataTentang.misi.judul;
    const misiList = document.getElementById("misi-list");
    misiList.innerHTML = dataTentang.misi.daftar.map((item, index) => `
        <li class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded bg-retro-yellow text-black border border-black flex items-center justify-center font-pixel text-[9px] font-bold mt-0.5 shrink-0 shadow-brutal-sm">${index + 1}</span>
            <span>${item}</span>
        </li>
    `).join('');
}


// 3. Render Timeline Setahun & Public Relations (Center Column)
function renderTimeline() {
    if (typeof dataTimeline === 'undefined') return;

    document.getElementById("timeline-badge").textContent = dataTimeline.badge;
    document.getElementById("timeline-title").textContent = dataTimeline.judul;
    document.getElementById("timeline-desc").textContent = dataTimeline.subjudul;

    // PR Impact Counters
    const prStatsContainer = document.getElementById("pr-stats-container");
    if (prStatsContainer && dataTimeline.statsPR) {
        prStatsContainer.innerHTML = dataTimeline.statsPR.map(st => `
            <div class="p-2 bg-white border-2 border-black rounded-lg text-center shadow-brutal-sm">
                <i class="${st.ikon} text-retro-pink text-sm mb-0.5"></i>
                <div class="font-display font-black text-lg text-black">${st.angka}</div>
                <div class="font-mono text-[9px] text-zinc-600 font-bold leading-tight">${st.label}</div>
            </div>
        `).join('');
    }

    renderTimelineCards('all');
}

function renderTimelineCards(filterQuarter) {
    if (typeof dataTimeline === 'undefined' || !dataTimeline.agenda) return;

    const grid = document.getElementById("timeline-cards-grid");
    const filtered = filterQuarter === 'all' 
        ? dataTimeline.agenda 
        : dataTimeline.agenda.filter(a => a.quarter === filterQuarter);

    grid.innerHTML = filtered.map((item, index) => {
        const nodeNum = String(index + 1).padStart(2, '0');
        const isCompleted = item.status && (item.status.toLowerCase().includes('terlaksana') || item.status.toLowerCase().includes('selesai'));
        const questBadge = isCompleted 
            ? `<span class="brutal-badge bg-retro-lime text-black px-2 py-0.5 rounded text-[8px] font-pixel"><i class="fa-solid fa-check mr-1"></i> QUEST CLEARED</span>`
            : `<span class="brutal-badge bg-retro-pink text-white px-2 py-0.5 rounded text-[8px] font-pixel"><i class="fa-solid fa-clock mr-1"></i> ACTIVE QUEST</span>`;

        return `
        <div class="relative pl-6 sm:pl-10 timeline-checkpoint-node scroll-reveal tilt-card">
            <!-- Road map vertical marker line -->
            <div class="absolute left-2.5 sm:left-4 top-0 bottom-0 w-0.5 bg-black/20 dark:bg-yellow-400/30"></div>
            <!-- Checkpoint circle icon -->
            <div class="absolute left-0 sm:left-1.5 top-4 w-6 h-6 sm:w-7 sm:h-7 rounded-full ${isCompleted ? 'bg-retro-lime text-black' : 'bg-retro-yellow text-black'} border-2 border-black font-pixel text-[8px] sm:text-[9px] flex items-center justify-center font-black shadow-brutal-sm z-10">
                ${nodeNum}
            </div>

            <div class="brutal-card bg-white border-2 border-black p-4 hover:shadow-brutal transition-all overflow-hidden">
                <div class="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-zinc-200">
                    <div class="flex items-center gap-2">
                        <span class="brutal-badge bg-black text-retro-yellow px-2 py-0.5 rounded text-[8px] font-pixel">
                            ${item.quarter}
                        </span>
                        <span class="font-mono text-xs font-bold text-zinc-500">${item.periode}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        ${questBadge}
                        <span class="brutal-badge ${item.statusColor} px-2 py-0.2 rounded text-[9px] font-pixel">
                            ${item.status}
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div class="sm:col-span-4 aspect-video overflow-hidden border border-black rounded bg-zinc-100 relative group">
                        <img src="${item.foto}" alt="${item.judul}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        <span class="absolute bottom-1 left-1 bg-black/80 text-retro-yellow border border-retro-yellow px-1.5 py-0.2 rounded font-pixel text-[7px]">
                            NODE_${nodeNum}.JPG
                        </span>
                    </div>
                    <div class="sm:col-span-8">
                        <span class="font-mono text-[10px] text-retro-pink font-bold uppercase tracking-wide">${item.sekbid}</span>
                        <h4 class="font-display font-black text-base text-black mt-0.5 leading-snug">${item.judul}</h4>
                        <p class="font-sans text-xs text-zinc-600 mt-1 leading-relaxed">${item.deskripsi}</p>
                    </div>
                </div>

                <div class="mt-3 pt-2 border-t border-dashed border-zinc-200 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-600 gap-1">
                    <span><i class="fa-solid fa-location-dot text-black mr-1"></i> ${item.lokasi}</span>
                    <span><strong>Capaian:</strong> ${item.capaian}</span>
                </div>
            </div>
        </div>
        `;
    }).join('');

    if (typeof setupScrollAnimationsAndTilt === 'function') {
        setupScrollAnimationsAndTilt();
    }
}


// 4. Render Kolom Donasi (KOLOM 3 KANAN - 1 MENU QRIS & E-WALLET)
function renderDonasi() {
    if (typeof dataDonasi === 'undefined') return;

    // Header & Target Progress Bar
    document.getElementById("donasi-target-val").textContent = dataDonasi.targetDonasi;
    document.getElementById("donasi-terkumpul-val").textContent = dataDonasi.terkumpulDonasi;
    document.getElementById("donasi-persen-badge").textContent = `${dataDonasi.persentase}%`;
    document.getElementById("donasi-progress-fill").style.width = `${dataDonasi.persentase}%`;
    document.getElementById("donasi-total-donatur").textContent = dataDonasi.totalDonatur;

    // QRIS image in right column
    const col3Qris = document.getElementById("col3-qris-img");
    if (col3Qris && dataDonasi.qris) col3Qris.src = dataDonasi.qris.gambar;

    // WhatsApp link
    const col3Wa = document.getElementById("col3-wa-btn");
    if (col3Wa && dataDonasi.waKonfirmasi) col3Wa.href = dataDonasi.waKonfirmasi;

    // Tab switcher between QRIS & E-Wallet / Bank
    const tabQris = document.getElementById("tab-btn-qris");
    const tabEwallet = document.getElementById("tab-btn-ewallet");
    const viewQris = document.getElementById("view-qris-container");
    const viewEwallet = document.getElementById("view-ewallet-container");

    if (tabQris && tabEwallet && viewQris && viewEwallet) {
        tabQris.addEventListener("click", () => {
            playRetroSFX('click');
            tabQris.className = "w-1/2 py-1.5 px-2 bg-retro-yellow text-black font-display font-black text-xs rounded border border-black shadow-brutal-sm flex items-center justify-center gap-1 transition-all";
            tabEwallet.className = "w-1/2 py-1.5 px-2 bg-white text-zinc-700 font-display font-bold text-xs rounded border border-transparent hover:border-black flex items-center justify-center gap-1 transition-all";
            viewQris.classList.remove("hidden");
            viewEwallet.classList.add("hidden");
        });

        tabEwallet.addEventListener("click", () => {
            playRetroSFX('click');
            tabEwallet.className = "w-1/2 py-1.5 px-2 bg-retro-yellow text-black font-display font-black text-xs rounded border border-black shadow-brutal-sm flex items-center justify-center gap-1 transition-all";
            tabQris.className = "w-1/2 py-1.5 px-2 bg-white text-zinc-700 font-display font-bold text-xs rounded border border-transparent hover:border-black flex items-center justify-center gap-1 transition-all";
            viewEwallet.classList.remove("hidden");
            viewQris.classList.add("hidden");
        });
    }

    // Quick Amount Chips
    const amtButtons = document.querySelectorAll(".quick-amt-btn");
    amtButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            playRetroSFX('click');
            amtButtons.forEach(b => {
                b.classList.remove("bg-retro-yellow", "font-bold");
                b.classList.add("bg-white");
            });
            btn.classList.remove("bg-white");
            btn.classList.add("bg-retro-yellow", "font-bold");
        });
    });

    // Copy Account Buttons with Mobile & Protocol Fallback
    const copyBtns = document.querySelectorAll(".copy-rek-btn");
    copyBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            playRetroSFX('coin');
            const num = btn.getAttribute("data-copy");
            if (num) {
                copyTextWithFallback(num, () => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = `<i class="fa-solid fa-check text-emerald-600"></i> Salin!`;
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                });
            }
        });
    });

    // Celebrate Donation Button (Confetti & Fanfare)
    const celebrateBtn = document.getElementById("btn-celebrate-donation");
    if (celebrateBtn) {
        celebrateBtn.addEventListener("click", () => {
            playRetroSFX('fanfare');

            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#F59E0B', '#1E3A5F', '#0284C7', '#10B981', '#0F2744']
                });
            }

            celebrateBtn.innerHTML = `<i class="fa-solid fa-heart text-retro-pink mr-1"></i> Terima Kasih! Donasi Tercatat`;
            setTimeout(() => {
                celebrateBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Sudah Donasi? Klik Rayakan! 🎉`;
            }, 3500);
        });
    }
}

// Helper: Copy Text with Fallback for Mobile and file:/// environments
function copyTextWithFallback(text, onSuccess) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
            legacyCopy(text, onSuccess);
        });
    } else {
        legacyCopy(text, onSuccess);
    }
}

function legacyCopy(text, onSuccess) {
    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (onSuccess) onSuccess();
    } catch (err) {
        console.warn("Copy fallback failed:", err);
    }
}


// 5. FITUR KHUSUS: LIVE VISITOR RADAR & GEOLOCATION TRACKER
// Mendeteksi pengunjung (misalnya jika dari Kenya, Indonesia, dll.) dan menampilkan jumlah hits
async function setupVisitorTracker() {
    // 1. Hit Counter Logic (Stored in localStorage with realistic base)
    let hits = parseInt(localStorage.getItem('osis_retro_hits') || '14835', 10);
    hits += 1;
    localStorage.setItem('osis_retro_hits', hits.toString());

    // Render odometer digital retro blocks with slot-machine rolling animation
    const hitStr = hits.toString().padStart(6, '0');
    const odometerEl = document.getElementById("visitor-odometer");
    if (odometerEl) {
        let rollCount = 0;
        const maxRolls = 7;
        const rollTimer = setInterval(() => {
            rollCount++;
            if (rollCount >= maxRolls) {
                clearInterval(rollTimer);
                odometerEl.innerHTML = hitStr.split('').map(d => `<span class="odometer-digit animate-[bounce_0.2s_ease-out]">${d}</span>`).join('');
                if (typeof playRetroSFX === 'function') playRetroSFX('coin');
            } else {
                odometerEl.innerHTML = Array.from({length: 6}, () => `<span class="odometer-digit text-retro-cyan">${Math.floor(Math.random() * 10)}</span>`).join('');
            }
        }, 65);
    }

    // 2. Fetch User Geolocation (Using free CORS IP Geo API with fallback)
    let userGeo = {
        country: "Mendeteksi...",
        countryCode: "ID",
        city: "Sedang memuat...",
        flag: "🌍",
        ip: "197.xxx.xxx"
    };

    try {
        const response = await fetch("https://ipwho.is/");
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                userGeo.country = data.country || "Indonesia";
                userGeo.countryCode = data.country_code || "ID";
                userGeo.city = data.city || "Kota Pengunjung";
                userGeo.flag = data.flag ? data.flag.emoji : getFlagEmoji(data.country_code);
                userGeo.ip = data.ip ? data.ip.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, "$1.$2.xxx.xxx") : "197.232.xxx.xxx";
            }
        }
    } catch (e) {
        console.warn("ipwho.is unavailable, trying fallback...", e);
        try {
            const res2 = await fetch("https://ipapi.co/json/");
            if (res2.ok) {
                const data2 = await res2.json();
                userGeo.country = data2.country_name || "Indonesia";
                userGeo.countryCode = data2.country_code || "ID";
                userGeo.city = data2.city || "Kota Pengunjung";
                userGeo.flag = getFlagEmoji(data2.country_code);
                userGeo.ip = "197.232.xxx.xxx";
            }
        } catch (e2) {
            // Fallback for Kenya / International simulation if offline
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
            if (tz.includes("Nairobi") || tz.includes("Africa")) {
                userGeo.country = "Kenya";
                userGeo.countryCode = "KE";
                userGeo.city = "Nairobi";
                userGeo.flag = "🇰🇪";
            } else {
                userGeo.country = "Indonesia";
                userGeo.countryCode = "ID";
                userGeo.city = "Jakarta";
                userGeo.flag = "🇮🇩";
            }
        }
    }

    // 3. Update HUD & Top Ticker
    const topCountry = document.getElementById("top-country-name");
    if (topCountry) topCountry.textContent = `${userGeo.flag} ${userGeo.country.toUpperCase()}`;

    const hudFlag = document.getElementById("hud-flag-emoji");
    const hudCountry = document.getElementById("hud-country-text");
    if (hudFlag) hudFlag.textContent = userGeo.flag;
    if (hudCountry) hudCountry.textContent = `${userGeo.country} (${userGeo.city})`;

    // 4. Update Column 1 Visitor Radar Card
    const detFlag = document.getElementById("detected-country-flag");
    const detCountry = document.getElementById("detected-country-name");
    const detCityIp = document.getElementById("detected-city-ip");

    if (detFlag) detFlag.textContent = userGeo.flag;
    if (detCountry) detCountry.textContent = `${userGeo.country}`;
    if (detCityIp) detCityIp.textContent = `${userGeo.city} • IP: ${userGeo.ip}`;

    // 5. Populate Global Recent Visitors Feed
    const recentFeed = document.getElementById("recent-visitors-list");
    if (recentFeed) {
        const globalVisitors = [
            { flag: userGeo.flag, country: userGeo.country, city: userGeo.city, time: "Baru Saja (Anda!)", highlight: true },
            { flag: "🇰🇪", country: "Kenya", city: "Nairobi", time: "2m lalu", highlight: false },
            { flag: "🇮🇩", country: "Indonesia", city: "Jakarta", time: "5m lalu", highlight: false },
            { flag: "🇯🇵", country: "Jepang", city: "Tokyo", time: "22m lalu", highlight: false },
            { flag: "🇺🇸", country: "Amerika Serikat", city: "San Francisco", time: "48m lalu", highlight: false }
        ];

        recentFeed.innerHTML = globalVisitors.map(v => `
            <div class="flex items-center justify-between p-1.5 rounded ${v.highlight ? 'bg-retro-yellow text-black font-bold border border-black' : 'bg-zinc-900 text-zinc-300'}">
                <span class="flex items-center gap-1.5 truncate">
                    <span>${v.flag}</span>
                    <span class="truncate">${v.country} <span class="text-[9px] text-zinc-400">(${v.city})</span></span>
                </span>
                <span class="text-[9px] shrink-0 text-zinc-400 font-mono">${v.time}</span>
            </div>
        `).join('');
    }
}

// Helper: Convert 2-letter country code into flag emoji
function getFlagEmoji(code) {
    if (!code || code.length !== 2) return "🌍";
    const codePoints = code.toUpperCase().split("").map(c => 127397 + c.charCodeAt());
    return String.fromCodePoint(...codePoints);
}


// 6. Render Program Kerja Unggulan (Center Column)
function renderProker() {
    if (typeof dataProker === 'undefined') return;

    document.getElementById("proker-badge").textContent = dataProker.badge;
    document.getElementById("proker-title").textContent = dataProker.judul;
    document.getElementById("proker-desc").textContent = dataProker.subjudul;

    const prokerGrid = document.getElementById("proker-grid");
    prokerGrid.innerHTML = dataProker.daftar.map(p => `
        <div class="brutal-card bg-white border-2 border-black p-4 hover:shadow-brutal transition-all">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div class="sm:col-span-4 aspect-video overflow-hidden border border-black rounded bg-zinc-200 relative">
                    <img src="${p.gambar}" alt="${p.judul}" class="w-full h-full object-cover">
                    <span class="absolute top-1.5 left-1.5 brutal-badge ${p.statusColor || 'bg-retro-pink'} text-white text-[8px] font-pixel px-1.5 py-0.2 rounded">
                        ${p.status}
                    </span>
                </div>
                <div class="sm:col-span-8">
                    <span class="font-mono text-[9px] font-bold text-retro-cyan bg-black px-1.5 py-0.2 rounded">${p.sekbid}</span>
                    <h3 class="font-display font-black text-base text-black mt-1 leading-snug">${p.judul}</h3>
                    <p class="font-sans text-xs text-zinc-600 mt-1 leading-relaxed">${p.deskripsi}</p>
                    <div class="mt-2 text-[10px] font-mono text-zinc-500 flex items-center gap-3">
                        <span><i class="fa-solid fa-location-dot text-black mr-0.5"></i> ${p.lokasi}</span>
                        <span><i class="fa-solid fa-users text-black mr-0.5"></i> ${p.peserta}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}


// 7. Render Struktur Pengurus (Center Column)
function renderPengurus() {
    if (typeof dataPengurus === 'undefined') return;

    document.getElementById("pengurus-badge").textContent = dataPengurus.badge;
    document.getElementById("pengurus-title").textContent = dataPengurus.judul;
    document.getElementById("pengurus-desc").textContent = dataPengurus.subjudul;

    // Filter Buttons
    const filterContainer = document.getElementById("pengurus-filter-container");
    filterContainer.innerHTML = dataPengurus.kategori.map((cat, idx) => `
        <button class="pengurus-filter-btn brutal-btn ${idx === 0 ? 'bg-black text-retro-yellow' : 'bg-white text-black'} px-2.5 py-1 rounded-lg text-[10px] font-bold" data-category="${cat.id}">
            ${cat.label}
        </button>
    `).join('');

    // Members Grid
    const membersGrid = document.getElementById("members-grid");
    membersGrid.innerHTML = dataPengurus.anggota.map(m => `
        <div class="member-card brutal-card bg-white p-2 border-2 border-black shadow-brutal-sm hover:shadow-brutal transition-all stagger-item" data-category="${m.kategori}">
            <div class="relative aspect-[3/4] overflow-hidden border border-black rounded bg-zinc-100 group">
                <img src="${m.foto}" alt="${m.nama}" class="w-full h-full object-cover">
                <div class="absolute top-1 right-1 brutal-badge bg-black text-white px-1.5 py-0.2 rounded text-[8px] font-pixel">
                    ${m.badgeKategori}
                </div>
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    ${m.instagram ? `<a href="${m.instagram}" target="_blank" class="w-7 h-7 rounded bg-retro-pink text-white flex items-center justify-center border border-black text-xs"><i class="fa-brands fa-instagram"></i></a>` : ''}
                    ${m.email ? `<a href="${m.email}" class="w-7 h-7 rounded bg-retro-cyan text-black flex items-center justify-center border border-black text-xs"><i class="fa-solid fa-envelope"></i></a>` : ''}
                </div>
            </div>
            <div class="pt-2 text-center">
                <span class="font-mono text-[9px] font-bold text-retro-pink uppercase block leading-none">${m.jabatan}</span>
                <h4 class="font-display font-black text-xs text-black mt-1 truncate">${m.nama}</h4>
                <p class="font-mono text-[9px] text-zinc-500">${m.subJabatan}</p>
            </div>
        </div>
    `).join('');
}


// 8. Render Galeri Foto (Center Column)
function renderGaleri() {
    if (typeof dataGaleri === 'undefined') return;

    document.getElementById("galeri-badge").textContent = dataGaleri.badge;
    document.getElementById("galeri-title").textContent = dataGaleri.judul;
    document.getElementById("galeri-desc").textContent = dataGaleri.subjudul;

    const galeriGrid = document.getElementById("galeri-grid");
    galeriGrid.innerHTML = dataGaleri.foto.map((f, i) => {
        const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'];
        const rot = rotations[i % rotations.length];
        return `
            <div class="brutal-card p-2 bg-white border-2 border-black shadow-brutal-sm hover:rotate-0 transition-transform ${rot} taped-corner stagger-item">
                <div class="relative aspect-video overflow-hidden border border-black rounded bg-zinc-100">
                    <img src="${f.gambar}" alt="${f.judul}" class="w-full h-full object-cover">
                </div>
                <div class="pt-2 pb-0.5 text-center font-mono">
                    <p class="font-bold text-[11px] text-black leading-tight">${f.judul}</p>
                    <span class="text-[9px] text-zinc-500 mt-0.5 block">${f.waktu}</span>
                </div>
            </div>
        `;
    }).join('');
}


// 9. Render Kontak, Aspirasi & Footer
function renderKontak() {
    if (typeof dataKontak === 'undefined') return;

    const asp = dataKontak.aspirasi;
    document.getElementById("aspirasi-badge").textContent = asp.badge;
    document.getElementById("aspirasi-title").textContent = asp.judul;
    document.getElementById("aspirasi-desc").textContent = asp.deskripsi;
    document.getElementById("aspirasi-nama").placeholder = asp.placeholderNama;
    document.getElementById("aspirasi-pesan").placeholder = asp.placeholderPesan;
    document.getElementById("aspirasi-btn-text").textContent = asp.tombolKirim;
    document.getElementById("aspirasi-alert-text").textContent = asp.pesanSukses;

    const ft = dataKontak.footer;
    document.getElementById("footer-school-name").textContent = (typeof dataUmum !== 'undefined') ? dataUmum.namaSekolah : "OSIS SMKN BATUJAYA";
    document.getElementById("footer-desc").textContent = ft.deskripsiSingkat;
    document.getElementById("footer-alamat").textContent = ft.alamat;
    document.getElementById("footer-email").textContent = ft.email;
    document.getElementById("footer-telp").textContent = ft.telepon;
    document.getElementById("footer-copyright").textContent = ft.copyright;
    document.getElementById("footer-tagline").textContent = ft.taglineFooter;

    if (ft.sosialMedia) {
        if (ft.sosialMedia.instagram) {
            document.getElementById("footer-ig").href = ft.sosialMedia.instagram;
            const inboundIg = document.getElementById("inbound-ig");
            if (inboundIg) inboundIg.href = ft.sosialMedia.instagram;
        }
        if (ft.sosialMedia.youtube) {
            document.getElementById("footer-yt").href = ft.sosialMedia.youtube;
            const inboundYt = document.getElementById("inbound-yt");
            if (inboundYt) inboundYt.href = ft.sosialMedia.youtube;
        }
        if (ft.sosialMedia.tiktok) {
            document.getElementById("footer-tiktok").href = ft.sosialMedia.tiktok;
            const inboundTt = document.getElementById("inbound-tiktok");
            if (inboundTt) inboundTt.href = ft.sosialMedia.tiktok;
        }
        if (ft.sosialMedia.spotify) {
            document.getElementById("footer-spotify").href = ft.sosialMedia.spotify;
        }
    }
}


// --- INTERACTIVE STICKER BOARD ---
let selectedStickerText = "⚡ GOKIL!";

function setupStickerBoard() {
    const canvas = document.getElementById("corkboard-canvas");
    const placeholder = document.getElementById("corkboard-placeholder");
    const choiceBtns = document.querySelectorAll(".sticker-choice-btn");
    const clearBtn = document.getElementById("clear-stickers-btn");

    choiceBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            playRetroSFX('click');
            choiceBtns.forEach(b => b.classList.remove("ring-2", "ring-black"));
            btn.classList.add("ring-2", "ring-black");
            selectedStickerText = btn.getAttribute("data-sticker");
        });
    });

    if (canvas) {
        const placeSticker = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            const x = (clientX !== undefined ? clientX : rect.left + rect.width / 2) - rect.left;
            const y = (clientY !== undefined ? clientY : rect.top + rect.height / 2) - rect.top;

            playRetroSFX('stamp');
            if (placeholder) placeholder.style.display = 'none';

            const angle = Math.floor(Math.random() * 30) - 15;
            const colors = ['bg-retro-yellow text-black', 'bg-retro-pink text-white', 'bg-retro-cyan text-black', 'bg-retro-lime text-black'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            const sticker = document.createElement("div");
            sticker.className = `absolute brutal-badge ${randomColor} px-2 py-0.5 rounded text-[8px] font-pixel select-none cursor-pointer transform hover:scale-110 active:scale-95 transition-transform shadow-brutal-sm`;
            sticker.style.left = `${Math.max(5, Math.min(x - 35, rect.width - 70))}px`;
            sticker.style.top = `${Math.max(5, Math.min(y - 12, rect.height - 25))}px`;
            sticker.style.transform = `rotate(${angle}deg)`;
            sticker.innerHTML = `<span>${selectedStickerText}</span>`;
            
            const removeStk = (stkEvent) => {
                stkEvent.stopPropagation();
                playRetroSFX('click');
                sticker.remove();
            };
            sticker.addEventListener("click", removeStk);
            sticker.addEventListener("pointerdown", (e) => e.stopPropagation());

            canvas.appendChild(sticker);
        };

        canvas.addEventListener("pointerdown", (e) => {
            placeSticker(e.clientX, e.clientY);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            playRetroSFX('click');
            const stickers = canvas.querySelectorAll(".brutal-badge");
            stickers.forEach(s => s.remove());
            if (placeholder) placeholder.style.display = 'block';
        });
    }
}


// --- GENERAL EVENT LISTENERS ---
function setupEventListeners() {
    // 0. Dark Mode / Theme Toggle
    const themeBtn = document.getElementById("theme-toggle-btn");
    const updateThemeUI = (isDark) => {
        const themeIcon = document.getElementById("theme-icon");
        const themeStatus = document.getElementById("theme-status");
        if (themeIcon) {
            themeIcon.className = isDark ? "fa-solid fa-sun text-retro-yellow transition-transform duration-300" : "fa-solid fa-moon text-retro-yellow transition-transform duration-300";
        }
        if (themeStatus) {
            themeStatus.textContent = isDark ? "DARK: ON" : "DARK: OFF";
        }
    };

    // Initialize UI on load based on class
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    updateThemeUI(isCurrentlyDark);

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            playRetroSFX('coin');
            const isDarkNow = document.documentElement.classList.toggle("dark");
            localStorage.setItem('osis_theme', isDarkNow ? 'dark' : 'light');
            updateThemeUI(isDarkNow);
        });
    }

    // SFX Sound Toggle
    const sfxBtn = document.getElementById("sfx-toggle-btn");
    if (sfxBtn) {
        sfxBtn.addEventListener("click", () => {
            sfxEnabled = !sfxEnabled;
            const statusText = document.getElementById("sfx-status");
            const icon = document.getElementById("sfx-icon");
            if (sfxEnabled) {
                if (statusText) statusText.textContent = "SFX: ON";
                if (icon) icon.className = "fa-solid fa-volume-high";
                playRetroSFX('coin');
            } else {
                if (statusText) statusText.textContent = "SFX: OFF";
                if (icon) icon.className = "fa-solid fa-volume-xmark";
            }
        });
    }

    // CRT Filter Toggle
    const crtBtn = document.getElementById("crt-toggle-btn");
    if (crtBtn) {
        crtBtn.addEventListener("click", () => {
            playRetroSFX('click');
            const isActive = document.body.classList.toggle("crt-active");
            const crtStatus = document.getElementById("crt-status");
            if (crtStatus) crtStatus.textContent = isActive ? "CRT: ON" : "CRT: OFF";
        });
    }

    // Cassette Player Buttons
    const playBtn = document.getElementById("cassette-play-btn");
    const prevBtn = document.getElementById("cassette-prev-btn");
    const nextBtn = document.getElementById("cassette-next-btn");
    const stopBtn = document.getElementById("cassette-stop-btn");

    if (playBtn) playBtn.addEventListener("click", toggleCassetteTape);
    if (prevBtn) prevBtn.addEventListener("click", prevCassetteTrack);
    if (nextBtn) nextBtn.addEventListener("click", nextCassetteTrack);
    if (stopBtn) stopBtn.addEventListener("click", () => {
        playRetroSFX('click');
        stopAllAudioSources();
    });

    // Quick Track Switcher Pills
    const trackPills = document.querySelectorAll(".boombox-track-btn");
    trackPills.forEach(pill => {
        pill.addEventListener("click", () => {
            playRetroSFX('click');
            const targetIndex = parseInt(pill.getAttribute("data-track-index"), 10);
            if (!isNaN(targetIndex)) {
                playTrack(targetIndex);
            }
        });
    });

    // Native Audio ended & fallback listener
    const nativeAudio = document.getElementById("boombox-native-audio");
    if (nativeAudio) {
        nativeAudio.addEventListener("ended", () => {
            nextCassetteTrack();
        });
        nativeAudio.addEventListener("error", () => {
            const track = originalTracks[currentTrackIndex];
            console.warn(`Native audio error for ${track?.title}`);
        });
    }

    // Timeline Quarter Tabs
    const timelineTabs = document.querySelectorAll(".timeline-tab");
    timelineTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            playRetroSFX('click');
            timelineTabs.forEach(t => {
                t.classList.remove('bg-black', 'text-retro-yellow');
                t.classList.add('bg-white', 'text-black');
            });
            tab.classList.remove('bg-white', 'text-black');
            tab.classList.add('bg-black', 'text-retro-yellow');

            const quarter = tab.getAttribute("data-quarter");
            renderTimelineCards(quarter);
        });
    });

    // Pengurus Category Filter
    const filterContainer = document.getElementById("pengurus-filter-container");
    if (filterContainer) {
        filterContainer.addEventListener("click", (e) => {
            const btn = e.target.closest(".pengurus-filter-btn");
            if (!btn) return;

            playRetroSFX('click');
            const allBtns = filterContainer.querySelectorAll(".pengurus-filter-btn");
            allBtns.forEach(b => {
                b.classList.remove('bg-black', 'text-retro-yellow');
                b.classList.add('bg-white', 'text-black');
            });
            btn.classList.remove('bg-white', 'text-black');
            btn.classList.add('bg-black', 'text-retro-yellow');

            const category = btn.getAttribute('data-category');
            const memberCards = document.querySelectorAll('.member-card');
            memberCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Kotak Aspirasi Submission
    const aspirasiForm = document.getElementById('aspirasi-form');
    const aspirasiAlert = document.getElementById('aspirasi-alert');
    if (aspirasiForm && aspirasiAlert) {
        aspirasiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            playRetroSFX('fanfare');
            aspirasiAlert.classList.remove('hidden');
            aspirasiForm.reset();
            setTimeout(() => {
                aspirasiAlert.classList.add('hidden');
            }, 6000);
        });
    }

    // Global retro click sound on buttons
    document.querySelectorAll('.brutal-btn').forEach(elem => {
        elem.addEventListener('click', () => {
            playRetroSFX('click');
        });
    });
}

// --- TOUCH & NAVIGATION CONTROLLER (RESPONSIVE DESKTOP & MOBILE) ---
// Memastikan semua interaksi tombol, link, dan touch bekerja responsif dan mulus di layar HP maupun Desktop
function setupTouchAndNavigation() {
    // 1. Audio unlock pada interaksi touch/klik pertama (kebijakan autoplay browser mobile)
    const unlockAudio = () => {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('click', unlockAudio);
    };
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('click', unlockAudio, { passive: true });

    // 2. Navigasi cepat: smooth scroll ke target section dengan visual highlight
    document.querySelectorAll(".nav-jump-btn, a[href^='#']").forEach(link => {
        link.addEventListener("click", (e) => {
            const hash = link.getAttribute("href");
            if (hash && hash.startsWith("#") && hash.length > 1) {
                const target = document.querySelector(hash);
                if (target) {
                    e.preventDefault();
                    playRetroSFX('click');
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // Pulse border animation (Fase 6 section-arrival)
                    target.classList.remove('section-arrival');
                    void target.offsetWidth; // force reflow to restart animation
                    target.classList.add('section-arrival');
                    target.addEventListener('animationend', () => {
                        target.classList.remove('section-arrival');
                    }, { once: true });
                }
            }
        });
    });

    // 3. Tactile active feedback pada tombol saat disentuh di HP
    const touchElements = document.querySelectorAll('.brutal-btn, .timeline-tab, .quick-amt-btn, .sticker-choice-btn, .pengurus-filter-btn');
    touchElements.forEach(elem => {
        elem.addEventListener('touchstart', () => {
            elem.style.transform = 'translate(2px, 2px)';
            elem.style.boxShadow = '1px 1px 0px #000';
        }, { passive: true });
        elem.addEventListener('touchend', () => {
            elem.style.transform = '';
            elem.style.boxShadow = '';
        }, { passive: true });
        elem.addEventListener('touchcancel', () => {
            elem.style.transform = '';
            elem.style.boxShadow = '';
        }, { passive: true });
    });
}


// =========================================================================
// ✨ FASE 5 — SCROLL REVEAL, PARALLAX & TILT CARD ENGINE
// =========================================================================

function setupScrollAnimationsAndTilt() {

    // --- 1. INTERSECTION OBSERVER: Scroll Reveal ---
    // Setiap elemen .scroll-reveal muncul smooth saat masuk viewport
    const revealEls = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger delay berdasarkan posisi index dalam kontainer
                    const siblings = [...(entry.target.parentElement?.children || [])];
                    const siblingIndex = siblings.indexOf(entry.target);
                    const delay = Math.min(siblingIndex * 80, 320); // max 320ms stagger
                    setTimeout(() => {
                        entry.target.classList.add('in-view');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealEls.forEach(el => revealObserver.observe(el));

        // Juga observe .brutal-card yang belum punya .scroll-reveal tapi baru dimuat
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

        document.querySelectorAll('.brutal-card:not(.scroll-reveal)').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)';
            cardObserver.observe(card);
        });
    } else {
        // Fallback: langsung tampilkan semua jika tidak support IntersectionObserver
        revealEls.forEach(el => el.classList.add('in-view'));
    }


    // --- 2. PARALLAX SCROLLING ---
    // Layer background grid dan hero image bergerak di kecepatan berbeda
    let ticking = false;

    const heroCard = document.getElementById('feed-hero');
    const heroRadar = heroCard ? heroCard.querySelector('.hero-radar-grid') : null;
    const headerEl = document.querySelector('header');
    const tickerEl = document.querySelector('.marquee-wrapper');

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const y = window.scrollY;

                // Parallax: hero radar grid drifts sedikit ke bawah
                if (heroRadar) {
                    heroRadar.style.transform = `translateY(${y * 0.15}px)`;
                }

                // Parallax: hero image scale up sedikit di awal
                const heroImg = document.getElementById('hero-main-img');
                if (heroImg && heroCard) {
                    const heroOffset = heroCard.getBoundingClientRect().top + y;
                    const relY = y - heroOffset;
                    const pctFromTop = Math.max(0, Math.min(1, relY / (heroCard.offsetHeight * 1.5)));
                    heroImg.style.transform = `scale(${1 + pctFromTop * 0.06})`;
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });


    // --- 3. TILT CARD EFFECT (Desktop only) ---
    // Kartu miring sedikit sesuai posisi mouse — memberikan kedalaman 3D
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            const MAX_TILT = 4; // derajat max tilt

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);

                const tiltX = (-dy * MAX_TILT).toFixed(2);
                const tiltY = (dx * MAX_TILT).toFixed(2);

                card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }
}

