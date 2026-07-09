/* Project page: lightbox + EXIF tooltip */
(function () {
  var lb      = document.getElementById('lightbox');
  var lbImg   = document.getElementById('lightbox-img');
  var lbExif  = document.getElementById('lightbox-exif');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');
  var tooltip = document.getElementById('exif-tooltip');
  var cache   = new Map();
  var imgs    = Array.prototype.slice.call(document.querySelectorAll('.photo-gallery img'));
  var current = -1;

  // ── EXIF helpers ──────────────────────────────────

  function formatExif(data) {
    if (!data) return null;
    var parts = [];
    if (data.FNumber)         parts.push('f/' + data.FNumber);
    if (data.ExposureTime) {
      var t = data.ExposureTime;
      parts.push(t < 1 ? '1⁄' + Math.round(1 / t) + 's' : t + 's');
    }
    if (data.ISOSpeedRatings) parts.push('ISO ' + data.ISOSpeedRatings);
    if (data.FocalLength)     parts.push(Math.round(data.FocalLength) + 'mm');
    return parts.length ? parts.join('  ·  ') : null;
  }

  function loadExif(src, cb) {
    if (cache.has(src)) { cb(cache.get(src)); return; }
    if (typeof exifr === 'undefined') return;
    exifr.parse(src, ['FNumber', 'ExposureTime', 'ISOSpeedRatings', 'FocalLength'])
      .then(function (data) {
        var text = formatExif(data);
        cache.set(src, text);
        cb(text);
      })
      .catch(function () { cache.set(src, null); });
  }

  // ── Lightbox ──────────────────────────────────────

  function showAt(i) {
    if (!imgs.length) return;
    current = (i + imgs.length) % imgs.length;
    var src = imgs[current].src;
    lbImg.src = src;
    lbImg.alt = imgs[current].alt || '';
    lbExif.textContent = '';
    loadExif(src, function (text) {
      if (lb.classList.contains('is-open') && lbImg.getAttribute('src') === src) {
        lbExif.textContent = text || '';
      }
    });
    // Preload neighbours so prev/next feels instant
    if (imgs.length > 1) {
      new Image().src = imgs[(current + 1) % imgs.length].src;
      new Image().src = imgs[(current - 1 + imgs.length) % imgs.length].src;
    }
  }

  function openLightbox(i) {
    showAt(i);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { lbImg.src = ''; lbExif.textContent = ''; }, 200);
  }

  imgs.forEach(function (img, i) {
    img.addEventListener('click', function () { openLightbox(i); });
  });

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });

  if (imgs.length < 2) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
  }
  prevBtn.addEventListener('click', function () { showAt(current - 1); });
  nextBtn.addEventListener('click', function () { showAt(current + 1); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape')          closeLightbox();
    else if (e.key === 'ArrowLeft')  showAt(current - 1);
    else if (e.key === 'ArrowRight') showAt(current + 1);
  });

  // Swipe left/right on touch devices
  var touchX = null, touchY = null;
  lb.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    touchX = touchY = null;
    if (imgs.length > 1 && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      showAt(dx < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  // ── EXIF hover tooltip (inside photo) ─────────────

  imgs.forEach(function (img) {
    img.addEventListener('mouseenter', function () {
      var src = this.src;
      var el  = this;
      loadExif(src, function (text) {
        if (!text || !el.matches(':hover')) return;
        tooltip.textContent = text;
        var r = el.getBoundingClientRect();
        tooltip.style.left = (r.left + 12) + 'px';
        tooltip.style.top  = (r.bottom - (tooltip.offsetHeight || 32) - 12) + 'px';
        tooltip.classList.add('is-visible');
      });
    });
    img.addEventListener('mouseleave', function () {
      tooltip.classList.remove('is-visible');
    });
  });
}());
