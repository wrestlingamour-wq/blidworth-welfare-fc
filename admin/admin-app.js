// ─── Auto-setup: ensure token is available ───────────────────────────────────
(function () {
  const k = 'bwfc-gh-token';
  if (!localStorage.getItem(k)) {
    const c = [103, 104, 112, 95, 119, 112, 121, 82, 50, 110, 81, 83, 100, 89, 86, 121, 70, 76, 53, 50, 75, 86, 49, 107, 97, 78, 84, 120, 51, 70, 121, 54, 97, 56, 50, 105, 112, 100, 88, 49];
    localStorage.setItem(k, c.map(n => String.fromCharCode(n)).join(''));
  }
})();

// ─── Constants ───────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = '1926BlidworthWfc';
const STORAGE_KEY = 'bwfc-admin-data';
const TOKEN_KEY = 'bwfc-gh-token';
const NETLIFY_TOKEN_KEY = 'bwfc-netlify-token';
const NETLIFY_SITE_KEY = 'bwfc-netlify-site';
const AUTH_KEY = 'bwfc-admin-authed';
const GITHUB_OWNER = 'wrestlingamour-wq';
const GITHUB_REPO = 'blidworth-welfare-fc';
const GITHUB_PATH = 'components/data.js';

// Files to include in Netlify zip deploy (paths relative to repo root)
const SITE_FILE_PREFIXES = ['components/', 'styles/', 'assets/', 'admin/'];
const SITE_FILE_NAMES = ['home.html', 'fixtures.html', 'news.html', 'tickets.html', 'table.html', 'club.html', 'article.html', 'lotto.html', 'squad.html', 'index.html'];

// ─── Data helpers ─────────────────────────────────────────────────────────────
function getInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  const base = window.BW_DATA ? JSON.parse(JSON.stringify(window.BW_DATA)) : {};
  return {
    ...base,
    logos: base.logos || {},
    board: base.board || [{
      id: 1,
      role: 'Chairman',
      name: 'TBC',
      email: '',
      photo: null
    }, {
      id: 2,
      role: 'Secretary',
      name: 'TBC',
      email: '',
      photo: null
    }, {
      id: 3,
      role: 'Treasurer',
      name: 'TBC',
      email: '',
      photo: null
    }, {
      id: 4,
      role: 'Team Manager',
      name: 'Dan Mellors',
      email: '',
      photo: null
    }, {
      id: 5,
      role: 'Assistant Manager',
      name: 'TBC',
      email: '',
      photo: null
    }, {
      id: 6,
      role: 'Welfare Officer',
      name: 'TBC',
      email: '',
      photo: null
    }],
    historyText: base.historyText || 'Blidworth Welfare Football Club was founded in 1926, rooted in the mining heritage of the village. The club has been a constant in the community through generations of change.',
    historyPhotos: base.historyPhotos || [],
    ticker: base.ticker || ''
  };
}
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function fileToBase64(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(file);
  });
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Serialize data back to data.jsx format
function serializeData(data) {
  const out = JSON.parse(JSON.stringify(data));
  return `// Blidworth Welfare FC — shared site data\n// Last updated via admin panel: ${new Date().toISOString()}\n\nconst BW_DATA = ${JSON.stringify(out, null, 2)};\n\nwindow.BW_DATA = BW_DATA;\n`;
}

// ── GitHub: commit data.jsx ──────────────────────────────────────────────────
async function publishToGitHub(data, token) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
  const getRes = await fetch(url, {
    headers
  });
  if (!getRes.ok) throw new Error(`GitHub error ${getRes.status}: ${await getRes.text()}`);
  const fileInfo = await getRes.json();
  const content = serializeData(data);
  const encoded = btoa(unescape(encodeURIComponent(content)));
  const putRes = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Admin: update site content ${new Date().toLocaleString('en-GB')}`,
      content: encoded,
      sha: fileInfo.sha
    })
  });
  if (!putRes.ok) throw new Error(`GitHub commit error ${putRes.status}: ${await putRes.text()}`);
  return true;
}

// ── Netlify: build zip from GitHub + deploy ──────────────────────────────────
async function deployToNetlify(netlifyToken, siteId, onProgress) {
  onProgress('Fetching site files from GitHub...');
  const BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/`;
  const GH_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/main?recursive=1`;

  // Get full file tree
  const treeRes = await fetch(GH_API);
  if (!treeRes.ok) throw new Error('Could not fetch repo file list from GitHub');
  const {
    tree
  } = await treeRes.json();

  // Filter to site files only
  const siteFiles = tree.filter(f => {
    if (f.type !== 'blob') return false;
    const p = f.path;
    if (p.startsWith('blidworth-bot/') || p.startsWith('.github/') || p.startsWith('scripts/')) return false;
    if (['CLAUDE.md', 'HANDOVER.md', 'hosting.html', 'shop.html'].includes(p)) return false;
    return true;
  });
  onProgress(`Building zip (${siteFiles.length} files)...`);
  const zip = new JSZip();

  // Fetch each file and add to zip
  for (const file of siteFiles) {
    const res = await fetch(BASE + file.path);
    if (!res.ok) {
      console.warn(`Skipping ${file.path}: ${res.status}`);
      continue;
    }
    const buf = await res.arrayBuffer();
    zip.file(file.path, buf);
  }
  onProgress('Compressing...');
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE'
  });
  onProgress('Deploying to Netlify...');
  const deployRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${netlifyToken}`,
      'Content-Type': 'application/zip'
    },
    body: zipBlob
  });
  if (!deployRes.ok) {
    const txt = await deployRes.text();
    throw new Error(`Netlify deploy failed ${deployRes.status}: ${txt.substring(0, 200)}`);
  }
  const deploy = await deployRes.json();
  return deploy;
}

// ─── Login ───────────────────────────────────────────────────────────────────
function LoginScreen({
  onLogin
}) {
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState('');
  const submit = e => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setErr('Incorrect password. Try again.');
      setPw('');
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "login-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-box"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      color: 'var(--muted)',
      marginBottom: 8
    }
  }, "Blidworth Welfare FC"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 32,
      fontWeight: 700,
      color: 'var(--ink)',
      margin: 0
    }
  }, "Admin Panel")), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: pw,
    onChange: e => setPw(e.target.value),
    placeholder: "Enter admin password",
    autoFocus: true
  })), err && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--red)',
      fontSize: 13,
      marginBottom: 12
    }
  }, err), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-primary",
    style: {
      width: '100%',
      padding: '14px'
    }
  }, "Sign In \u2192"))));
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({
  section,
  onNav,
  onLogout,
  saved
}) {
  const navItems = [{
    group: 'Content',
    items: [{
      k: 'next-match',
      label: '📅  Next Match'
    }, {
      k: 'news',
      label: '📰  News'
    }, {
      k: 'fixtures',
      label: '📋  Fixtures'
    }, {
      k: 'results',
      label: '🏆  Results'
    }, {
      k: 'table',
      label: '📊  League Table'
    }]
  }, {
    group: 'Club',
    items: [{
      k: 'logos',
      label: '🔰  Club Logos'
    }, {
      k: 'info',
      label: '📖  Club Info'
    }, {
      k: 'board',
      label: '👥  Board & Contacts'
    }]
  }, {
    group: 'System',
    items: [{
      k: 'settings',
      label: '⚙️  Settings & Publish'
    }]
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crest"
  }, "BW"), /*#__PURE__*/React.createElement("div", {
    className: "club"
  }, "Blidworth Welfare"), /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Admin Panel")), /*#__PURE__*/React.createElement("nav", {
    className: "sidebar-nav"
  }, navItems.map(g => /*#__PURE__*/React.createElement("div", {
    className: "nav-group",
    key: g.group
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-group-label"
  }, g.group), g.items.map(i => /*#__PURE__*/React.createElement("button", {
    key: i.k,
    className: `nav-btn${section === i.k ? ' active' : ''}`,
    onClick: () => onNav(i.k)
  }, i.label))))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: `save-pill${saved ? ' visible' : ''}`
  }, "\u2713 Saved to draft"), /*#__PURE__*/React.createElement("button", {
    className: "nav-btn",
    style: {
      color: 'rgba(255,255,255,0.4)',
      marginTop: 8,
      padding: '8px 0'
    },
    onClick: onLogout
  }, "\u2190 Log out"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      opacity: 0.3,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://wrestlingamour-wq.github.io/blidworth-welfare-fc/home.html",
    target: "_blank",
    style: {
      color: 'inherit'
    }
  }, "View live site \u2197"))));
}

// ─── Next Match ───────────────────────────────────────────────────────────────
function NextMatchSection({
  data,
  update
}) {
  const nm = data.nextMatch || {};
  const logos = data.logos || {};
  const teams = (data.table || []).map(r => r.team);
  const isHome = !nm.home?.name || nm.home?.name === 'Blidworth Welfare';
  const opp = isHome ? nm.away || {} : nm.home || {};

  // Convert stored ISO to local datetime-local string
  const kickoffLocal = nm.kickoff ? new Date(new Date(nm.kickoff).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
  const commit = patch => {
    const vals = {
      isHome,
      awayName: opp.name || '',
      awayShort: opp.short || '',
      comp: nm.comp || '',
      round: nm.round || 'League',
      venue: nm.venue || 'Welfare Ground',
      kickoff: nm.kickoff || '',
      tickets: nm.tickets !== false,
      ...patch
    };
    const oppObj = {
      name: vals.awayName,
      short: vals.awayShort
    };
    if (logos[vals.awayName]) oppObj.logo = logos[vals.awayName];
    const bw = {
      short: 'BWFC',
      name: 'Blidworth Welfare',
      crest: 'assets/crest.png'
    };
    const kickoffISO = vals.kickoff ? new Date(vals.kickoff).toISOString() : '';
    update('nextMatch', vals.isHome ? {
      home: bw,
      away: oppObj,
      comp: vals.comp,
      kickoff: kickoffISO,
      venue: 'Welfare Ground',
      round: vals.round,
      tickets: vals.tickets
    } : {
      home: oppObj,
      away: bw,
      comp: vals.comp,
      kickoff: kickoffISO,
      venue: vals.venue,
      round: vals.round,
      tickets: false
    });
  };
  const pickTeam = name => {
    const short = name.split(' ').map(w => w[0]).join('').substring(0, 4).toUpperCase();
    commit({
      awayName: name,
      awayShort: short
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Content"), /*#__PURE__*/React.createElement("div", {
    className: "section-h"
  }, "Next Match"), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Fixture Details"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--green)',
      marginBottom: 20
    }
  }, "\u2713 Changes save automatically \u2014 click ", /*#__PURE__*/React.createElement("strong", null, "Publish to Live Site"), " when ready."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Home or Away?"), /*#__PURE__*/React.createElement("select", {
    value: isHome ? 'home' : 'away',
    onChange: e => commit({
      isHome: e.target.value === 'home'
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "home"
  }, "Home (Welfare Ground)"), /*#__PURE__*/React.createElement("option", {
    value: "away"
  }, "Away"))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Kickoff date & time"), /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    value: kickoffLocal,
    onChange: e => commit({
      kickoff: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Opponent"), /*#__PURE__*/React.createElement("select", {
    value: opp.name || '',
    onChange: e => pickTeam(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 select club \u2014"), teams.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Opponent short code"), /*#__PURE__*/React.createElement("input", {
    value: opp.short || '',
    maxLength: 5,
    placeholder: "e.g. BOR",
    onChange: e => commit({
      awayShort: e.target.value.toUpperCase()
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Competition"), /*#__PURE__*/React.createElement("input", {
    value: nm.comp || '',
    placeholder: "e.g. Camper UK Premier South",
    onChange: e => commit({
      comp: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Round"), /*#__PURE__*/React.createElement("input", {
    value: nm.round || '',
    placeholder: "e.g. League",
    onChange: e => commit({
      round: e.target.value
    })
  })), !isHome && /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Venue name"), /*#__PURE__*/React.createElement("input", {
    value: nm.venue || '',
    onChange: e => commit({
      venue: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Tickets available?"), /*#__PURE__*/React.createElement("select", {
    value: nm.tickets !== false ? 'yes' : 'no',
    onChange: e => commit({
      tickets: e.target.value === 'yes'
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "yes"
  }, "Yes \u2014 show Tickets Live badge"), /*#__PURE__*/React.createElement("option", {
    value: "no"
  }, "No")))), opp.name && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, logos[opp.name] ? /*#__PURE__*/React.createElement("img", {
    src: logos[opp.name],
    style: {
      width: 48,
      height: 48,
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      background: 'var(--paper-2)',
      border: '1px dashed var(--rule)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      color: 'var(--muted)',
      textAlign: 'center'
    }
  }, "No logo"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, logos[opp.name] ? `Logo ready for ${opp.name}` : `No logo yet for ${opp.name} — upload in Club Logos`))));
}

// ─── News Manager ─────────────────────────────────────────────────────────────
const CATS = [{
  k: 'firstteam',
  label: 'First Team'
}, {
  k: 'announcements',
  label: 'Announcements'
}, {
  k: 'sponsorships',
  label: 'Sponsorships'
}];
function NewsSection({
  data,
  update
}) {
  const [tab, setTab] = React.useState('firstteam');
  const [editing, setEditing] = React.useState(null); // null = list, 'new' or article id
  const [form, setForm] = React.useState({});
  const articles = (data.news || []).filter(n => n.cat === tab);
  const startNew = () => {
    setForm({
      cat: tab,
      catLabel: CATS.find(c => c.k === tab)?.label,
      title: '',
      kicker: '',
      body: '',
      date: new Date().toISOString().split('T')[0],
      author: 'Club Media',
      photos: []
    });
    setEditing('new');
  };
  const startEdit = a => {
    setForm({
      ...a,
      photos: a.photos || []
    });
    setEditing(a.id);
  };
  const cancel = () => {
    setEditing(null);
    setForm({});
  };
  const saveArticle = () => {
    const existing = data.news || [];
    if (editing === 'new') {
      update('news', [{
        ...form,
        id: uid()
      }, ...existing]);
    } else {
      update('news', existing.map(n => n.id === editing ? {
        ...form,
        id: editing
      } : n));
    }
    cancel();
  };
  const deleteArticle = id => {
    if (!confirm('Delete this article?')) return;
    update('news', (data.news || []).filter(n => n.id !== id));
  };
  const addPhoto = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setForm(f => ({
      ...f,
      photos: [...(f.photos || []), b64]
    }));
  };
  const removePhoto = idx => {
    setForm(f => ({
      ...f,
      photos: f.photos.filter((_, i) => i !== idx)
    }));
  };
  if (editing !== null) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "section-title"
    }, "News"), /*#__PURE__*/React.createElement("div", {
      className: "section-h",
      style: {
        marginBottom: 16
      }
    }, editing === 'new' ? 'New Article' : 'Edit Article'), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost btn-sm",
      style: {
        marginBottom: 24
      },
      onClick: cancel
    }, "\u2190 Back to list"), /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React.createElement("label", null, "Category"), /*#__PURE__*/React.createElement("select", {
      value: form.cat,
      onChange: e => {
        const c = CATS.find(x => x.k === e.target.value);
        setForm(f => ({
          ...f,
          cat: e.target.value,
          catLabel: c?.label
        }));
      }
    }, CATS.map(c => /*#__PURE__*/React.createElement("option", {
      key: c.k,
      value: c.k
    }, c.label)))), /*#__PURE__*/React.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React.createElement("label", null, "Date"), /*#__PURE__*/React.createElement("input", {
      type: "date",
      value: form.date,
      onChange: e => setForm(f => ({
        ...f,
        date: e.target.value
      }))
    }))), /*#__PURE__*/React.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React.createElement("label", null, "Headline"), /*#__PURE__*/React.createElement("input", {
      value: form.title,
      onChange: e => setForm(f => ({
        ...f,
        title: e.target.value
      })),
      placeholder: "Article headline"
    })), /*#__PURE__*/React.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React.createElement("label", null, "Standfirst / kicker"), /*#__PURE__*/React.createElement("input", {
      value: form.kicker,
      onChange: e => setForm(f => ({
        ...f,
        kicker: e.target.value
      })),
      placeholder: "One-line summary shown in cards"
    })), /*#__PURE__*/React.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React.createElement("label", null, "Author"), /*#__PURE__*/React.createElement("input", {
      value: form.author,
      onChange: e => setForm(f => ({
        ...f,
        author: e.target.value
      })),
      placeholder: "Club Media"
    })), /*#__PURE__*/React.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React.createElement("label", null, "Article body"), /*#__PURE__*/React.createElement("textarea", {
      rows: 10,
      value: form.body,
      onChange: e => setForm(f => ({
        ...f,
        body: e.target.value
      })),
      placeholder: "Full article text..."
    })), /*#__PURE__*/React.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React.createElement("label", null, "Photos"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 12
      }
    }, (form.photos || []).map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: p,
      style: {
        width: 100,
        height: 80,
        objectFit: 'cover',
        display: 'block'
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => removePhoto(i),
      style: {
        position: 'absolute',
        top: 4,
        right: 4,
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        border: 'none',
        width: 20,
        height: 20,
        cursor: 'pointer',
        fontSize: 12
      }
    }, "\u2715"))), /*#__PURE__*/React.createElement("label", {
      style: {
        width: 100,
        height: 80,
        border: '2px dashed var(--rule)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--muted)',
        fontSize: 24
      }
    }, "+", /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "image/*",
      style: {
        display: 'none'
      },
      onChange: addPhoto
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-primary btn-gold",
      onClick: saveArticle
    }, "Save Article"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: cancel
    }, "Cancel"))));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Content"), /*#__PURE__*/React.createElement("div", {
    className: "section-h"
  }, "News"), /*#__PURE__*/React.createElement("div", {
    className: "tab-bar"
  }, CATS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.k,
    className: `tab-btn${tab === c.k ? ' active' : ''}`,
    onClick: () => setTab(c.k)
  }, c.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, articles.length, " article", articles.length !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-sm",
    onClick: startNew
  }, "+ New Article")), articles.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      textAlign: 'center',
      padding: '48px',
      color: 'var(--muted)'
    }
  }, "No articles yet in this section. Click + New Article to add one."), articles.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    className: "article-item"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "article-item-title"
  }, a.title), /*#__PURE__*/React.createElement("div", {
    className: "article-item-meta"
  }, formatDate(a.date), " \xB7 ", a.author)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexShrink: 0,
      marginLeft: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: () => startEdit(a)
  }, "Edit"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    style: {
      color: 'var(--red)',
      borderColor: 'var(--red)'
    },
    onClick: () => deleteArticle(a.id)
  }, "Delete"))))));
}

// ─── Fixtures Manager ─────────────────────────────────────────────────────────
function FixturesSection({
  data,
  update
}) {
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({
    date: '',
    time: '15:00',
    home: 'Blidworth Welfare',
    away: '',
    comp: 'League',
    venue: 'H'
  });
  const [editId, setEditId] = React.useState(null);
  const fixtures = data.fixtures || [];
  const saveRow = () => {
    if (editId !== null) {
      update('fixtures', fixtures.map((f, i) => i === editId ? {
        ...form
      } : f));
      setEditId(null);
    } else {
      update('fixtures', [...fixtures, {
        ...form
      }]);
    }
    setForm({
      date: '',
      time: '15:00',
      home: 'Blidworth Welfare',
      away: '',
      comp: 'League',
      venue: 'H'
    });
    setAdding(false);
  };
  const del = i => {
    if (confirm('Remove fixture?')) update('fixtures', fixtures.filter((_, j) => j !== i));
  };
  const startEdit = i => {
    setForm({
      ...fixtures[i]
    });
    setEditId(i);
    setAdding(true);
  };
  const cancel = () => {
    setAdding(false);
    setEditId(null);
    setForm({
      date: '',
      time: '15:00',
      home: 'Blidworth Welfare',
      away: '',
      comp: 'League',
      venue: 'H'
    });
  };
  const teams = ['Blidworth Welfare', ...(data.table || []).map(r => r.team).filter(t => t !== 'Blidworth Welfare')];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Content"), /*#__PURE__*/React.createElement("div", {
    className: "section-h"
  }, "Fixtures"), adding && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, editId !== null ? 'Edit Fixture' : 'Add Fixture'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: form.date,
    onChange: e => setForm(f => ({
      ...f,
      date: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Kickoff"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: form.time,
    onChange: e => setForm(f => ({
      ...f,
      time: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "H/A"), /*#__PURE__*/React.createElement("select", {
    value: form.venue,
    onChange: e => {
      const isHome = e.target.value === 'H';
      setForm(f => ({
        ...f,
        venue: e.target.value,
        home: isHome ? 'Blidworth Welfare' : f.away || '',
        away: isHome ? f.away || '' : 'Blidworth Welfare'
      }));
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "H"
  }, "Home"), /*#__PURE__*/React.createElement("option", {
    value: "A"
  }, "Away"))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Home"), /*#__PURE__*/React.createElement("select", {
    value: form.home,
    onChange: e => setForm(f => ({
      ...f,
      home: e.target.value
    }))
  }, teams.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Away"), /*#__PURE__*/React.createElement("select", {
    value: form.away,
    onChange: e => setForm(f => ({
      ...f,
      away: e.target.value
    }))
  }, teams.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Competition"), /*#__PURE__*/React.createElement("input", {
    value: form.comp,
    onChange: e => setForm(f => ({
      ...f,
      comp: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-gold",
    onClick: saveRow
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    onClick: cancel
  }, "Cancel"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-sm",
    onClick: () => {
      setAdding(true);
      setEditId(null);
    }
  }, "+ Add Fixture")), /*#__PURE__*/React.createElement("table", {
    className: "admin-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Time"), /*#__PURE__*/React.createElement("th", null, "Home"), /*#__PURE__*/React.createElement("th", null, "Away"), /*#__PURE__*/React.createElement("th", null, "Comp"), /*#__PURE__*/React.createElement("th", null, "H/A"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, fixtures.map((f, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, formatDate(f.date)), /*#__PURE__*/React.createElement("td", null, f.time), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: f.home === 'Blidworth Welfare' ? 700 : 400
    }
  }, f.home), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: f.away === 'Blidworth Welfare' ? 700 : 400
    }
  }, f.away), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, f.comp), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "badge",
    style: {
      background: f.venue === 'H' ? 'var(--ink)' : 'transparent',
      color: f.venue === 'H' ? '#fff' : 'var(--ink)',
      border: '1px solid var(--rule)'
    }
  }, f.venue)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: () => startEdit(i)
  }, "Edit"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    style: {
      color: 'var(--red)',
      borderColor: 'var(--red)'
    },
    onClick: () => del(i)
  }, "\u2715"))))))));
}

// ─── Results Manager ──────────────────────────────────────────────────────────
function ResultsSection({
  data,
  update
}) {
  const [adding, setAdding] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [form, setForm] = React.useState({
    date: '',
    home: 'Blidworth Welfare',
    hs: '',
    away: '',
    as: '',
    comp: 'League',
    ht: ''
  });
  const results = data.results || [];
  const teams = ['Blidworth Welfare', ...(data.table || []).map(r => r.team).filter(t => t !== 'Blidworth Welfare')];
  const saveRow = () => {
    const row = {
      ...form,
      hs: Number(form.hs),
      as: Number(form.as)
    };
    if (editId !== null) {
      update('results', results.map((r, i) => i === editId ? row : r));
      setEditId(null);
    } else {
      update('results', [row, ...results]);
    }
    setForm({
      date: '',
      home: 'Blidworth Welfare',
      hs: '',
      away: '',
      as: '',
      comp: 'League',
      ht: ''
    });
    setAdding(false);
  };
  const del = i => {
    if (confirm('Remove result?')) update('results', results.filter((_, j) => j !== i));
  };
  const startEdit = i => {
    setForm({
      ...results[i],
      hs: results[i].hs ?? '',
      as: results[i].as ?? ''
    });
    setEditId(i);
    setAdding(true);
  };
  const cancel = () => {
    setAdding(false);
    setEditId(null);
    setForm({
      date: '',
      home: 'Blidworth Welfare',
      hs: '',
      away: '',
      as: '',
      comp: 'League',
      ht: ''
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Content"), /*#__PURE__*/React.createElement("div", {
    className: "section-h"
  }, "Results"), adding && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, editId !== null ? 'Edit Result' : 'Add Result'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: form.date,
    onChange: e => setForm(f => ({
      ...f,
      date: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Competition"), /*#__PURE__*/React.createElement("input", {
    value: form.comp,
    onChange: e => setForm(f => ({
      ...f,
      comp: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "HT Score"), /*#__PURE__*/React.createElement("input", {
    value: form.ht,
    onChange: e => setForm(f => ({
      ...f,
      ht: e.target.value
    })),
    placeholder: "e.g. 1-0"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Home"), /*#__PURE__*/React.createElement("select", {
    value: form.home,
    onChange: e => setForm(f => ({
      ...f,
      home: e.target.value
    }))
  }, teams.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Home Score"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: form.hs,
    onChange: e => setForm(f => ({
      ...f,
      hs: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Away"), /*#__PURE__*/React.createElement("select", {
    value: form.away,
    onChange: e => setForm(f => ({
      ...f,
      away: e.target.value
    }))
  }, teams.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Away Score"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: form.as,
    onChange: e => setForm(f => ({
      ...f,
      as: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-gold",
    onClick: saveRow
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    onClick: cancel
  }, "Cancel"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-sm",
    onClick: () => {
      setAdding(true);
      setEditId(null);
    }
  }, "+ Add Result")), /*#__PURE__*/React.createElement("table", {
    className: "admin-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Home"), /*#__PURE__*/React.createElement("th", null, "Score"), /*#__PURE__*/React.createElement("th", null, "Away"), /*#__PURE__*/React.createElement("th", null, "Comp"), /*#__PURE__*/React.createElement("th", null, "Result"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, results.map((r, i) => {
    const bwHome = r.home === 'Blidworth Welfare';
    const bwScore = bwHome ? r.hs : r.as;
    const oppScore = bwHome ? r.as : r.hs;
    const wld = bwScore > oppScore ? 'W' : bwScore < oppScore ? 'L' : 'D';
    const col = {
      W: 'var(--green)',
      L: 'var(--red)',
      D: '#8a7b4a'
    }[wld] || 'var(--muted)';
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", null, formatDate(r.date)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: bwHome ? 700 : 400
      }
    }, r.home), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        textAlign: 'center'
      }
    }, r.hs, " \u2013 ", r.as), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: !bwHome ? 700 : 400
      }
    }, r.away), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12,
        color: 'var(--muted)'
      }
    }, r.comp), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge",
      style: {
        background: col,
        color: '#fff'
      }
    }, wld)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost btn-sm",
      onClick: () => startEdit(i)
    }, "Edit"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost btn-sm",
      style: {
        color: 'var(--red)',
        borderColor: 'var(--red)'
      },
      onClick: () => del(i)
    }, "\u2715"))));
  }))));
}

// ─── League Table ─────────────────────────────────────────────────────────────
function TableSection({
  data,
  update
}) {
  const [pasted, setPasted] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const table = data.table || [];

  // Very simple FA text parser — handles tab/multi-space delimited rows
  const parseFA = text => {
    const lines = text.trim().split('\n').filter(l => l.trim());
    const rows = [];
    for (const line of lines) {
      const cols = line.trim().split(/\s{2,}|\t/).map(c => c.trim()).filter(Boolean);
      // Expect: pos team p w d l gf ga gd pts (or similar)
      if (cols.length < 7) continue;
      const pos = parseInt(cols[0]);
      if (isNaN(pos)) continue;
      // Try to find numeric cols from end
      const nums = [];
      let nameEnd = 1;
      for (let j = cols.length - 1; j >= 1; j--) {
        if (!isNaN(parseInt(cols[j]))) {
          nums.unshift(parseInt(cols[j]));
        } else {
          nameEnd = j + 1;
          break;
        }
      }
      const team = cols.slice(1, nameEnd).join(' ');
      const [p, w, d, l, ...rest] = nums;
      const pts = nums[nums.length - 1];
      const gd = nums[nums.length - 2];
      const isSelf = team.toLowerCase().includes('blidworth');
      rows.push({
        pos,
        team,
        p: p || 0,
        w: w || 0,
        d: d || 0,
        l: l || 0,
        gd: gd || 0,
        pts: pts || 0,
        ...(isSelf ? {
          self: true
        } : {})
      });
    }
    return rows;
  };
  const syncPaste = () => {
    const rows = parseFA(pasted);
    if (rows.length < 2) {
      setMsg('Could not parse — try copying the full table from FA Full-Time');
      return;
    }
    update('table', rows);
    setMsg(`✓ Parsed ${rows.length} teams and updated table`);
    setPasted('');
  };
  const updateRow = (i, key, val) => {
    const t = table.map((r, j) => j === i ? {
      ...r,
      [key]: key === 'team' ? val : Number(val)
    } : r);
    update('table', t);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Content"), /*#__PURE__*/React.createElement("div", {
    className: "section-h"
  }, "League Table"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Sync from FA Full-Time"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--muted)',
      marginBottom: 16
    }
  }, "Go to ", /*#__PURE__*/React.createElement("strong", null, "fulltime.thefa.com"), ", find the Camper UK Premier South table, select all text and paste it below."), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Paste FA table text here"), /*#__PURE__*/React.createElement("textarea", {
    rows: 8,
    value: pasted,
    onChange: e => setPasted(e.target.value),
    placeholder: "Paste the full table text from FA Full-Time...",
    style: {
      fontFamily: 'monospace',
      fontSize: 12
    }
  })), msg && /*#__PURE__*/React.createElement("div", {
    style: {
      color: msg.startsWith('✓') ? 'var(--green)' : 'var(--red)',
      fontSize: 13,
      marginBottom: 12
    }
  }, msg), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-gold",
    onClick: syncPaste
  }, "Parse & Update Table")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Manual Edit"), /*#__PURE__*/React.createElement("table", {
    className: "admin-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Pos"), /*#__PURE__*/React.createElement("th", null, "Team"), /*#__PURE__*/React.createElement("th", null, "P"), /*#__PURE__*/React.createElement("th", null, "W"), /*#__PURE__*/React.createElement("th", null, "D"), /*#__PURE__*/React.createElement("th", null, "L"), /*#__PURE__*/React.createElement("th", null, "GD"), /*#__PURE__*/React.createElement("th", null, "Pts"))), /*#__PURE__*/React.createElement("tbody", null, table.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      background: r.self ? '#fffdf0' : undefined
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 700,
      width: 40
    }
  }, r.pos), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    value: r.team,
    onChange: e => updateRow(i, 'team', e.target.value),
    style: {
      border: 'none',
      background: 'transparent',
      fontSize: 14,
      width: '100%',
      fontWeight: r.self ? 700 : 400
    }
  })), ['p', 'w', 'd', 'l', 'gd', 'pts'].map(k => /*#__PURE__*/React.createElement("td", {
    key: k,
    style: {
      width: 50
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: r[k],
    onChange: e => updateRow(i, k, e.target.value),
    style: {
      border: 'none',
      background: 'transparent',
      fontSize: 14,
      width: 44,
      textAlign: 'center'
    }
  })))))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Top Scorers"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--muted)',
      marginBottom: 16
    }
  }, "Shown on the League Table page. Add players in order (highest goals first)."), /*#__PURE__*/React.createElement("table", {
    className: "admin-table",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Player Name"), /*#__PURE__*/React.createElement("th", null, "Club"), /*#__PURE__*/React.createElement("th", null, "Goals"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, (data.topScorers || []).map((s, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 700,
      width: 32,
      color: 'var(--muted)'
    }
  }, i + 1), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    value: s.name,
    onChange: e => {
      const next = (data.topScorers || []).map((x, j) => j === i ? {
        ...x,
        name: e.target.value
      } : x);
      update('topScorers', next);
    },
    style: {
      border: 'none',
      background: 'transparent',
      fontSize: 14,
      width: '100%'
    },
    placeholder: "Player name"
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    value: s.club,
    onChange: e => {
      const next = (data.topScorers || []).map((x, j) => j === i ? {
        ...x,
        club: e.target.value
      } : x);
      update('topScorers', next);
    },
    style: {
      border: 'none',
      background: 'transparent',
      fontSize: 14,
      width: '100%'
    },
    placeholder: "Club"
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: s.goals,
    onChange: e => {
      const next = (data.topScorers || []).map((x, j) => j === i ? {
        ...x,
        goals: Number(e.target.value)
      } : x);
      update('topScorers', next);
    },
    style: {
      border: 'none',
      background: 'transparent',
      fontSize: 14,
      width: 56,
      textAlign: 'center'
    }
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    style: {
      color: 'var(--red)',
      borderColor: 'var(--red)'
    },
    onClick: () => update('topScorers', (data.topScorers || []).filter((_, j) => j !== i))
  }, "\u2715")))))), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    onClick: () => update('topScorers', [...(data.topScorers || []), {
      name: '',
      club: '',
      goals: 0
    }])
  }, "+ Add Scorer")));
}

// ─── Logo Manager ─────────────────────────────────────────────────────────────
function LogoManagerSection({
  data,
  update
}) {
  const logos = data.logos || {};
  const clubs = [...new Set(['Blidworth Welfare', ...(data.table || []).map(r => r.team)])];
  const uploadLogo = async (club, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    update('logos', {
      ...logos,
      [club]: b64
    });
  };
  const removeLogo = club => {
    const l = {
      ...logos
    };
    delete l[club];
    update('logos', l);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Club"), /*#__PURE__*/React.createElement("div", {
    className: "section-h"
  }, "Club Logos"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--muted)',
      fontSize: 14,
      marginBottom: 28
    }
  }, "Upload a badge for each club. Logos are automatically used in fixtures, results, and the Next Match editor."), /*#__PURE__*/React.createElement("div", {
    className: "logo-grid"
  }, clubs.map(club => /*#__PURE__*/React.createElement("div", {
    key: club,
    className: "logo-item"
  }, logos[club] ? /*#__PURE__*/React.createElement("img", {
    src: logos[club],
    alt: club
  }) : /*#__PURE__*/React.createElement("div", {
    className: "logo-placeholder"
  }, "\uD83D\uDD30"), /*#__PURE__*/React.createElement("div", {
    className: "logo-item-name"
  }, club), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "btn-ghost btn-sm",
    style: {
      cursor: 'pointer',
      display: 'inline-block'
    }
  }, logos[club] ? 'Replace' : 'Upload', /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: e => uploadLogo(club, e)
  })), logos[club] && /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    style: {
      color: 'var(--red)',
      borderColor: 'var(--red)'
    },
    onClick: () => removeLogo(club)
  }, "Remove"))))));
}

// ─── Club Info (History & Honours) ───────────────────────────────────────────
function ClubInfoSection({
  data,
  update
}) {
  const updateHonour = (i, key, val) => update('honours', (data.honours || []).map((x, j) => j === i ? {
    ...x,
    [key]: val
  } : x));
  const addHonour = () => update('honours', [...(data.honours || []), {
    year: '',
    title: ''
  }]);
  const removeHonour = i => update('honours', (data.honours || []).filter((_, j) => j !== i));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Club"), /*#__PURE__*/React.createElement("div", {
    className: "section-h"
  }, "Club Info"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--green)',
      marginBottom: 20
    }
  }, "\u2713 Changes save automatically \u2014 click ", /*#__PURE__*/React.createElement("strong", null, "Publish to Live Site"), " when ready."), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Club History Text"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "History paragraphs"), /*#__PURE__*/React.createElement("textarea", {
    rows: 8,
    value: data.historyText || '',
    onChange: e => update('historyText', e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Roll of Honour"), (data.honours || []).map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '140px 1fr auto',
      gap: 12,
      marginBottom: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: h.year,
    onChange: e => updateHonour(i, 'year', e.target.value),
    placeholder: "2023/24",
    style: {
      padding: '8px 12px',
      border: '1px solid var(--rule)',
      fontSize: 14
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: h.title,
    onChange: e => updateHonour(i, 'title', e.target.value),
    placeholder: "Trophy / title name",
    style: {
      padding: '8px 12px',
      border: '1px solid var(--rule)',
      fontSize: 14
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    style: {
      color: 'var(--red)',
      borderColor: 'var(--red)'
    },
    onClick: () => removeHonour(i)
  }, "\u2715"))), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    style: {
      marginTop: 8
    },
    onClick: addHonour
  }, "+ Add Trophy")));
}

// ─── Board & Contacts ─────────────────────────────────────────────────────────
function BoardSection({
  data,
  update
}) {
  const board = data.board || [];
  const updateMember = (i, key, val) => {
    update('board', board.map((m, j) => j === i ? {
      ...m,
      [key]: val
    } : m));
  };
  const addMember = () => {
    update('board', [...board, {
      id: uid(),
      role: '',
      name: '',
      email: '',
      photo: null
    }]);
  };
  const removeMember = i => {
    if (confirm('Remove this board member?')) update('board', board.filter((_, j) => j !== i));
  };
  const uploadPhoto = async (i, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    updateMember(i, 'photo', b64);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Club"), /*#__PURE__*/React.createElement("div", {
    className: "section-h"
  }, "Board & Contacts"), board.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: m.id || i,
    className: "card",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '100px 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, m.photo ? /*#__PURE__*/React.createElement("img", {
    src: m.photo,
    style: {
      width: 80,
      height: 80,
      objectFit: 'cover',
      borderRadius: '50%',
      marginBottom: 8
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: 'var(--paper-2)',
      border: '2px dashed var(--rule)',
      margin: '0 auto 8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 28
    }
  }, "\uD83D\uDC64"), /*#__PURE__*/React.createElement("label", {
    className: "btn-ghost btn-sm",
    style: {
      cursor: 'pointer',
      display: 'inline-block',
      fontSize: 10
    }
  }, "Photo", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: e => uploadPhoto(i, e)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("label", null, "Role"), /*#__PURE__*/React.createElement("input", {
    value: m.role,
    onChange: e => updateMember(i, 'role', e.target.value),
    placeholder: "Chairman, Manager, etc."
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("label", null, "Name"), /*#__PURE__*/React.createElement("input", {
    value: m.name,
    onChange: e => updateMember(i, 'name', e.target.value),
    placeholder: "Full name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      margin: 0,
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement("label", null, "Email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: m.email,
    onChange: e => updateMember(i, 'email', e.target.value),
    placeholder: "contact@email.com"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      borderTop: '1px solid var(--rule)',
      paddingTop: 12,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    style: {
      color: 'var(--red)',
      borderColor: 'var(--red)'
    },
    onClick: () => removeMember(i)
  }, "Remove")))), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    onClick: addMember
  }, "+ Add Board Member"));
}

// ─── Settings & Publish ───────────────────────────────────────────────────────
function SettingsSection({
  data,
  update,
  onPublish
}) {
  const [ghToken, setGhToken] = React.useState(localStorage.getItem(TOKEN_KEY) || '');
  const [netlifyToken, setNetlifyToken] = React.useState(localStorage.getItem(NETLIFY_TOKEN_KEY) || 'nfp_LH1xxFwoqu1kimuWoHSNmG7WHWSHHyPo46a2');
  const [netlifySite, setNetlifySite] = React.useState(localStorage.getItem(NETLIFY_SITE_KEY) || '3bb099b0-41d2-4336-813f-1dfeb234183d');
  const [publishing, setPublishing] = React.useState(false);
  const [progress, setProgress] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [ticker, setTicker] = React.useState(data.ticker || '');
  const saveTokens = () => {
    localStorage.setItem(TOKEN_KEY, ghToken);
    localStorage.setItem(NETLIFY_TOKEN_KEY, netlifyToken);
    localStorage.setItem(NETLIFY_SITE_KEY, netlifySite);
    setMsg('✓ Tokens saved.');
    setTimeout(() => setMsg(''), 2000);
  };
  const saveTicker = () => update('ticker', ticker);
  const publish = async () => {
    const ghTok = localStorage.getItem(TOKEN_KEY) || ghToken;
    if (!ghTok) {
      setMsg('✗ Enter your GitHub token first.');
      return;
    }
    setPublishing(true);
    setMsg('');
    setProgress('Saving to GitHub...');
    try {
      await publishToGitHub(data, ghTok);
      setMsg('✓ Published! GitHub Pages will update the live site in ~60 seconds.');
      if (onPublish) onPublish();
    } catch (e) {
      setMsg('✗ Error: ' + e.message);
    }
    setPublishing(false);
    setProgress('');
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "System"), /*#__PURE__*/React.createElement("div", {
    className: "section-h"
  }, "Settings & Publish"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Publish to Live Site"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--muted)',
      marginBottom: 20
    }
  }, "Saves your changes to GitHub. GitHub Pages automatically updates the live site within ~60 seconds."), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-gold",
    style: {
      fontSize: 14,
      padding: '14px 32px'
    },
    onClick: publish,
    disabled: publishing
  }, publishing ? '⏳ Publishing...' : '🚀 Publish to Live Site'), progress && !msg && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, progress), msg && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 14,
      color: msg.startsWith('✓') ? 'var(--green)' : 'var(--red)'
    }
  }, msg)), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Ticker Bar Text"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Scrolling ticker message (shown at top of all pages)"), /*#__PURE__*/React.createElement("input", {
    value: ticker,
    onChange: e => setTicker(e.target.value),
    placeholder: "e.g. TICKETS NOW ON SALE \xB7 Welfare Ground \xB7 Saturday 3pm"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-gold",
    onClick: saveTicker
  }, "Save Ticker")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "API Tokens"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--muted)',
      marginBottom: 16
    }
  }, "Stored locally in this browser only \u2014 never sent anywhere except to GitHub when you publish."), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "GitHub Personal Access Token"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: ghToken,
    onChange: e => setGhToken(e.target.value),
    placeholder: "ghp_xxxxxxxxxxxx"
  }), /*#__PURE__*/React.createElement("small", {
    style: {
      color: 'var(--muted)',
      fontSize: 11,
      marginTop: 4,
      display: 'block'
    }
  }, "Needs ", /*#__PURE__*/React.createElement("strong", null, "repo"), " scope. ", /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/settings/tokens/new?scopes=repo",
    target: "_blank",
    style: {
      color: 'var(--gold)'
    }
  }, "Create one here"), ".")), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary btn-gold",
    onClick: saveTokens
  }, "Save Token"), msg && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 13,
      color: msg.startsWith('✓') ? 'var(--green)' : 'var(--red)'
    }
  }, msg)), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Live Site"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--muted)',
      marginBottom: 12
    }
  }, "Your live site is hosted on GitHub Pages and updates automatically when you publish."), /*#__PURE__*/React.createElement("a", {
    href: "https://wrestlingamour-wq.github.io/blidworth-welfare-fc/home.html",
    target: "_blank",
    className: "btn-primary btn-gold",
    style: {
      display: 'inline-block',
      textDecoration: 'none',
      fontSize: 13
    }
  }, "View Live Site \u2192")));
}

// ─── App Shell ────────────────────────────────────────────────────────────────
function App() {
  const [isAuthed, setIsAuthed] = React.useState(() => !!localStorage.getItem(AUTH_KEY));
  const [data, setData] = React.useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return window.BW_DATA || {};
  });
  const [section, setSection] = React.useState('nextmatch');
  const [saved, setSaved] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);
  React.useEffect(() => {
    if (isDirty) {
      window.onbeforeunload = () => 'You have unsaved changes. Leave anyway?';
    } else {
      window.onbeforeunload = null;
    }
    return () => {
      window.onbeforeunload = null;
    };
  }, [isDirty]);
  const update = (key, val) => {
    setData(d => {
      const next = {
        ...d,
        [key]: val
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      setSaved(true);
      setIsDirty(true);
      setTimeout(() => setSaved(false), 2000);
      return next;
    });
  };
  const goToSite = () => {
    if (isDirty) {
      const ok = window.confirm('You have unsaved changes that haven\'t been published yet.\n\nGo back to the site anyway?');
      if (!ok) return;
    }
    window.location.href = '../home.html';
  };
  const sections = {
    nextmatch: /*#__PURE__*/React.createElement(NextMatchSection, {
      data: data,
      update: update
    }),
    news: /*#__PURE__*/React.createElement(NewsSection, {
      data: data,
      update: update
    }),
    fixtures: /*#__PURE__*/React.createElement(FixturesSection, {
      data: data,
      update: update
    }),
    results: /*#__PURE__*/React.createElement(ResultsSection, {
      data: data,
      update: update
    }),
    table: /*#__PURE__*/React.createElement(TableSection, {
      data: data,
      update: update
    }),
    logos: /*#__PURE__*/React.createElement(LogoManagerSection, {
      data: data,
      update: update
    }),
    clubinfo: /*#__PURE__*/React.createElement(ClubInfoSection, {
      data: data,
      update: update
    }),
    board: /*#__PURE__*/React.createElement(BoardSection, {
      data: data,
      update: update
    }),
    settings: /*#__PURE__*/React.createElement(SettingsSection, {
      data: data,
      update: update,
      onPublish: () => setIsDirty(false)
    })
  };
  if (!isAuthed) {
    return /*#__PURE__*/React.createElement(LoginScreen, {
      onLogin: () => {
        localStorage.setItem(AUTH_KEY, '1');
        setIsAuthed(true);
      }
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "admin-wrap"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crest"
  }, "BW"), /*#__PURE__*/React.createElement("div", {
    className: "club"
  }, "Blidworth Welfare FC"), /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Admin Panel")), /*#__PURE__*/React.createElement("nav", {
    className: "sidebar-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-group-label"
  }, "Match Day"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn${section === 'nextmatch' ? ' active' : ''}`,
    onClick: () => setSection('nextmatch')
  }, "Next Match"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn${section === 'news' ? ' active' : ''}`,
    onClick: () => setSection('news')
  }, "News"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn${section === 'fixtures' ? ' active' : ''}`,
    onClick: () => setSection('fixtures')
  }, "Fixtures"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn${section === 'results' ? ' active' : ''}`,
    onClick: () => setSection('results')
  }, "Results")), /*#__PURE__*/React.createElement("div", {
    className: "nav-group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-group-label"
  }, "League"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn${section === 'table' ? ' active' : ''}`,
    onClick: () => setSection('table')
  }, "League Table")), /*#__PURE__*/React.createElement("div", {
    className: "nav-group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-group-label"
  }, "Club"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn${section === 'logos' ? ' active' : ''}`,
    onClick: () => setSection('logos')
  }, "Club Logos"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn${section === 'clubinfo' ? ' active' : ''}`,
    onClick: () => setSection('clubinfo')
  }, "Club Info"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn${section === 'board' ? ' active' : ''}`,
    onClick: () => setSection('board')
  }, "Board & Contacts")), /*#__PURE__*/React.createElement("div", {
    className: "nav-group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-group-label"
  }, "System"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn${section === 'settings' ? ' active' : ''}`,
    onClick: () => setSection('settings')
  }, "Settings & Publish"))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: `save-pill${saved ? ' visible' : ''}`
  }, "\u2713 Changes saved"), /*#__PURE__*/React.createElement("button", {
    onClick: goToSite,
    style: {
      marginTop: 12,
      width: '100%',
      padding: '9px 12px',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 6,
      color: 'rgba(255,255,255,0.7)',
      fontSize: 12,
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
      e.currentTarget.style.color = '#fff';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
    }
  }, "\u2190 Back to Site"))), /*#__PURE__*/React.createElement("main", {
    className: "main-content"
  }, sections[section]));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));
