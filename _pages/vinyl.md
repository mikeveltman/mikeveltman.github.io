---
layout: default
title: Vinyl
permalink: /vinyl
---

<div class="page-wrap page-wrap--wide">
  <h1>Vinyl</h1>

  <p id="vinyl-status">Loading collection…</p>
  <div class="vinyl-grid" id="vinyl-grid"></div>
</div>

<script>
(function () {
  var grid   = document.getElementById('vinyl-grid');
  var status = document.getElementById('vinyl-status');
  var all    = [];

  function renderCard(release) {
    var info   = release.basic_information;
    var title  = info.title || '';
    var artist = (info.artists && info.artists[0]) ? info.artists[0].name.replace(/\s*\(\d+\)$/, '') : '';
    var thumb  = info.cover_image || info.thumb || '';

    var a = document.createElement('a');
    a.className = 'vinyl-card';
    a.href = 'https://www.discogs.com/release/' + release.id;
    a.target = '_blank';
    a.rel = 'noopener';

    if (thumb) {
      var img = document.createElement('img');
      img.src = thumb;
      img.alt = title;
      img.loading = 'lazy';
      a.appendChild(img);
    } else {
      var placeholder = document.createElement('div');
      placeholder.style.cssText = 'aspect-ratio:1;background:var(--border);border-radius:6px;';
      a.appendChild(placeholder);
    }

    var titleEl = document.createElement('span');
    titleEl.className = 'vinyl-title';
    titleEl.textContent = title;
    a.appendChild(titleEl);

    if (artist) {
      var artistEl = document.createElement('span');
      artistEl.className = 'vinyl-artist';
      artistEl.textContent = artist;
      a.appendChild(artistEl);
    }

    return a;
  }

  function fetchPage(url) {
    return fetch(url, { headers: { 'User-Agent': 'mikeveltman-site/1.0' } })
      .then(function (r) { return r.json(); });
  }

  function loadAll() {
    var first = 'https://api.discogs.com/users/fluxable2/collection/folders/0/releases?per_page=50&sort=added&sort_order=desc';

    fetchPage(first).then(function (data) {
      var releases = data.releases || [];
      all = all.concat(releases);

      var pages  = data.pagination ? data.pagination.pages : 1;
      var pending = pages - 1;

      if (pending === 0) {
        render();
        return;
      }

      var promises = [];
      for (var p = 2; p <= pages; p++) {
        promises.push(fetchPage(first + '&page=' + p));
      }

      Promise.all(promises).then(function (results) {
        results.forEach(function (d) { all = all.concat(d.releases || []); });
        render();
      });
    }).catch(function () {
      status.textContent = 'Could not load collection.';
    });
  }

  function render() {
    status.style.display = 'none';
    all.forEach(function (release) {
      grid.appendChild(renderCard(release));
    });
  }

  loadAll();
}());
</script>
