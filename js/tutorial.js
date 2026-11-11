// CosmicCadets Onboarding Guide - Simple Words, Zero Jargon
const Tutorial = (function() {
  let currentStep = 0;

  const STEPS = [
    {
      title: 'Welcome to Space Academy!',
      badge: 'rocket',
      iconHtml: () => Icons.avatars.astrofox(80),
      text: 'Welcome, Cadet! Train your astronaut skills with 6 fun space minigames. Shoot flying alien drones, clean up floating space trash, and earn stars!'
    },
    {
      title: '6 Daily Tasks Every Day',
      badge: 'calendar',
      iconHtml: () => Icons.star(true, 72),
      text: 'Every single day, 6 new levels unlock! Earn up to 3 Stars on each task (18 Stars total each day) to climb the Star Leaderboard!'
    },
    {
      title: 'Shoot & Clean Minigames',
      badge: 'blaster',
      iconHtml: () => `
        <div style="display:flex;gap:24px;justify-content:center;align-items:center;">
          <div style="text-align:center;">${Icons.blaster(48)}<div style="font-size:0.85rem;color:#4cc9f0;margin-top:4px;font-weight:700;">Laser Shoot</div></div>
          <div style="text-align:center;">${Icons.recycle(48)}<div style="font-size:0.85rem;color:#3ddc97;margin-top:4px;font-weight:700;">Space Trash</div></div>
        </div>
      `,
      text: '<b>Laser Shoot:</b> Tap anywhere on screen to blast flying targets with twin lasers!<br><br><b>Space Trash:</b> Drag trash into the chute, or pull down the big red lever to flush it all out into space!'
    },
    {
      title: 'Collect Stars & Climb Ranks',
      badge: 'trophy',
      iconHtml: () => Icons.trophy(72),
      text: 'Earn stars to rank up from Space Cadet all the way to Space Commander! Tap Leaderboard anytime to see your rank.'
    }
  ];

  function renderStep(idx, onFinish) {
    const s = STEPS[idx];
    const box = document.getElementById('tutorial-box');
    if (!box) return;

    box.innerHTML = `
      <div class="tut-header">
        <span class="tut-badge">${Icons[s.badge] ? Icons[s.badge](22) : Icons.star(true, 22)}</span>
        <h3>${s.title}</h3>
      </div>
      <div class="tut-media">${s.iconHtml()}</div>
      <p class="tut-desc">${s.text}</p>
      <div class="tut-dots">
        ${STEPS.map((_, i) => `<span class="tut-dot ${i === idx ? 'active' : ''}"></span>`).join('')}
      </div>
      <div class="row">
        ${idx > 0 ? `<button class="pad-btn" id="tut-prev">${Icons.arrowLeft(18)} Back</button>` : ''}
        <button class="go" id="tut-next">${idx === STEPS.length - 1 ? 'START PLAYING!' : 'Next ' + Icons.arrowRight(18)}</button>
      </div>
    `;

    const addTap = (el, fn) => {
      if (!el) return;
      if (window.addMobileTap) window.addMobileTap(el, fn);
      else el.onclick = fn;
    };

    const prevBtn = document.getElementById('tut-prev');
    if (prevBtn) {
      addTap(prevBtn, () => {
        Sound.click();
        currentStep = Math.max(0, currentStep - 1);
        renderStep(currentStep, onFinish);
      });
    }

    const nextBtn = document.getElementById('tut-next');
    if (nextBtn) {
      addTap(nextBtn, () => {
        Sound.click();
        if (currentStep < STEPS.length - 1) {
          currentStep++;
          renderStep(currentStep, onFinish);
        } else {
          Sound.win();
          closeModal();
          if (onFinish) onFinish();
        }
      });
    }
  }

  function showModal() {
    const ov = document.getElementById('tutorial-modal');
    if (ov) ov.hidden = false;
  }

  function closeModal() {
    const ov = document.getElementById('tutorial-modal');
    if (ov) ov.hidden = true;
  }

  return {
    start(onFinish) {
      currentStep = 0;
      showModal();
      renderStep(currentStep, onFinish);
    },
    close: closeModal
  };
})();
