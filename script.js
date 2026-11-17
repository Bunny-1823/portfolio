/* ============================================
   ZINE PORTFOLIO — 交互
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 移动端菜单（小屏隐藏导航时，点击 logo 展开简易列表） ---------- */
  const nav = document.querySelector('.nav');
  const logo = document.querySelector('.nav-logo');
  const links = document.querySelector('.nav-links');
  if (nav && logo && links && window.matchMedia('(max-width: 640px)').matches) {
    logo.setAttribute('title', '点击展开导航');
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.position = 'absolute';
      links.style.top = '72px';
      links.style.left = '0';
      links.style.width = '100%';
      links.style.flexDirection = 'column';
      links.style.gap = '0';
      links.style.background = 'var(--paper)';
      links.style.borderBottom = '2px solid var(--deep)';
      links.style.padding = '10px 20px';
      links.querySelectorAll('a').forEach((a) => {
        a.style.padding = '10px 0';
        a.style.borderBottom = '1px dashed rgba(45,45,68,0.3)';
      });
    });
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { links.style.display = 'none'; }));
  }

  /* ---------- 平滑滚动 ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ---------- 翻杂志质感：滚动时卡片缓慢切换 ---------- */
  const flips = document.querySelectorAll('.page-flip');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    flips.forEach((el) => io.observe(el));
  } else {
    flips.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- 指纹纹理鼠标视差（桌面端） ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const bands = document.querySelectorAll('[data-parallax]');
    let raf = null;
    window.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        bands.forEach((band, i) => {
          const track = band.querySelector('.fingerprint-track');
          if (!track) return;
          const dir = i % 2 === 0 ? 1 : -1;
          track.style.setProperty('--fp-x', `${(nx * 18 * dir).toFixed(1)}px`);
          track.style.setProperty('--fp-y', `${(ny * 8 * dir).toFixed(1)}px`);
        });
        raf = null;
      });
    }, { passive: true });
  }

  /* ---------- 橡皮泥图标按压效果 ---------- */
  document.querySelectorAll('.clay-icon').forEach((icon) => {
    const press = () => icon.classList.add('pressed');
    const release = () => icon.classList.remove('pressed');
    icon.addEventListener('mousedown', press);
    icon.addEventListener('mouseup', release);
    icon.addEventListener('mouseleave', release);
    icon.addEventListener('touchstart', press, { passive: true });
    icon.addEventListener('touchend', release);
    icon.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press(); } });
    icon.addEventListener('keyup', release);
  });

  /* ---------- IG 图标点赞切换 ---------- */
  const heart = document.querySelector('.ig-icon.heart');
  if (heart) {
    heart.addEventListener('click', () => {
      const liked = heart.classList.toggle('liked');
      heart.textContent = liked ? '♥' : '♡';
      heart.style.transform = liked ? 'scale(1.35)' : 'scale(1)';
      setTimeout(() => { heart.style.transform = ''; }, 180);
    });
  }

  /* ---------- 图片灯箱：点击放大 / 左右切换 / ESC 关闭 ---------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('.lb-figure img');
    const lbCap = lightbox.querySelector('.lb-figure figcaption');
    const lbClose = lightbox.querySelector('.lb-close');
    const lbPrev = lightbox.querySelector('.lb-prev');
    const lbNext = lightbox.querySelector('.lb-next');
    const zoomables = Array.from(
      document.querySelectorAll('.shot[data-caption], .poster-inner[data-caption], .ig-image[data-caption]')
    );
    let lbIndex = 0;

    const showImage = (i) => {
      if (!zoomables.length) return;
      lbIndex = (i + zoomables.length) % zoomables.length;
      const el = zoomables[lbIndex];
      const img = el.querySelector('img');
      lbImg.src = img ? img.src : '';
      lbImg.alt = img ? img.alt : '';
      lbCap.textContent = el.dataset.caption || '';
    };
    const openLB = (i) => {
      showImage(i);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lb-open');
      lbClose.focus();
    };
    const closeLB = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lb-open');
    };

    zoomables.forEach((el, i) => el.addEventListener('click', () => openLB(i)));
    lbClose.addEventListener('click', closeLB);
    lbPrev.addEventListener('click', () => showImage(lbIndex - 1));
    lbNext.addEventListener('click', () => showImage(lbIndex + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') showImage(lbIndex - 1);
      if (e.key === 'ArrowRight') showImage(lbIndex + 1);
    });
  }

});
