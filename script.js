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
    ['bkm', 'Sertifikat BKM', 1],
    ['mental-kebangsaan', 'Sertifikat Mental Kebangsaan', 1],
    ['minat-bakat-2025', 'Sertifikat Minat Bakat 2025', 1],
    ['minat-bakat-2026', 'Sertifikat Minat Bakat 2026', 1],
    ['packaging-supply', 'Sertifikat Packaging Supply', 1],
    ['one-book', 'Sertifikat One Book', 1],
    ['pamulang-01', 'Seminar Nasional — Universitas Pamulang (13 Nov 2024)'],
    ['pamulang-02', 'ICOMS 2024 — Peserta Seminar Internasional'],
    ['pamulang-03', 'Sertifikat PKKMB & LKMM-PD — Universitas Pamulang'],
    ['pamulang-04', 'Rincian Materi PKKMB'],
    ['pamulang-05', 'Bukti Typing Speed 66 WPM'],
    ['pamulang-06', 'Bukti Typing Speed 70 KPM']
  ];
  var SHOW = 8, grid = $('#certGrid'), EXT = ['jpg', 'jpeg', 'png', 'webp'];
  function tryImg(base, ok, no) {
    var i = 0;
    (function next() {
      if (i >= EXT.length) { if (no) { no(); } return; }
      var im = new Image();
      im.onload = function () { ok(im.src); };
      im.onerror = next;
      im.src = base + '.' + EXT[i++];
    })();
  }
  function addCert(c, hide, idx) {
    tryImg(C + c[0], function (src) {
      var b = document.createElement('button');
      b.className = 'cert'; b.type = 'button'; b.style.order = idx;
      b.setAttribute('data-src', src); b.setAttribute('data-title', c[1]);
      b.setAttribute('aria-label', 'Perbesar: ' + c[1]);
      var img = document.createElement('img');
      img.src = src; img.alt = 'Sertifikat: ' + c[1]; img.loading = 'lazy'; img.width = 400; img.height = 300;
      var t = document.createElement('span'); t.textContent = c[1];
      b.appendChild(img); b.appendChild(t);
      if (hide) { b.hidden = true; b.setAttribute('data-more', '1'); }
      grid.appendChild(b);
    });
  }
  certs.forEach(function (c, i) { addCert(c, i >= SHOW, i); });
  var more = $('#certMore');
  more.addEventListener('click', function () {
    var expand = more.getAttribute('aria-expanded') !== 'true';
    $$('[data-more]', grid).forEach(function (b) { b.hidden = !expand; });
    more.setAttribute('aria-expanded', expand);
    more.textContent = expand ? 'Show Fewer' : 'View All Certificates';
  });

  /* Creator works: file otomatis muncul jika ada di assets/creator/ */
  var K = 'assets/creator/';
  var VEXT = ['mp4', 'webm', 'mov'];
  var groups = {
    overlay: { type: 'v', n: 3, base: 'overlay-', label: 'Overlay Streaming ' },
    vtuber: { type: 'v', n: 2, base: 'vtuber-', label: 'Animasi VTuber ' },
    ai: { type: 'i', n: 5, base: 'ai-', label: 'Foto AI ' },
    design: { type: 'i', n: 8, base: 'design-', label: 'Desain ' }
  };
  var found = 0;
  function reveal(g) {
    var box = $('.cgroup[data-g="' + g + '"]');
    box.hidden = false; found++; $('#cEmpty').hidden = true;
    return $('.cgrid', box);
  }
  function tryVid(base, ok) {
    var i = 0;
    (function next() {
      if (i >= VEXT.length) { return; }
      var v = document.createElement('video'), u = base + '.' + VEXT[i++];
      v.preload = 'metadata';
      v.onloadedmetadata = function () { ok(u); };
      v.onerror = next;
      v.src = u;
    })();
  }
  Object.keys(groups).forEach(function (g) {
    var d = groups[g];
    for (var n = 1; n <= d.n; n++) {
      (function (n) {
        var base = K + d.base + n, title = d.label + n;
        if (d.type === 'i') {
          tryImg(base, function (src) {
            var f = document.createElement('figure');
            f.innerHTML = '<button class="open" data-src="' + src + '" data-title="' + title + '" aria-label="Perbesar ' + title + '"><img src="' + src + '" alt="' + title + '" loading="lazy"></button><figcaption>' + title + '</figcaption>';
            reveal(g).appendChild(f);
          });
        } else {
          tryVid(base, function (u) {
            var f = document.createElement('figure'), v = document.createElement('video'), c = document.createElement('figcaption');
            v.controls = true; v.preload = 'metadata'; v.setAttribute('playsinline', ''); v.src = u;
            c.textContent = title; f.appendChild(v); f.appendChild(c);
            reveal(g).appendChild(f);
          });
        }
      })(n);
    }
  });
  setTimeout(function () { if (!found) { $('#cEmpty').hidden = false; } }, 2500);
})();
