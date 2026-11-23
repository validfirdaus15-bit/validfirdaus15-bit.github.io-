(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Navbar */
  var nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  });
  $$('a', menu).forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
  window.addEventListener('scroll', function () {
    nav.classList.toggle('sc', window.scrollY > 10);
  }, { passive: true });

  /* Active link on scroll */
  if ('IntersectionObserver' in window) {
    var links = $$('a', menu);
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });

    var rv = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
    }, { threshold: 0.08 });
    $$('.job, .skills > div, .edu').forEach(function (el) { el.classList.add('rv'); rv.observe(el); });
  }

  /* Lightbox */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lastBtn = null;
  function openLb(src, title, btn) {
    lbImg.src = src; lbImg.alt = title; lbCap.textContent = title; lastBtn = btn;
    if (lb.showModal) { lb.showModal(); } else { lb.setAttribute('open', ''); }
  }
  function closeLb() {
    if (lb.close) { lb.close(); } else { lb.removeAttribute('open'); }
    if (lastBtn) { lastBtn.focus(); }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-src]');
    if (b) { openLb(b.getAttribute('data-src'), b.getAttribute('data-title') || '', b); }
  });
  $('#lbClose').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) { closeLb(); } });

  /* Project filter */
  var chips = $$('.chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { x.classList.toggle('on', x === c); x.setAttribute('aria-pressed', x === c); });
      $$('#projGrid .card').forEach(function (card) {
        card.hidden = !(f === 'all' || card.getAttribute('data-cat') === f);
      });
    });
  });

  /* Certificates */
  var C = 'assets/certificates/';
  var certs = [
    ['bnsp-multimedia', 'Sertifikat Kompetensi Keahlian Multimedia (BNSP)'],
    ['pkl-jki', 'Sertifikat PKL — PT. Jaya Konsultan Indonesia'],
    ['jobstreet-01', 'Pelatihan Excel Bebas Error'],
    ['jobstreet-11', 'Pelatihan Excel untuk Admin'],
    ['jobstreet-03', 'Jago Excel Kerjaan Lancar: Olah Data AntiEror'],
    ['jobstreet-07', 'Pelatihan Dasar Microsoft 365 Copilot'],
    ['jobstreet-12', 'Presentasi dengan Microsoft PowerPoint'],
    ['jobstreet-04', 'Digital Marketing — Pelatihan Dasar'],
    ['jobstreet-06', 'The Ultimate Guide to AI for Jobseekers'],
    ['jobstreet-05', 'Pengembangan Diri & Karier'],
    ['jobstreet-08', 'Kelas Persiapan Kerja (CV dan Tips Loker)'],
    ['jobstreet-09', 'Mahir Bahasa Inggris dari Dasar'],
    ['jobstreet-10', 'Jago Rumus Dasar Excel'],
    ['jobstreet-02', 'Excel untuk Bantu Kariermu'],
    ['pamulang-01', 'Seminar Nasional — Universitas Pamulang (13 Nov 2024)'],
    ['pamulang-02', 'ICOMS 2024 — Peserta Seminar Internasional'],
    ['pamulang-03', 'Sertifikat PKKMB & LKMM-PD — Universitas Pamulang'],
    ['pamulang-04', 'Rincian Materi PKKMB'],
    ['pamulang-05', 'Bukti Typing Speed 66 WPM'],
    ['pamulang-06', 'Bukti Typing Speed 70 KPM']
  ];
  var SHOW = 8, grid = $('#certGrid');
  certs.forEach(function (c, i) {
    var b = document.createElement('button');
    b.className = 'cert'; b.type = 'button';
    b.setAttribute('data-src', C + c[0] + '.jpg');
    b.setAttribute('data-title', c[1]);
    b.setAttribute('aria-label', 'Perbesar: ' + c[1]);
    if (i >= SHOW) { b.hidden = true; b.setAttribute('data-more', '1'); }
    var img = document.createElement('img');
    img.src = C + c[0] + '.jpg'; img.alt = 'Sertifikat: ' + c[1]; img.loading = 'lazy'; img.width = 400; img.height = 300;
    var t = document.createElement('span'); t.textContent = c[1];
    b.appendChild(img); b.appendChild(t); grid.appendChild(b);
  });
  var more = $('#certMore');
  more.addEventListener('click', function () {
    var expand = more.getAttribute('aria-expanded') !== 'true';
    $$('[data-more]', grid).forEach(function (b) { b.hidden = !expand; });
    more.setAttribute('aria-expanded', expand);
    more.textContent = expand ? 'Show Fewer' : 'View All Certificates';
  });
})();
