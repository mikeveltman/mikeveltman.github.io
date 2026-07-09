/* Project page: lightbox + EXIF tooltip */
(function () {
  var lb      = document.getElementById('lightbox');
  var lbImg   = document.getElementById('lightbox-img');
  var lbExif  = document.getElementById('lightbox-exif');
  var tooltip = document.getElementById('exif-tooltip');
  var cache   = new Map();

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

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbExif.textContent = '';
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    loadExif(src, function (text) {
      if (lb.classList.contains('is-open') && lbImg.getAttribute('src') === src) {
        lbExif.textContent = text || '';
      }
    });
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { lbImg.src = ''; lbExif.textContent = ''; }, 200);
  }

  document.querySelectorAll('.photo-gallery img').forEach(function (img) {
    img.addEventListener('click', function () { openLightbox(this.src, this.alt); });
  });

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox();
  });

  // ── EXIF hover tooltip (inside photo) ─────────────

  document.querySelectorAll('.photo-gallery img').forEach(function (img) {
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
