var STORAGE_ENTRIES = 'petanque_entries';
var STORAGE_SESSIONS = 'petanque_sessions';
var STORAGE_CURRENT_SESSION = 'petanque_current_session';

var entries = JSON.parse(localStorage.getItem(STORAGE_ENTRIES) || '[]');
var sessions = JSON.parse(localStorage.getItem(STORAGE_SESSIONS) || '[]');
var rawCurrent = localStorage.getItem(STORAGE_CURRENT_SESSION);
var currentSessionId =
  rawCurrent && sessions.some(function (s) { return s.id === rawCurrent; }) ? rawCurrent : null;
var cur = {};

var LABELS = {
  tir: 'Tir',
  point: 'Pointé',
  touche: 'Touchée',
  rate: 'Ratée',
  poussee: 'Poussée',
  pale: 'Palet',
  carreau: 'Carreau magueul',
  simple: 'Reprise simple',
  difficile: 'Reprise difficile',
  defendable: 'Défendable',
  nul: 'Nul indéfendable',
  mer: 'À la mer',
  plombe: 'Plombée',
  portee: 'Portée',
  demi: 'Demi-portée',
  roulette: 'Roulette'
};

var PRESULTS = ['simple', 'difficile', 'defendable', 'nul', 'mer'];
var PRESULT_CLS = { simple: 'rb-ok', difficile: 'rb-ok', defendable: 'rb-mid', nul: 'rb-ko', mer: 'rb-ko' };
var TECHNIQUES = ['plombe', 'portee', 'demi', 'roulette'];
var TECH_COLORS = { plombe: '#8f7ef0', portee: '#a898f8', demi: '#c4beff', roulette: '#ddd8ff' };

var pickMap = {
  type: { ids: ['btn-tir', 'btn-point'], vals: ['tir', 'point'], cls: ['sel-tir', 'sel-point'] },
  contact: { ids: ['btn-touche', 'btn-rate'], vals: ['touche', 'rate'], cls: ['sel-ok', 'sel-bad'] },
  effet: {
    ids: ['btn-poussee', 'btn-pale', 'btn-carreau'],
    vals: ['poussee', 'pale', 'carreau'],
    cls: ['sel-mid', 'sel-mid', 'sel-ok']
  },
  presult: {
    ids: ['btn-simple', 'btn-difficile', 'btn-defendable', 'btn-nul', 'btn-mer'],
    vals: ['simple', 'difficile', 'defendable', 'nul', 'mer'],
    cls: ['sel-ok', 'sel-ok', 'sel-mid', 'sel-bad', 'sel-bad']
  },
  technique: {
    ids: ['btn-plombe', 'btn-portee', 'btn-demi', 'btn-roulette'],
    vals: ['plombe', 'portee', 'demi', 'roulette'],
    cls: ['sel-tech', 'sel-tech', 'sel-tech', 'sel-tech']
  }
};

function generateId() {
  return 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function saveData() {
  localStorage.setItem(STORAGE_ENTRIES, JSON.stringify(entries));
  localStorage.setItem(STORAGE_SESSIONS, JSON.stringify(sessions));
  if (currentSessionId) localStorage.setItem(STORAGE_CURRENT_SESSION, currentSessionId);
  else localStorage.removeItem(STORAGE_CURRENT_SESSION);
  document.getElementById('header-count').textContent =
    entries.length + (entries.length > 1 ? ' boules' : ' boule');
}

function initSessions() {
  if (!sessions.length) {
    sessions.push({ id: generateId(), type: 'training', name: 'Session 1', ts: Date.now() });
    currentSessionId = sessions[0].id;
    saveData();
  } else if (!currentSessionId) {
    currentSessionId = sessions[0].id;
    saveData();
  }
  updateSessionDisplay();
}

function updateSessionDisplay() {
  if (!currentSessionId) return;
  var sess = sessions.find(function (s) {
    return s.id === currentSessionId;
  });
  if (!sess) return;
  document.getElementById('session-type-badge').textContent =
    sess.type === 'training' ? 'Entraînement' : 'Partie';
  document.getElementById('session-type-badge').className =
    'session-badge' + (sess.type === 'training' ? ' training' : '');
  document.getElementById('session-name-display').textContent = sess.name || '—';
}

function openSessionModal() {
  document.getElementById('session-modal').classList.add('show');
  updateModalContent();
}

function closeSessionModal() {
  document.getElementById('session-modal').classList.remove('show');
}

function selectSessionType(type) {
  document.getElementById('type-training').classList.toggle('selected', type === 'training');
  document.getElementById('type-match').classList.toggle('selected', type === 'match');
}

function updateModalContent() {
  var list = document.getElementById('sessions-list');
  list.innerHTML = '';
  var matches = sessions.filter(function (s) {
    return s.type === 'match';
  });
  if (!matches.length) {
    var empty = document.createElement('div');
    empty.style.fontSize = '12px';
    empty.style.color = 'var(--text3)';
    empty.textContent = 'Aucune partie';
    list.appendChild(empty);
  } else {
    matches.forEach(function (s) {
      var div = document.createElement('div');
      div.className = 'session-option' + (s.id === currentSessionId ? ' selected' : '');
      div.setAttribute('data-session-id', s.id);
      div.textContent = s.name;
      list.appendChild(div);
    });
  }
  document.getElementById('session-name-input').value = '';
  document.getElementById('type-match').classList.remove('selected');
  document.getElementById('type-training').classList.add('selected');
}

function selectExistingSession(id) {
  currentSessionId = id;
  updateSessionDisplay();
  saveData();
  closeSessionModal();
}

function createOrSelectSession() {
  var typeTraining = document.getElementById('type-training').classList.contains('selected');
  var type = typeTraining ? 'training' : 'match';
  var name = document.getElementById('session-name-input').value.trim();

  if (!name) {
    name =
      type === 'training'
        ? 'Session ' + (sessions.length + 1)
        : 'Partie ' +
          sessions.filter(function (s) {
            return s.type === 'match';
          }).length +
          1;
  }

  var newSession = { id: generateId(), type: type, name: name, ts: Date.now() };
  sessions.push(newSession);
  currentSessionId = newSession.id;
  saveData();
  updateSessionDisplay();
  closeSessionModal();
}

function pick(step, val) {
  if (step === 'type') {
    if (val === 'tir') {
      delete cur.presult;
      delete cur.technique;
    } else {
      delete cur.contact;
      delete cur.effet;
    }
  }
  if (step === 'contact' && val === 'rate') delete cur.effet;
  if (step === 'presult') delete cur.technique;

  cur[step] = val;
  var m = pickMap[step];
  m.ids.forEach(function (id, i) {
    var el = document.getElementById(id);
    if (!el) return;
    el.className = 'btn' + (m.vals[i] === val ? ' ' + m.cls[i] : '');
  });
  updateBlocks();
}

function setStepHidden(id, hidden) {
  document.getElementById(id).classList.toggle('step-hidden', hidden);
}

function updateBlocks() {
  var isTir = cur.type === 'tir';
  var isPt = cur.type === 'point';

  setStepHidden('blk-presult', !isPt);
  setStepHidden('blk-tech', !isPt || !cur.presult);

  setStepHidden('blk-contact', !isTir);
  var showEffet = isTir && cur.contact === 'touche';
  setStepHidden('blk-effet', !showEffet);

  var ok =
    (isTir && cur.contact === 'rate') ||
    (isTir && cur.contact === 'touche' && cur.effet) ||
    (isPt && cur.presult && cur.technique);
  document.getElementById('btn-confirm').classList.toggle('dim', !ok);
}

function confirmEntry() {
  var e = Object.assign({}, cur);
  e.ts = Date.now();
  e.sessionId = currentSessionId;
  entries.push(e);
  saveData();
  showFlash(e);
  cur = {};
  document.querySelectorAll('#tab-saisie .btn').forEach(function (b) {
    b.className = 'btn';
  });
  document.getElementById('btn-confirm').classList.add('dim');
  updateBlocks();
  document.getElementById('content').scrollTo({ top: 0, behavior: 'smooth' });
}

function showFlash(e) {
  var msg =
    e.type === 'tir'
      ? e.contact === 'rate'
        ? 'Ratée'
        : LABELS[e.effet]
      : LABELS[e.presult] + ' · ' + LABELS[e.technique];
  var bad = e.contact === 'rate' || e.presult === 'mer' || e.presult === 'nul';
  var mid = e.presult === 'defendable' || e.effet === 'pale' || e.effet === 'poussee';
  var el = document.getElementById('flash');
  el.textContent = msg;
  el.style.background = bad ? '#a02020' : mid ? '#a05010' : '#1a7a48';
  el.classList.add('show');
  setTimeout(function () {
    el.classList.remove('show');
  }, 1600);
}

function pct(arr, fn) {
  return arr.length ? Math.round((arr.filter(fn).length / arr.length) * 100) : 0;
}

function setBar(pid, bid, val) {
  document.getElementById(pid).textContent = val + '%';
  document.getElementById(bid).style.width = val + '%';
}

function getFilteredEntries(filter) {
  return entries.filter(function (e) {
    if (filter === 'all') return true;
    var sess = sessions.find(function (s) {
      return s.id === e.sessionId;
    });
    return sess && sess.type === filter;
  });
}

function buildPointCrosstabHtml(pts, idPrefix) {
  if (!pts.length) return '<p class="no-data">Aucun pointé enregistré.</p>';
  var html = '';
  PRESULTS.forEach(function (pr) {
    var sub = pts.filter(function (e) {
      return e.presult === pr;
    });
    var cls = PRESULT_CLS[pr];
    var blockId = idPrefix + pr;
    html += '<div class="result-block' + (sub.length === 0 ? ' collapsed' : '') + '" id="' + blockId + '">';
    html += '<div class="result-header" onclick="toggleBlock(\'' + blockId + '\')">';
    html += '<div class="result-left"><span class="rbadge ' + cls + '">' + LABELS[pr] + '</span>';
    html +=
      '<span class="rcount">' +
      sub.length +
      ' boule' +
      (sub.length > 1 ? 's' : '') +
      '</span></div>';
    html += '<span class="chevron">▾</span></div>';
    html += '<div class="tech-list">';
    if (!sub.length) {
      html += '<p class="empty-note">Aucune boule pour ce résultat.</p>';
    } else {
      TECHNIQUES.forEach(function (t) {
        var n = sub.filter(function (e) {
          return e.technique === t;
        }).length;
        var p = Math.round((n / sub.length) * 100);
        html += '<div class="tech-row">';
        html += '<span class="tech-name">' + LABELS[t] + '</span>';
        html +=
          '<div class="tech-bar-wrap"><div class="tech-bar-fill" style="width:' +
          p +
          '%;background:' +
          TECH_COLORS[t] +
          '"></div></div>';
        html += '<span class="tech-pct">' + p + '%</span>';
        html += '<span class="tech-n">(' + n + ')</span>';
        html += '</div>';
      });
    }
    html += '</div></div>';
  });
  return html;
}

function renderStatsGlobal() {
  var filter = document.getElementById('global-filter').value;
  var filtered = getFilteredEntries(filter);
  var tirs = filtered.filter(function (e) {
    return e.type === 'tir';
  });
  var pts = filtered.filter(function (e) {
    return e.type === 'point';
  });
  var total = filtered.length;
  var carr = tirs.filter(function (e) {
    return e.effet === 'carreau';
  });

  document.getElementById('s-total').textContent = total;
  document.getElementById('s-tirs').textContent = tirs.length;
  document.getElementById('s-tirs-p').textContent = total
    ? Math.round((tirs.length / total) * 100) + '% des boules'
    : '—';
  document.getElementById('s-points').textContent = pts.length;
  document.getElementById('s-points-p').textContent = total
    ? Math.round((pts.length / total) * 100) + '% des boules'
    : '—';
  document.getElementById('s-carreaux').textContent = carr.length;
  document.getElementById('s-carreaux-p').textContent = tirs.length
    ? Math.round((carr.length / tirs.length) * 100) + '% des tirs'
    : '—';

  setBar(
    'pt-carreau',
    'pb-carreau',
    pct(tirs, function (e) {
      return e.effet === 'carreau';
    })
  );
  setBar(
    'pt-pale',
    'pb-pale',
    pct(tirs, function (e) {
      return e.effet === 'pale';
    })
  );
  setBar(
    'pt-poussee',
    'pb-poussee',
    pct(tirs, function (e) {
      return e.effet === 'poussee';
    })
  );
  setBar(
    'pt-rate',
    'pb-rate',
    pct(tirs, function (e) {
      return e.contact === 'rate';
    })
  );

  document.getElementById('crosstab-global').innerHTML = buildPointCrosstabHtml(pts, 'rb-g-');
}

function renderStatsDetail() {
  var matchId = document.getElementById('match-selector').value;
  if (!matchId) {
    document.getElementById('stats-detail-content').innerHTML =
      '<p class="no-data">Aucune partie sélectionnée</p>';
    return;
  }

  var filtered = entries.filter(function (e) {
    return e.sessionId === matchId;
  });
  var tirs = filtered.filter(function (e) {
    return e.type === 'tir';
  });
  var pts = filtered.filter(function (e) {
    return e.type === 'point';
  });
  var total = filtered.length;
  var carr = tirs.filter(function (e) {
    return e.effet === 'carreau';
  });

  var html = '<div class="stats-grid">';
  html +=
    '<div class="stat-card"><div class="stat-lbl">Total boules</div><div class="stat-val">' +
    total +
    '</div></div>';
  html +=
    '<div class="stat-card"><div class="stat-lbl">Carreaux magueuls</div><div class="stat-val">' +
    carr.length +
    '</div><div class="stat-sub">' +
    (tirs.length ? Math.round((carr.length / tirs.length) * 100) + '% des tirs' : '—') +
    '</div></div>';
  html +=
    '<div class="stat-card"><div class="stat-lbl">Tirs</div><div class="stat-val">' +
    tirs.length +
    '</div><div class="stat-sub">' +
    (total ? Math.round((tirs.length / total) * 100) + '%' : '—') +
    '</div></div>';
  html +=
    '<div class="stat-card"><div class="stat-lbl">Pointés</div><div class="stat-val">' +
    pts.length +
    '</div><div class="stat-sub">' +
    (total ? Math.round((pts.length / total) * 100) + '%' : '—') +
    '</div></div>';
  html += '</div>';

  html += '<div class="sec-title">Résultats des tirs</div>';
  html +=
    '<div class="prog-item"><div class="prog-row"><span>Carreau magueul</span><span>' +
    pct(tirs, function (e) {
      return e.effet === 'carreau';
    }) +
    ' %</span></div><div class="prog-track"><div class="prog-fill" style="background:#7da87d;width:' +
    pct(tirs, function (e) {
      return e.effet === 'carreau';
    }) +
    '%"></div></div></div>';
  html +=
    '<div class="prog-item"><div class="prog-row"><span>Palet</span><span>' +
    pct(tirs, function (e) {
      return e.effet === 'pale';
    }) +
    '%</span></div><div class="prog-track"><div class="prog-fill" style="background:#c69b7a;width:' +
    pct(tirs, function (e) {
      return e.effet === 'pale';
    }) +
    '%"></div></div></div>';
  html +=
    '<div class="prog-item"><div class="prog-row"><span>Poussée</span><span>' +
    pct(tirs, function (e) {
      return e.effet === 'poussee';
    }) +
    '%</span></div><div class="prog-track"><div class="prog-fill" style="background:#7a9cc6;width:' +
    pct(tirs, function (e) {
      return e.effet === 'poussee';
    }) +
    '%"></div></div></div>';
  html +=
    '<div class="prog-item"><div class="prog-row"><span>Ratée</span><span>' +
    pct(tirs, function (e) {
      return e.contact === 'rate';
    }) +
    '%</span></div><div class="prog-track"><div class="prog-fill" style="background:#c67a7a;width:' +
    pct(tirs, function (e) {
      return e.contact === 'rate';
    }) +
    '%"></div></div></div>';

  html += '<div class="sec-title">Pointés : résultats × techniques</div>';
  html += buildPointCrosstabHtml(pts, 'rb-d-');

  document.getElementById('stats-detail-content').innerHTML = html;
}

function showTab(name) {
  var tabs = ['saisie', 'stats-global', 'stats-detail', 'log'];
  tabs.forEach(function (t, i) {
    document.querySelectorAll('.tab')[i].classList.toggle('active', t === name);
    document.getElementById('tab-' + t).style.display = t === name ? '' : 'none';
  });
  if (name === 'stats-global') renderStatsGlobal();
  if (name === 'stats-detail') {
    var selector = document.getElementById('match-selector');
    var prev = selector.value;
    selector.innerHTML = '';
    var opt0 = document.createElement('option');
    opt0.value = '';
    opt0.textContent = '— Sélectionner une partie —';
    selector.appendChild(opt0);
    sessions
      .filter(function (s) {
        return s.type === 'match';
      })
      .forEach(function (s) {
        var o = document.createElement('option');
        o.value = s.id;
        o.textContent = s.name;
        selector.appendChild(o);
      });
    if (prev && Array.prototype.some.call(selector.options, function (o) { return o.value === prev; }))
      selector.value = prev;
    renderStatsDetail();
  }
  if (name === 'log') renderLog();
}

function renderLog() {
  var el = document.getElementById('log-list');
  if (!entries.length) {
    el.innerHTML = '<p class="no-data">Aucune boule enregistrée.</p>';
    return;
  }
  el.innerHTML = '';
  for (var i = entries.length - 1; i >= 0; i--) {
    var e = entries[i];
    var row = document.createElement('div');
    row.className = 'log-item';
    var tc = e.type === 'tir' ? 'b-tir' : 'b-point';
    var b1 = document.createElement('span');
    b1.className = 'badge ' + tc;
    b1.textContent = e.type === 'tir' ? 'Tir' : 'Pointé';
    row.appendChild(b1);
    row.appendChild(document.createTextNode(' '));
    if (e.type === 'tir') {
      var rc = e.contact === 'rate' ? 'b-ko' : e.effet === 'carreau' ? 'b-ok' : 'b-mid';
      var b2 = document.createElement('span');
      b2.className = 'badge ' + rc;
      b2.textContent = e.contact === 'rate' ? 'Ratée' : LABELS[e.effet];
      row.appendChild(b2);
    } else {
      var rc2 =
        e.presult === 'simple' || e.presult === 'difficile'
          ? 'b-ok'
          : e.presult === 'defendable'
            ? 'b-mid'
            : 'b-ko';
      var b3 = document.createElement('span');
      b3.className = 'badge ' + rc2;
      b3.textContent = LABELS[e.presult];
      row.appendChild(b3);
      row.appendChild(document.createTextNode(' '));
      var b4 = document.createElement('span');
      b4.className = 'badge b-tech';
      b4.textContent = LABELS[e.technique];
      row.appendChild(b4);
    }
    var d = e.ts ? new Date(e.ts) : null;
    var time = d ? d.getHours() + 'h' + String(d.getMinutes()).padStart(2, '0') : '';
    var num = document.createElement('span');
    num.className = 'log-num';
    num.textContent = (time ? time + ' · ' : '') + '#' + (i + 1);
    row.appendChild(num);
    el.appendChild(row);
  }
}

function toggleBlock(id) {
  document.getElementById(id).classList.toggle('collapsed');
}

function resetAll() {
  var hasData = entries.length > 0 || sessions.length > 0;
  if (hasData && !confirm('Effacer toutes les données ?')) return;
  entries = [];
  sessions = [];
  currentSessionId = null;
  saveData();
  initSessions();
  showTab('saisie');
}

document.getElementById('sessions-list').addEventListener('click', function (ev) {
  var el = ev.target.closest('.session-option[data-session-id]');
  if (!el) return;
  selectExistingSession(el.getAttribute('data-session-id'));
});

initSessions();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
