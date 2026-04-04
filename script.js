document.addEventListener('DOMContentLoaded', () => {

  // ===== 滾動淡入 =====
  const fadeTargets = [
    '.about-text-col',
    '.book-preview',
    '.p-stage',
    '.peek-card',
    '.phase',
    '.diary-entry',
    '.author-box',
    '.sub-box',
    '.pull-quote',
    '.meta-item',
    '.quote-content',
    '.toc-item'
  ];

  fadeTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('fade-up');
      el.style.transitionDelay = `${Math.min(i * 0.07, 0.4)}s`;
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

  // ===== NAV 隱藏/顯示 =====
  let lastY = 0;
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 100) {
      nav.classList.toggle('hidden', y > lastY);
    } else {
      nav.classList.remove('hidden');
    }
    lastY = y;
  }, { passive: true });

  // ===== 進度條動畫 =====
  const bar = document.querySelector('.progress-bar-fill');
  if (bar) {
    const targetWidth = bar.dataset.width || '28';
    bar.style.width = '0%';
    const barObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => { bar.style.width = targetWidth + '%'; }, 300);
        barObs.unobserve(bar);
      }
    }, { threshold: 0.3 });
    barObs.observe(bar);
  }

  // ===== 搶先看 Modal =====
  document.querySelectorAll('.peek-card.openable').forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    // Close on X button
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    // Close on overlay click (not modal itself)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  // ===== 鎖定卡片提示 =====
  document.querySelectorAll('.peek-card.locked').forEach(card => {
    card.addEventListener('click', () => {
      let tip = card.querySelector('.lock-tip');
      if (!tip) {
        tip = document.createElement('div');
        tip.className = 'lock-tip';
        tip.textContent = '這個章節還在醞釀中，再等等唷';
        Object.assign(tip.style, {
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(46,31,20,0.9)',
          color: '#F5EDE0',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '0.82rem',
          whiteSpace: 'nowrap',
          opacity: '0',
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
          zIndex: '10',
          fontFamily: 'var(--ff-serif)'
        });
        card.style.position = 'relative';
        card.appendChild(tip);
      }
      tip.style.opacity = '1';
      setTimeout(() => { tip.style.opacity = '0'; }, 2200);
    });
  });

  // ===== 插畫橫幅無限滾動 =====
  const strip = document.querySelector('.strip-scroll');
  if (strip) {
    // 複製內容以實現無縫循環
    const clone = strip.innerHTML;
    strip.innerHTML += clone;
  }

  // ===== Smooth scroll for nav links =====
  document.querySelectorAll('.nav-links a, .hero-cta').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});

// ===== 訂閱 =====
function handleSubscribe(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input');
  const btn = form.querySelector('button');
  const email = input.value;

  btn.textContent = '收到了！';
  btn.style.background = '#8FA878';
  input.value = '';
  input.placeholder = '謝謝你願意等這本書';
  input.disabled = true;
  btn.disabled = true;

  const list = JSON.parse(localStorage.getItem('xiaowanlong_subs') || '[]');
  list.push({ email, date: new Date().toISOString() });
  localStorage.setItem('xiaowanlong_subs', JSON.stringify(list));

  setTimeout(() => { btn.textContent = '已訂閱'; }, 1500);
}
