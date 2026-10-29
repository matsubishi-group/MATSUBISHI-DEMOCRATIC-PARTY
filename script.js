(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'メニューを開く');
    }));
  }



  // Filter the editorial desk by topic while keeping the article text accessible.
  const newsFilters = [...document.querySelectorAll('[data-news-filter]')];
  const newsCards = [...document.querySelectorAll('[data-news-category]')];
  const newsCount = document.getElementById('news-result-count');
  newsFilters.forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.newsFilter;
      newsFilters.forEach(filter => {
        const active = filter === button;
        filter.classList.toggle('is-selected', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      let visible = 0;
      newsCards.forEach(card => {
        const show = selected === 'all' || card.dataset.newsCategory === selected;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (newsCount) newsCount.textContent = `${visible}件の記事`;
    });
  });

  // Full-width photographic hero slider: each message uses its own matching photo.
  const slides = [
    {title:'国民の生活を、<br><em>第一に。</em>', lead:'一人ひとりの暮らしを支え、安心できる社会へ。', caption:'暮らしに寄り添う政治を', photo:0, background:'assets/hero-family-care.webp', position:'center center'},
    {title:'誰もが安心できる、<br><em>医療と福祉へ。</em>', lead:'必要なときに、安心して医療を受けられる社会へ。', caption:'地域に根ざした医療と福祉', photo:1, background:'assets/hero-healthcare.webp', position:'center center'},
    {title:'地域の暮らしを、<br><em>元気に。</em>', lead:'地域のお店や働く人を支え、まちの活力を育てます。', caption:'地域とともに、未来へ進む', photo:2, background:'assets/hero-community-shop.webp', position:'center center'}
  ];
  const heroTitle = document.getElementById('hero-title');
  const heroLead = document.getElementById('hero-lead');
  const caption = document.getElementById('hero-caption');
  const heroNumber = document.querySelector('.hero-number');
  const heroPaginationDots = [...document.querySelectorAll('[data-hero-page]')];
  const photoEls = [...document.querySelectorAll('[data-slide-photo]')];
  const heroBackground = document.querySelector('.hero-background-slide');
  
  let currentSlide = 0;
  let timer = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroTextEls = [heroTitle, heroLead, caption].filter(Boolean);
  if (!reduceMotion) heroTextEls.forEach(el => el.classList.add('hero-text-fade'));
  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    const s = slides[currentSlide];
    if (heroBackground) {
      heroBackground.classList.add('is-changing');
      window.setTimeout(() => {
        heroBackground.style.backgroundImage = `linear-gradient(90deg, rgba(5,18,38,.76) 0%, rgba(5,22,45,.42) 52%, rgba(5,22,45,.12) 100%), url('${s.background}')`;
        heroBackground.style.backgroundPosition = 'center center';
        requestAnimationFrame(() => heroBackground.classList.remove('is-changing'));
      }, reduceMotion ? 0 : 450);
    }
    if (reduceMotion) {
      if (heroTitle) heroTitle.classList.toggle('is-medical-slide', currentSlide === 1);
      heroTitle.innerHTML = s.title;
      heroLead.textContent = s.lead;
      caption.textContent = s.caption;
    } else {
      heroTextEls.forEach(el => el.classList.add('is-fading-out'));
      window.setTimeout(() => {
        if (heroTitle) heroTitle.classList.toggle('is-medical-slide', currentSlide === 1);
        heroTitle.innerHTML = s.title;
        heroLead.textContent = s.lead;
        caption.textContent = s.caption;
        requestAnimationFrame(() => heroTextEls.forEach(el => el.classList.remove('is-fading-out')));
      }, 650);
    }
    if (heroNumber) heroNumber.innerHTML = `0${currentSlide + 1} <span>/ 03</span>`;
    heroPaginationDots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentSlide;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
    photoEls.forEach(el => {
      const n = Number(el.dataset.slidePhoto);
      const active = n === s.photo;
      el.classList.toggle('is-front', active);
      if (n === 0) el.style.opacity = currentSlide === 0 ? '1' : '.88';
      if (n === 1) el.style.opacity = currentSlide === 1 ? '1' : '.76';
      if (n === 2) el.style.opacity = currentSlide === 2 ? '1' : '.78';
    });
  };
  if (heroBackground) {
    heroBackground.style.backgroundImage = `linear-gradient(90deg, rgba(5,18,38,.72) 0%, rgba(5,22,45,.38) 48%, rgba(5,22,45,.08) 100%), url('${slides[0].background}')`;
  }
  const startHeroTimer = () => {
    if (timer) window.clearInterval(timer);
    if (!reduceMotion) timer = window.setInterval(() => showSlide(currentSlide + 1), 3000);
  };
  heroPaginationDots.forEach(dot => dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.heroPage));
    startHeroTimer();
  }));
  document.querySelector('.hero-slider-prev')?.addEventListener('click', () => { showSlide(currentSlide - 1); startHeroTimer(); });
  document.querySelector('.hero-slider-next')?.addEventListener('click', () => { showSlide(currentSlide + 1); startHeroTimer(); });
  startHeroTimer();

  const sections = [...document.querySelectorAll('main section[id], main section#top')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
      });
    }, {rootMargin:'-32% 0px -58% 0px', threshold:0});
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();