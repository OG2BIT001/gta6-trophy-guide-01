// Leonida Platinum — GTA VI trophy guide & tracker.
// Plain ES module, no libraries, no network beyond this folder: it fetches data/trophies.json
// from beside this file, saves progress in localStorage, and renders three views
// (checklist, roadmap, missables) from that one data file.

const STORAGE_KEY = 'leonida-platinum-progress-v1';

const KIND_LABELS = {
  platinum: 'Platinum',
  story: 'Story',
  strangers: 'Strangers & side strands',
  activities: 'Activities',
  collectibles: 'Collectibles & exploration',
  crime: 'Crime & free-roam feats',
  misc: 'Secrets & misc',
  completion: 'Completion',
};

const STAGES = [
  { n: 1, title: 'Play the story', blurb: 'Chapters and story missions in order — all twelve story trophies unlock automatically. Do the Chapter 1 meditation event when Lucia offers it, and park a manual save at every chapter boundary: there is no mission replay.' },
  { n: 2, title: 'Strangers & side strands', blurb: 'Finish the named contacts\u2019 strands and Bret\u2019s hunt. Remember that Andy, Billy and Tyrone do not count toward Strangers & Freaks — trust the in-game tracker for that one.' },
  { n: 3, title: 'Activities & skills', blurb: 'Ranges, races, stunts and challenges, plus the stat work. Sample every activity type early (Master of None) so the long grinds start ticking over while you play.' },
  { n: 4, title: 'Collectibles & exploration', blurb: 'Cards, WAiNK scans, vehicle discoveries and the map itself. These accumulate best as a habit while travelling for everything else.' },
  { n: 5, title: 'Crime spree', blurb: 'Robberies and wanted-level feats. Bank vaults double as Hot Together attempts; plan every escape to clear the red heat zone, not just the search area.' },
  { n: 6, title: 'Money, property & admin', blurb: 'Spending, laundering, garages and registrations. Keep $160,000 aside for the eight garages before spending freely.' },
  { n: 7, title: 'Secrets & one-off feats', blurb: 'The hidden one-offs: the VCIA departure, the showroom exit, the bowling alley job and the rest. Several triggers were still being confirmed in launch week — each guide says so where that is the case.' },
  { n: 8, title: '100% and the platinum', blurb: 'The final sweep: the in-game 100% checklist under Progress > Stats, whose targets run past several trophy thresholds, and then the platinum itself.' },
];

const els = {
  count: document.getElementById('earned-count'),
  fill: document.getElementById('progress-fill'),
  bar: document.getElementById('progress-bar'),
  pct: document.getElementById('progress-pct'),
  list: document.getElementById('trophy-list'),
  detail: document.getElementById('detail'),
  resultLine: document.getElementById('result-line'),
  search: document.getElementById('search'),
  grade: document.getElementById('filter-grade'),
  kind: document.getElementById('filter-kind'),
  status: document.getElementById('filter-status'),
  missableOnly: document.getElementById('filter-missable'),
  spoilers: document.getElementById('spoilers'),
  roadmap: document.getElementById('roadmap-stages'),
  missables: document.getElementById('missable-list'),
  toolbar: document.getElementById('toolbar'),
};

let data = { trophies: [] };
let earned = new Set();
let counters = {};
let selectedId = null;

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (raw && Array.isArray(raw.earned)) {
      earned = new Set(raw.earned);
      counters = raw.counters ?? {};
    }
  } catch {
    earned = new Set();
    counters = {};
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...earned], counters }));
}

function isVeiled(t) {
  return els.spoilers.checked && t.hidden && !earned.has(t.name);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function swatch(grade) {
  return el('span', `swatch ${grade}`, grade);
}

function matchesFilters(t) {
  if (els.grade.value !== 'all' && t.grade !== els.grade.value) return false;
  if (els.kind.value !== 'all' && t.kind !== els.kind.value) return false;
  if (els.status.value === 'done' && !earned.has(t.name)) return false;
  if (els.status.value === 'todo' && earned.has(t.name)) return false;
  if (els.missableOnly.checked && !t.missable) return false;
  const q = els.search.value.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide} ${KIND_LABELS[t.kind] ?? ''}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function renderProgress() {
  const n = earned.size;
  const total = data.trophies.length;
  els.count.textContent = String(n);
  const pct = total ? Math.round((n / total) * 100) : 0;
  els.fill.style.width = `${pct}%`;
  els.bar.setAttribute('aria-valuenow', String(n));
  els.pct.textContent = `${pct}% to the platinum`;
}

function renderList() {
  const shown = data.trophies.filter(matchesFilters);
  els.resultLine.textContent = `Showing ${shown.length} of ${data.trophies.length} trophies`;
  els.list.replaceChildren();
  for (const t of shown) {
    const row = el('li', 'trophy-row');
    if (earned.has(t.name)) row.classList.add('is-earned');
    if (t.id === selectedId) row.classList.add('is-selected');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('click', (ev) => ev.stopPropagation());
    box.addEventListener('change', () => toggleEarned(t));
    row.append(box);

    const main = el('div', 'row-main');
    const veiled = isVeiled(t);
    main.append(el('div', 'row-name', veiled ? 'Hidden trophy' : t.name));
    main.append(el('div', 'row-desc', veiled ? 'Its description is hidden until you earn it.' : t.description));
    const tags = el('div', 'row-tags');
    tags.append(swatch(t.grade));
    tags.append(el('span', 'tag', KIND_LABELS[t.kind] ?? t.kind));
    if (t.target) {
      const have = counters[t.name];
      tags.append(el('span', 'tag target', have ? `Progress ${have} / ${t.target}` : `Target ${t.target}`));
    }
    if (t.missable) tags.append(el('span', 'tag missable', 'Missable'));
    if (t.hidden && !veiled) tags.append(el('span', 'tag', 'Hidden on PSN'));
    main.append(tags);
    row.append(main);

    row.addEventListener('click', () => {
      selectedId = t.id;
      renderList();
      renderDetail();
    });
    els.list.append(row);
  }
}

function toggleEarned(t) {
  if (earned.has(t.name)) earned.delete(t.name);
  else earned.add(t.name);
  save();
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmap();
}

function renderDetail() {
  const t = data.trophies.find((x) => x.id === selectedId) ?? data.trophies[0];
  if (!t) return;
  selectedId = t.id;
  const box = els.detail;
  box.replaceChildren();

  const veiled = isVeiled(t);
  box.append(swatch(t.grade));
  if (veiled) {
    box.append(el('h2', '', 'Hidden trophy'));
    box.append(el('p', 'hidden-note', 'This trophy is hidden on PlayStation until it is earned, and the spoiler setting is on.'));
    const veil = el('div', 'spoiler-veil', 'Earn it in the game to reveal its name, description and guide here — or switch off \u201cHide spoilers\u201d above.');
    box.append(veil);
  } else {
    box.append(el('h2', '', t.name));
    box.append(el('p', 'official', `\u201c${t.description}\u201d — official description`));
  }

  const tags = el('div', 'row-tags');
  tags.append(el('span', 'tag', KIND_LABELS[t.kind] ?? t.kind));
  tags.append(el('span', 'tag', `Roadmap stage ${t.stage}`));
  if (t.hidden) tags.append(el('span', 'tag', 'Hidden on PSN'));
  if (t.missable) tags.append(el('span', 'tag missable', 'Missable'));
  box.append(tags);

  if (!veiled) {
    if (t.missable && t.missableNote) {
      box.append(el('h3', '', 'Do not miss it'));
      box.append(el('p', '', t.missableNote));
    }
    box.append(el('h3', '', 'Guide (our own words)'));
    box.append(el('p', '', t.guide));
    if (Array.isArray(t.sources) && t.sources.length) {
      box.append(el('h3', '', 'Sources'));
      const ul = el('ul', 'sources');
      for (const s of t.sources) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = s.url;
        a.textContent = s.name;
        a.target = '_blank';
        a.rel = 'noopener';
        li.append(a);
        ul.append(li);
      }
      box.append(ul);
    }
  }

  if (t.target) {
    box.append(el('h3', '', 'Your progress'));
    const label = el('label', 'field', `Count so far (target ${t.target})`);
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.value = counters[t.name] ?? '';
    input.placeholder = '0';
    input.addEventListener('change', () => {
      const v = Number(input.value);
      if (Number.isFinite(v) && v >= 0) counters[t.name] = v;
      else delete counters[t.name];
      save();
      renderList();
    });
    label.append(input);
    box.append(label);
  }

  const btn = el('button', 'earn-btn', earned.has(t.name) ? 'Earned — click to undo' : 'Mark as earned');
  if (earned.has(t.name)) btn.classList.add('is-earned');
  btn.type = 'button';
  btn.addEventListener('click', () => toggleEarned(t));
  box.append(btn);
}

function renderRoadmap() {
  els.roadmap.replaceChildren();
  for (const stage of STAGES) {
    const inStage = data.trophies.filter((t) => t.stage === stage.n);
    const done = inStage.filter((t) => earned.has(t.name)).length;
    const card = el('div', 'stage');
    card.append(el('h3', '', `Stage ${stage.n} — ${stage.title}`));
    card.append(el('p', 'stage-meta', `${done} of ${inStage.length} earned`));
    card.append(el('p', '', stage.blurb));
    const ul = document.createElement('ul');
    for (const t of inStage) {
      const li = document.createElement('li');
      const b = el('button', '', `${earned.has(t.name) ? '\u2713 ' : ''}${t.name}`);
      b.type = 'button';
      b.addEventListener('click', () => {
        selectedId = t.id;
        switchView('checklist');
        renderList();
        renderDetail();
      });
      li.append(b);
      li.append(document.createTextNode(` — ${t.grade}${t.missable ? ' · MISSABLE' : ''}`));
      ul.append(li);
    }
    card.append(ul);
    els.roadmap.append(card);
  }
}

function renderMissables() {
  els.missables.replaceChildren();
  for (const t of data.trophies.filter((x) => x.missable)) {
    const card = el('div', 'missable-card');
    card.append(swatch(t.grade));
    card.append(el('h3', '', t.name));
    card.append(el('p', 'official', `\u201c${t.description}\u201d`));
    if (t.missableNote) card.append(el('p', '', t.missableNote));
    card.append(el('p', '', t.guide));
    els.missables.append(card);
  }
}

function switchView(name) {
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('is-active', tab.dataset.view === name);
  }
  document.getElementById('view-checklist').hidden = name !== 'checklist';
  document.getElementById('view-roadmap').hidden = name !== 'roadmap';
  document.getElementById('view-missables').hidden = name !== 'missables';
  els.toolbar.style.display = name === 'checklist' ? '' : 'none';
}

function exportProgress() {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned], counters }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  a.download = 'leonida-platinum-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importProgress(file) {
  const parsed = JSON.parse(await file.text());
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('No earned list in that file');
  const valid = new Set(data.trophies.map((t) => t.name));
  earned = new Set(names.filter((n) => valid.has(n)));
  if (!Array.isArray(parsed) && parsed.counters && typeof parsed.counters === 'object') {
    counters = parsed.counters;
  }
  save();
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmap();
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => switchView(tab.dataset.view));
}
for (const input of [els.search, els.grade, els.kind, els.status, els.missableOnly]) {
  input.addEventListener('input', renderList);
  input.addEventListener('change', renderList);
}
els.spoilers.addEventListener('change', () => {
  renderList();
  renderDetail();
});
document.getElementById('export').addEventListener('click', exportProgress);
document.getElementById('import').addEventListener('change', async (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  try {
    await importProgress(file);
  } catch {
    alert('That file could not be read as a progress file.');
  }
  ev.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned ticks and progress counts?')) return;
  earned = new Set();
  counters = {};
  save();
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmap();
});

load();
const response = await fetch('data/trophies.json');
data = await response.json();
if (selectedId === null && data.trophies.length) selectedId = data.trophies[0].id;
renderProgress();
renderList();
renderDetail();
renderRoadmap();
renderMissables();
