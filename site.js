/* Fills the "Current winners" list. It reads products from Supabase; if that isn't
   set up yet it uses products.js; if there are no products, the placeholders stay. */
(function () {
  var list = document.querySelector('.rows');
  if (!list) return;
  var cfg = window.SB_CONFIG || {}, NICHES = ['tech', 'home', 'fash', 'fit'];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function draw(items) {
    var shown = 0, frag = document.createDocumentFragment();
    items.forEach(function (p) {
      if (!p.name || !/^https:\/\//i.test(p.link || '')) return;
      shown++;
      var niche = NICHES.indexOf(p.niche) > -1 ? p.niche : 'tech';
      var li = el('li', 'row n-' + niche), media;
      if (p.image && /^(https:\/\/|[\w\-\/.]+$)/i.test(p.image)) {
        media = el('img');
        media.src = p.image; media.alt = p.name; media.loading = 'lazy';
      } else {
        media = el('div', 'thumb');
        media.setAttribute('role', 'img');
        media.setAttribute('aria-label', 'Placeholder for product photo');
      }
      var body = el('div');
      if (p.badge) body.appendChild(el('p', 'badge', p.badge));
      body.appendChild(el('h3', null, p.name));
      if (p.verdict) body.appendChild(el('p', null, p.verdict));
      if (p.store) body.appendChild(el('p', 'store-line', 'Available at ' + p.store));
      var a = el('a', 'btn', 'Check price');
      a.href = p.link; a.target = '_blank'; a.rel = 'sponsored noopener';
      a.dataset.slug = p.id || ''; a.dataset.niche = niche;
      a.dataset.store = p.store || ''; a.dataset.pos = 'w' + shown;
      li.appendChild(media); li.appendChild(body); li.appendChild(a);
      frag.appendChild(li);
    });
    if (!shown) return;
    list.textContent = '';
    list.appendChild(frag);
  }

  function fromFile() {
    var d = window.SITE_DATA;
    if (!d || !d.products) return;
    var names = {};
    (d.stores || []).forEach(function (s) { names[s.id] = s.name; });
    draw(d.products.map(function (p) { p.store = names[p.store] || ''; return p; }));
  }

  var ready = cfg.url && cfg.key && !/PASTE/.test(cfg.url + cfg.key);
  if (!ready) { fromFile(); return; }

  fetch(cfg.url.replace(/\/$/, '') + '/rest/v1/products?select=*,stores(name)&order=created_at.asc', {
    headers: { apikey: cfg.key, Authorization: 'Bearer ' + cfg.key }
  })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (rows) {
      draw(rows.map(function (p) {
        return { id: p.id, name: p.name, store: p.stores && p.stores.name, niche: p.niche,
                 badge: p.badge, verdict: p.verdict, image: p.image, link: p.link };
      }));
    })
    .catch(fromFile);
})();
