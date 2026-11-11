// CosmicCadets SVG Icons System - 100% Vector, Zero Emojis
const Icons = (function() {
  const svg = (inner, size = 24, cls = '', viewBox = '0 0 24 24', extra = '') =>
    `<svg class="cc-icon ${cls}" width="${size}" height="${size}" viewBox="${viewBox}" fill="currentColor" aria-hidden="true" ${extra}>${inner}</svg>`;

  const strokeSvg = (inner, size = 24, cls = '', strokeWidth = 2, viewBox = '0 0 24 24') =>
    `<svg class="cc-icon ${cls}" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

  return {
    star(filled = true, size = 20, cls = '') {
      if (filled) {
        return svg(
          `<path d="M12 2l2.9 6.26L21.8 9.27l-5 4.87 1.18 6.88L12 17.77l-5.98 3.25 1.18-6.88-5-4.87 6.9-1.01L12 2z" fill="#ffd23f" stroke="#e6b800" stroke-width="1.2"/>`,
          size, `star-fill ${cls}`
        );
      }
      return svg(
        `<path d="M12 2l2.9 6.26L21.8 9.27l-5 4.87 1.18 6.88L12 17.77l-5.98 3.25 1.18-6.88-5-4.87 6.9-1.01L12 2z" fill="none" stroke="#606ea8" stroke-width="1.8"/>`,
        size, `star-empty ${cls}`
      );
    },

    stars(earned = 0, max = 3, size = 22) {
      let h = '<span class="star-group">';
      for (let i = 0; i < max; i++) {
        h += this.star(i < earned, size);
      }
      return h + '</span>';
    },

    heart(filled = true, size = 20, cls = '') {
      if (filled) {
        return svg(
          `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff5d6c"/>`,
          size, `heart-fill ${cls}`
        );
      }
      return svg(
        `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="#606ea8" stroke-width="2"/>`,
        size, `heart-empty ${cls}`
      );
    },

    hearts(lives = 3, max = 3, size = 20) {
      let h = '<span class="heart-group">';
      for (let i = 0; i < max; i++) {
        h += this.heart(i < lives, size);
      }
      return h + '</span>';
    },

    trophy(size = 24, cls = '') {
      return svg(
        `<path d="M6 3h12v4c0 3.31-2.69 6-6 6s-6-2.69-6-6V3z" fill="#ffd23f"/>
         <path d="M6 5H3c0 2.76 2.24 5 5 5h.5c-.9-1.2-1.5-2.6-1.5-4v-1zm12 0v1c0 1.4-.6 2.8-1.5 4H16c2.76 0 5-2.24 5-5h-3z" fill="#ffb703"/>
         <path d="M10 13v4H8v3h8v-3h-2v-4h-4z" fill="#e6b800"/>`,
        size, cls
      );
    },

    blaster(size = 24, cls = '') {
      return svg(
        `<path d="M4 14l5-2 1-5h4l1 3 5-1v4l-4 2-1 5h-4l-1-4-6-1v-2z" fill="#4cc9f0"/>
         <circle cx="17" cy="12" r="3" fill="#ffd23f"/>
         <path d="M2 13h4v4H2z" fill="#ff5d6c"/>
         <line x1="19" y1="12" x2="23" y2="12" stroke="#3ddc97" stroke-width="2" stroke-linecap="round"/>`,
        size, cls
      );
    },

    recycle(size = 24, cls = '') {
      return svg(
        `<path d="M12 2L9.5 6.5h3.5v5h2v-5h3.5L12 2z" fill="#3ddc97"/>
         <path d="M5 19l4 2.5-1.8-3.4 4.3-2.5-1-1.7-4.3 2.5-1.8-3.4L5 19z" fill="#4cc9f0"/>
         <path d="M19 19l-4.4-2.5 1.8-3.4-4.3-2.5 1-1.7 4.3 2.5 1.8-3.4L19 19z" fill="#ffd23f"/>`,
        size, cls
      );
    },

    gyro(size = 24, cls = '') {
      return svg(
        `<circle cx="12" cy="12" r="9" fill="none" stroke="#4cc9f0" stroke-width="2"/>
         <circle cx="12" cy="12" r="4" fill="none" stroke="#ffd23f" stroke-width="2"/>
         <circle cx="12" cy="12" r="2" fill="#fff"/>
         <line x1="12" y1="3" x2="12" y2="7" stroke="#3ddc97" stroke-width="3" stroke-linecap="round"/>
         <line x1="12" y1="12" x2="19" y2="8" stroke="#ff5d6c" stroke-width="2" stroke-linecap="round"/>`,
        size, cls
      );
    },

    rocket(size = 24, cls = '') {
      return svg(
        `<path d="M12 2.5C9 6 7 11 7 15l3 2v3l2-1 2 1v-3l3-2c0-4-2-9-5-12.5z" fill="#e8ecff"/>
         <circle cx="12" cy="11" r="2.5" fill="#4cc9f0"/>
         <path d="M7 15l-3 3 1 2 4-1-2-4zm10 0l3 3-1 2-4-1 2-4z" fill="#ff5d6c"/>
         <path d="M11 20l1 3 1-3z" fill="#ffd23f"/>`,
        size, cls
      );
    },

    meteor(size = 24, cls = '') {
      return svg(
        `<path d="M12 3l4 2 4 5-1 6-5 5-6-1-4-5 1-6 7-6z" fill="#9381ff"/>
         <circle cx="9" cy="9" r="1.8" fill="#5a49c9"/>
         <circle cx="15" cy="12" r="2.2" fill="#5a49c9"/>
         <circle cx="11" cy="16" r="1.5" fill="#5a49c9"/>
         <path d="M3 3l4 3M6 1l3 4" stroke="#ff9f1c" stroke-width="1.8" stroke-linecap="round"/>`,
        size, cls
      );
    },

    memory(size = 24, cls = '') {
      return svg(
        `<rect x="3" y="3" width="7" height="7" rx="2" fill="#ff5d6c"/>
         <rect x="14" y="3" width="7" height="7" rx="2" fill="#ffd23f"/>
         <rect x="3" y="14" width="7" height="7" rx="2" fill="#3ddc97"/>
         <rect x="14" y="14" width="7" height="7" rx="2" fill="#4cc9f0"/>
         <circle cx="6.5" cy="6.5" r="1.5" fill="#fff" opacity=".7"/>
         <circle cx="17.5" cy="6.5" r="1.5" fill="#fff" opacity=".7"/>
         <circle cx="6.5" cy="17.5" r="1.5" fill="#fff" opacity=".7"/>
         <circle cx="17.5" cy="17.5" r="1.5" fill="#fff" opacity=".7"/>`,
        size, cls
      );
    },

    sound(on = true, size = 20, cls = '') {
      if (on) {
        return strokeSvg(
          `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
           <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
           <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`,
          size, cls
        );
      }
      return strokeSvg(
        `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
         <line x1="23" y1="9" x2="17" y2="15"/>
         <line x1="17" y1="9" x2="23" y2="15"/>`,
        size, cls
      );
    },

    music(on = true, size = 20, cls = '') {
      if (on) {
        return strokeSvg(
          `<path d="M9 18V5l12-2v13"/>
           <circle cx="6" cy="18" r="3" fill="currentColor"/>
           <circle cx="18" cy="16" r="3" fill="currentColor"/>`,
          size, cls
        );
      }
      return strokeSvg(
        `<path d="M9 18V5l12-2v13"/>
         <circle cx="6" cy="18" r="3" fill="currentColor"/>
         <circle cx="18" cy="16" r="3" fill="currentColor"/>
         <line x1="2" y1="2" x2="22" y2="22" stroke="#ff5d6c"/>`,
        size, cls
      );
    },

    shield(size = 24, cls = '') {
      return svg(
        `<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#4cc9f0"/>
         <path d="M12 4.18V20c3.63-.98 6-4.8 6-8.91V6.3l-6-2.12z" fill="#3ddc97" opacity=".7"/>`,
        size, cls
      );
    },

    zap(size = 24, cls = '') {
      return svg(
        `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#ffd23f"/>`,
        size, cls
      );
    },

    clock(size = 20, cls = '') {
      return strokeSvg(
        `<circle cx="12" cy="12" r="9"/>
         <polyline points="12 7 12 12 15 14"/>`,
        size, cls
      );
    },

    check(size = 20, cls = '') {
      return strokeSvg(
        `<polyline points="20 6 9 17 4 12"/>`,
        size, cls, 3
      );
    },

    cross(size = 20, cls = '') {
      return strokeSvg(
        `<line x1="18" y1="6" x2="6" y2="18"/>
         <line x1="6" y1="6" x2="18" y2="18"/>`,
        size, cls, 3
      );
    },

    arrowLeft(size = 20, cls = '') {
      return strokeSvg(
        `<line x1="19" y1="12" x2="5" y2="12"/>
         <polyline points="12 19 5 12 12 5"/>`,
        size, cls, 2.5
      );
    },

    arrowRight(size = 20, cls = '') {
      return strokeSvg(
        `<line x1="5" y1="12" x2="19" y2="12"/>
         <polyline points="12 5 19 12 12 19"/>`,
        size, cls, 2.5
      );
    },

    refresh(size = 20, cls = '') {
      return strokeSvg(
        `<polyline points="23 4 23 10 17 10"/>
         <polyline points="1 20 1 14 7 14"/>
         <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>`,
        size, cls, 2.2
      );
    },

    user(size = 20, cls = '') {
      return strokeSvg(
        `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
         <circle cx="12" cy="7" r="4"/>`,
        size, cls
      );
    },

    lock(size = 20, cls = '') {
      return strokeSvg(
        `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
         <path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
        size, cls
      );
    },

    book(size = 20, cls = '') {
      return strokeSvg(
        `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
         <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`,
        size, cls
      );
    },

    calendar(size = 20, cls = '') {
      return strokeSvg(
        `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
         <line x1="16" y1="2" x2="16" y2="6"/>
         <line x1="8" y1="2" x2="8" y2="6"/>
         <line x1="3" y1="10" x2="21" y2="10"/>`,
        size, cls
      );
    },

    crown(size = 24, cls = '') {
      return svg(
        `<polygon points="2 7 6 18 18 18 22 7 15 12 12 3 9 12 2 7" fill="#ffd23f" stroke="#e6b800" stroke-width="1.2"/>
         <circle cx="12" cy="3" r="1.5" fill="#ff5d6c"/>
         <circle cx="2" cy="7" r="1.5" fill="#4cc9f0"/>
         <circle cx="22" cy="7" r="1.5" fill="#4cc9f0"/>`,
        size, cls
      );
    },

    flame(size = 24, cls = '') {
      return svg(
        `<path d="M12 2c-.5 3-3 5-3 8 0 3.3 2.7 6 6 6s6-2.7 6-6c0-3.5-3-5.5-3.5-8-.8 2.2-2.5 3-2.5 5 0 1.7-1.3 3-3 3s-3-1.3-3-3c0-1.8 1.5-3.2 2-5z" fill="#ff7a3d"/>
         <path d="M12 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0-1.5-1.5-2.5-2-4-.5 1-1.5 1.5-1.5 2.5 0 .8-.7 1.5-1.5 1.5z" fill="#ffd23f"/>`,
        size, cls
      );
    },

    gem(size = 24, cls = '') {
      return svg(
        `<polygon points="6 3 18 3 22 9 12 22 2 9 6 3" fill="#4cc9f0"/>
         <polygon points="12 22 7 9 17 9 12 22" fill="#70e000" opacity=".6"/>
         <polygon points="6 3 9 9 15 9 18 3 6 3" fill="#fff" opacity=".5"/>`,
        size, cls
      );
    },

    target(size = 24, cls = '') {
      return strokeSvg(
        `<circle cx="12" cy="12" r="9"/>
         <circle cx="12" cy="12" r="5"/>
         <line x1="12" y1="2" x2="12" y2="5"/>
         <line x1="12" y1="19" x2="12" y2="22"/>
         <line x1="2" y1="12" x2="5" y2="12"/>
         <line x1="19" y1="12" x2="22" y2="12"/>`,
        size, cls
      );
    },

    badges: {
      firstFlight(size = 32) {
        return `<span class="badge-icon badge-bronze" title="First Flight">${Icons.rocket(size)}</span>`;
      },
      starCollector(size = 32) {
        return `<span class="badge-icon badge-gold" title="Star Collector">${Icons.star(true, size)}</span>`;
      },
      perfectPilot(size = 32) {
        return `<span class="badge-icon badge-cyan" title="Perfect Pilot">${Icons.gem(size)}</span>`;
      },
      commander(size = 32) {
        return `<span class="badge-icon badge-royal" title="Space Commander">${Icons.crown(size)}</span>`;
      },
      veteran(size = 32) {
        return `<span class="badge-icon badge-flame" title="Veteran Pilot">${Icons.flame(size)}</span>`;
      },
      sharpshooter(size = 32) {
        return `<span class="badge-icon badge-red" title="Ace Blaster">${Icons.blaster(size)}</span>`;
      },
      ecoHero(size = 32) {
        return `<span class="badge-icon badge-green" title="Cosmic Eco-Hero">${Icons.recycle(size)}</span>`;
      },
      dailyMaster(size = 32) {
        return `<span class="badge-icon badge-gold" title="Daily Mission Master">${Icons.trophy(size)}</span>`;
      }
    },

    avatars: {
      astrofox(size = 48) {
        return `<svg class="cadet-avatar" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#252c6a" stroke="#ff9f1c" stroke-width="3"/>
          <polygon points="14 18 24 10 26 22" fill="#ff7a3d"/>
          <polygon points="50 18 40 10 38 22" fill="#ff7a3d"/>
          <circle cx="32" cy="34" r="20" fill="#fff"/>
          <ellipse cx="32" cy="34" rx="16" ry="11" fill="#1b1650"/>
          <path d="M22 34q10-4 20 0" stroke="#4cc9f0" stroke-width="3" stroke-linecap="round"/>
          <circle cx="32" cy="46" r="3" fill="#ff7a3d"/>
        </svg>`;
      },
      robocadet(size = 48) {
        return `<svg class="cadet-avatar" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#1b2554" stroke="#4cc9f0" stroke-width="3"/>
          <line x1="32" y1="8" x2="32" y2="16" stroke="#4cc9f0" stroke-width="3"/>
          <circle cx="32" cy="7" r="4" fill="#ffd23f"/>
          <rect x="18" y="18" width="28" height="26" rx="8" fill="#e8ecff"/>
          <rect x="22" y="24" width="20" height="10" rx="4" fill="#0b1033"/>
          <circle cx="27" cy="29" r="2.5" fill="#4cc9f0"/>
          <circle cx="37" cy="29" r="2.5" fill="#4cc9f0"/>
          <line x1="26" y1="38" x2="38" y2="38" stroke="#3ddc97" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
      },
      starace(size = 48) {
        return `<svg class="cadet-avatar" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#201a5e" stroke="#ffd23f" stroke-width="3"/>
          <circle cx="32" cy="32" r="22" fill="#f0f3ff"/>
          <ellipse cx="32" cy="32" rx="16" ry="12" fill="#ffd23f"/>
          <path d="M20 31q12-6 24 0" stroke="#ff7a3d" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="26" cy="27" r="2" fill="#fff"/>
          <path d="M30 11l2-4 2 4z" fill="#ff5d6c"/>
        </svg>`;
      },
      novacat(size = 48) {
        return `<svg class="cadet-avatar" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#291a45" stroke="#b5179e" stroke-width="3"/>
          <polygon points="16 16 26 12 24 24" fill="#7209b7"/>
          <polygon points="48 16 38 12 40 24" fill="#7209b7"/>
          <circle cx="32" cy="34" r="20" fill="#f72585"/>
          <ellipse cx="32" cy="34" rx="15" ry="10" fill="#14092b"/>
          <ellipse cx="27" cy="34" rx="3" ry="5" fill="#4cc9f0"/>
          <ellipse cx="37" cy="34" rx="3" ry="5" fill="#4cc9f0"/>
          <circle cx="32" cy="42" r="2" fill="#ff70a6"/>
        </svg>`;
      },
      cyberfalcon(size = 48) {
        return `<svg class="cadet-avatar" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#0d2137" stroke="#3ddc97" stroke-width="3"/>
          <circle cx="32" cy="32" r="22" fill="#1b4965"/>
          <polygon points="32 18 20 28 44 28" fill="#62b6cb"/>
          <polygon points="32 32 26 44 38 44" fill="#ffd23f"/>
          <circle cx="26" cy="28" r="2.5" fill="#3ddc97"/>
          <circle cx="38" cy="28" r="2.5" fill="#3ddc97"/>
        </svg>`;
      },
      galaxypup(size = 48) {
        return `<svg class="cadet-avatar" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#1b2a47" stroke="#4cc9f0" stroke-width="3"/>
          <ellipse cx="16" cy="24" rx="6" ry="10" fill="#3a506b" transform="rotate(-15 16 24)"/>
          <ellipse cx="48" cy="24" rx="6" ry="10" fill="#3a506b" transform="rotate(15 48 24)"/>
          <circle cx="32" cy="34" r="20" fill="#5bc0be"/>
          <ellipse cx="32" cy="35" rx="14" ry="10" fill="#0b132b"/>
          <circle cx="27" cy="34" r="3" fill="#fff"/>
          <circle cx="37" cy="34" r="3" fill="#fff"/>
          <ellipse cx="32" cy="42" rx="3.5" ry="2" fill="#1c2541"/>
        </svg>`;
      }
    },

    getAvatar(id, size = 48) {
      const fn = this.avatars[id] || this.avatars.astrofox;
      return fn(size);
    }
  };
})();
