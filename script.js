/* ============================================
   DING ZIYAN PORTFOLIO — INTERACTIONS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 自定义光标 ---------- */
  if (isFine && !reduce) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * .35; ry += (my - ry) * .35;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a,button,.tin-card,.env-seal').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
    document.querySelectorAll('[data-zoom]').forEach((el) => {
      el.addEventListener('mouseenter', () => { ring.classList.add('hover'); ring.querySelector('span').textContent = 'VIEW'; });
      el.addEventListener('mouseleave', () => { ring.classList.remove('hover'); ring.querySelector('span').textContent = 'VIEW'; });
    });
  }

  /* ---------- 2. 滚动进度 + 导航状态 ---------- */
  const bar = document.querySelector('.scroll-progress');
  const nav = document.getElementById('nav');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = `${(scrollY / max) * 100}%`;
    nav.classList.toggle('scrolled', scrollY > 40);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. 导航平滑滚动 + 高亮 ---------- */
  const sections = ['top', 'works', 'featured', 'about', 'contact'].map(id => document.getElementById(id));
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const t = document.getElementById(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.nav-link[href="#${en.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: .45 });
    sections.forEach(s => s && navIO.observe(s));
  }

  /* ---------- 4. 滚动揭示 ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          en.target.style.transitionDelay = `${(i % 3) * .09}s`;
          en.target.classList.add('in');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- 5. 数字计数 ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    const cIO = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = +el.dataset.count;
        let cur = 0;
        const step = Math.max(1, Math.round(target / 30));
        const tick = setInterval(() => {
          cur += step;
          if (cur >= target) { el.textContent = target; clearInterval(tick); }
          else el.textContent = cur;
        }, 28);
        obs.unobserve(el);
      });
    }, { threshold: .6 });
    counters.forEach(c => cIO.observe(c));
  }

  /* ---------- 6. 信封打开 ---------- */
  const envWrap = document.getElementById('envelope');
  const seal = document.getElementById('envSeal');
  if (envWrap && seal) {
    seal.addEventListener('click', () => envWrap.classList.toggle('open'));
  }
  /* 首页装饰视差 */
  if (isFine && !reduce) {
    const decos = document.querySelectorAll('.env-deco');
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const nx = (e.clientX / innerWidth - .5) * 2;
      const ny = (e.clientY / innerHeight - .5) * 2;
      decos.forEach((d) => {
        const depth = parseFloat(d.dataset.depth) * 100;
        d.style.translate = `${nx * depth}px ${ny * depth}px`;
      });
    });
  }

  /* ---------- 7. 铁盒：点盖子下滑消失 -> 点盒内图片放大 ---------- */
  document.querySelectorAll('.tin-card').forEach((card) => {
    const tin = card.querySelector('.tin');
    const lid = card.querySelector('.tin-lid');
    const img = card.querySelector('.tin-inside img');

    // 点盖子：打开盒子（盖子下滑消失，露出图片）
    lid.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!card.classList.contains('open')) card.classList.add('open');
    });

    // 打开后点盒内图片：弹出大图
    if (img) {
      img.addEventListener('click', (e) => {
        if (!card.classList.contains('open')) return;
        e.stopPropagation();
        const idx = zoomList.indexOf(img);
        if (idx >= 0) openLB(idx);
      });
    }

    // 轻微 hover 倾斜（保留手感，不影响外形）
    if (isFine && !reduce) {
      card.addEventListener('mousemove', (e) => {
        const r = tin.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - .5;
        const ny = (e.clientY - r.top) / r.height - .5;
        tin.style.transform = `rotateY(${nx * 5}deg) rotateX(${-ny * 5}deg)`;
      });
      card.addEventListener('mouseleave', () => { tin.style.transform = ''; });
    }
  });

  /* ---------- 8. 特写标签切换 ---------- */
  const tabData = {
    camp: {
      tag: '[ branding / redesign ]', title: '野趣露营',
      lead: '一个关于户外与自由的视觉企划。',
      text: '从海报到周边，把露营的松弛感装进一套统一的视觉语言里。柔和的色调与手作质感，让每一次放大都像在翻一本旅行笔记。',
      soft: 'Adobe Illustrator<br>Adobe Photoshop', num: '01 / 03',
      imgs: ['assets/poster-camp-1.jpg', 'assets/poster-camp-2.jpg', 'assets/poster-camp-3.jpg'],
      alts: ['露营海报一', '露营海报二', '露营海报三']
    },
    ip: {
      tag: '[ character / 3d ]', title: '小蓝 IP 形象',
      lead: '从平面到立体的一只圆滚滚。',
      text: '从草稿到 3D 三视图，再把它放进四季场景里。一个可以被捏来捏去、陪人过日子的 IP 形象，头顶那根吸管是它的小天线。',
      soft: 'Adobe Illustrator<br>Adobe After Effects', num: '02 / 03',
      imgs: ['assets/ip-poster.jpg', 'assets/ip-3d-model.png', 'assets/ip-3d-cylinder.png'],
      alts: ['IP 海报', 'IP 3D 模型', 'IP 三视图']
    },
    board: {
      tag: '[ information / exhibition ]', title: '信息可视化展板',
      lead: '把复杂资料压缩进一张海报。',
      text: '苏州博物馆的空间导视与调研分析，以及「齐天流韵」的神话谱系信息图解。在严谨的信息层级里，寻找视觉的节奏与呼吸。',
      soft: 'Adobe InDesign<br>Adobe Illustrator', num: '03 / 03',
      imgs: ['assets/board-suzhou-1.png', 'assets/board-suzhou-2.png', 'assets/board-qitian.png'],
      alts: ['苏州博物馆展板一', '苏州博物馆展板二', '齐天流韵展板']
    }
  };

  const ftabs = document.querySelectorAll('.ftab');
  const dossierBody = document.getElementById('dossierBody');
  const trayGrid = document.getElementById('trayGrid');
  ftabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      ftabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const d = tabData[tab.dataset.tab];
      document.getElementById('dTag').textContent = d.tag;
      document.getElementById('dTitle').textContent = d.title;
      document.getElementById('dLead').textContent = d.lead;
      dossierBody.querySelector('p:not(.tag-line):not(.d-lead)').textContent = d.text;
      document.getElementById('dSoft').innerHTML = d.soft;
      document.getElementById('dNum').textContent = d.num;
      trayGrid.innerHTML = d.imgs.map((src, i) =>
        `<figure class="tray-shot${i === 0 ? ' big' : ''}" data-zoom><img src="${src}" alt="${d.alts[i]}" loading="lazy"></figure>`
      ).join('');
      dossierBody.classList.remove('fade-swap'); void dossierBody.offsetWidth; dossierBody.classList.add('fade-swap');
      trayGrid.classList.remove('fade-swap'); void trayGrid.offsetWidth; trayGrid.classList.add('fade-swap');
      bindZoom();
    });
  });

  /* ---------- 9. 磁吸按钮 ---------- */
  if (isFine && !reduce) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const nx = e.clientX - (r.left + r.width / 2);
        const ny = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${nx * .22}px, ${ny * .22}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 10. 灯箱 ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('.lb-figure img');
  const lbCap = lightbox.querySelector('.lb-figure figcaption');
  let zoomList = [], zoomIndex = 0;

  // 取图片元素：data-zoom 可能标在 img 本身，也可能标在包裹容器上
  function getZoomImg(el) {
    if (!el) return null;
    return el.tagName === 'IMG' ? el : el.querySelector('img');
  }
  function fillLB(i) {
    if (!zoomList.length) return;
    zoomIndex = (i + zoomList.length) % zoomList.length;
    const img = getZoomImg(zoomList[zoomIndex]);
    if (!img) return;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = img.alt || '';
  }
  function bindZoom() {
    zoomList = Array.from(document.querySelectorAll('[data-zoom]'));
    zoomList.forEach((el, i) => {
      el.onclick = (e) => { e.stopPropagation(); openLB(i); };
    });
  }
  function openLB(i) {
    if (!zoomList.length) return;
    fillLB(i);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
  }
  function closeLB() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
  }
  function step(dir) {
    if (!zoomList.length) return;
    fillLB(zoomIndex + dir);
  }
  bindZoom();
  lightbox.querySelector('.lb-close').addEventListener('click', closeLB);
  lightbox.querySelector('.lb-prev').addEventListener('click', () => step(-1));
  lightbox.querySelector('.lb-next').addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

});
