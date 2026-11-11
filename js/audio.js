// CosmicCadets Web Audio Synthesizer - Zero External Assets
const Sound = (function() {
  let ctx = null;
  let sfxMuted = false;
  let musicMuted = false;
  let musicTimer = null;
  let musicStep = 0;

  function getCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  return {
    init() {
      const unlock = () => {
        getCtx();
        if (!musicMuted && !musicTimer) Sound.startMusic();
      };
      ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
        window.addEventListener(ev, unlock, { once: true })
      );
    },

    setSfxMuted(m) { sfxMuted = m; },
    setMusicMuted(m) {
      musicMuted = m;
      if (musicMuted) Sound.stopMusic();
      else Sound.startMusic();
    },
    isSfxMuted() { return sfxMuted; },
    isMusicMuted() { return musicMuted; },

    click() {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ac.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.04);
    },

    hit() {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ac.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.08);
    },

    laser() {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ac.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.12);
    },

    explosion(big = false) {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const bufferSize = ac.sampleRate * (big ? 0.4 : 0.22);
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = ac.createBufferSource();
      noise.buffer = buffer;
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(big ? 600 : 900, ac.currentTime);
      filter.frequency.exponentialRampToValueAtTime(60, ac.currentTime + (big ? 0.38 : 0.2));
      const gain = ac.createGain();
      gain.gain.setValueAtTime(big ? 0.25 : 0.14, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (big ? 0.4 : 0.22));
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      noise.start();
    },

    star() {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const now = ac.currentTime;
      [880, 1318].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.1, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    },

    vacuum() {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ac.currentTime);
      osc.frequency.linearRampToValueAtTime(320, ac.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ac.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.1);
    },

    deposit() {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const now = ac.currentTime;
      [523, 659, 784, 1046].forEach((f, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.07);
        gain.gain.setValueAtTime(0.12, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.25);
      });
    },

    powerup() {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const now = ac.currentTime;
      [440, 554, 659, 880, 1108].forEach((f, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, now + i * 0.05);
        gain.gain.setValueAtTime(0.06, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.18);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.18);
      });
    },

    combo(mult = 2) {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const baseFreq = 400 + Math.min(mult, 8) * 80;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ac.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.18);
    },

    damage() {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ac.currentTime + 0.26);
      gain.gain.setValueAtTime(0.15, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.26);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.26);
    },

    win() {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const notes = [523, 659, 784, 1046];
      const now = ac.currentTime;
      notes.forEach((f, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.1);
        gain.gain.setValueAtTime(0.14, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    },

    rankUp() {
      if (sfxMuted) return;
      const ac = getCtx(); if (!ac) return;
      const notes = [440, 554, 659, 880, 1108, 1318];
      const now = ac.currentTime;
      notes.forEach((f, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    },

    // Background synth music loops cleanly
    startMusic() {
      if (musicMuted || musicTimer) return;
      const bassNotes = [110, 110, 130, 98];
      const leadArp = [
        [220, 262, 330, 392],
        [220, 262, 330, 440],
        [262, 330, 392, 523],
        [196, 247, 294, 392]
      ];

      musicTimer = setInterval(() => {
        if (musicMuted) return;
        const ac = getCtx(); if (!ac) return;
        const bar = Math.floor(musicStep / 8) % 4;
        const beat = musicStep % 8;

        // Bassline on quarter beats
        if (beat % 4 === 0) {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(bassNotes[bar], ac.currentTime);
          gain.gain.setValueAtTime(0.04, ac.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start();
          osc.stop(ac.currentTime + 0.35);
        }

        // Arp voice
        const oscLead = ac.createOscillator();
        const gainLead = ac.createGain();
        oscLead.type = 'square';
        const note = leadArp[bar][beat % 4] * (beat > 3 ? 2 : 1);
        oscLead.frequency.setValueAtTime(note, ac.currentTime);
        gainLead.gain.setValueAtTime(0.012, ac.currentTime);
        gainLead.gain.exponentialRampToValueAtTime(0.0005, ac.currentTime + 0.16);
        oscLead.connect(gainLead);
        gainLead.connect(ac.destination);
        oscLead.start();
        oscLead.stop(ac.currentTime + 0.16);

        musicStep++;
      }, 260);
    },

    stopMusic() {
      if (musicTimer) {
        clearInterval(musicTimer);
        musicTimer = null;
      }
    }
  };
})();
