// FA Full-Time sync — parse pasted data and rewrite BW_DATA.
// Handles two paste types:
//   1. League table (tab/space separated, one team per row)
//   2. Fixtures/results (date, teams, score or kickoff)
// The FA "Full-Time" site renders both in fairly rigid tables — copying the
// page into a plain textarea gives us text like:
//
//   1  Clipstone           31 22 5 4 71 24 47 71
//   2  Blidworth Welfare   31 21 4 6 66 28 38 67
//   ...
//
// and for fixtures:
//
//   Sat 25 Apr  Blidworth Welfare  v  Ashfield Town     15:00  Welfare Ground
//   Sat 02 May  Clipstone          v  Blidworth Welfare 15:00  Lido Ground
//   Sat 11 Apr  Blidworth Welfare  3-1 Rainworth MW
//
// We're forgiving: any run of whitespace separates columns.

const TEAM_ALIASES = {
  'blidworth welfare fc': 'Blidworth Welfare',
  'blidworth welfare': 'Blidworth Welfare',
  'rainworth miners welfare': 'Rainworth MW',
  'rainworth m w': 'Rainworth MW',
  'kimberley miners welfare': 'Kimberley MW',
  'kimberley m w': 'Kimberley MW',
  'newstead ironsides': 'Newstead Iron.',
  'newstead iron': 'Newstead Iron.'
};
const normaliseTeam = raw => {
  const k = raw.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.]/g, '');
  if (TEAM_ALIASES[k]) return TEAM_ALIASES[k];
  // Title-case what came in
  return raw.trim().replace(/\s+/g, ' ');
};
const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11
};

// Parse "Sat 25 Apr" or "25/04/2026" or "25 Apr 2026" → ISO yyyy-mm-dd
const parseDate = (s, defaultYear) => {
  s = s.trim();
  // dd/mm/yyyy
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) {
    const [, d, mo, y] = m;
    const yr = y.length === 2 ? 2000 + parseInt(y) : parseInt(y);
    return `${yr}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  // dd mmm [yyyy] or Sat dd mmm
  m = s.match(/(\d{1,2})\s+([a-z]{3})(?:\s+(\d{2,4}))?/i);
  if (m) {
    const d = parseInt(m[1]);
    const mo = MONTHS[m[2].toLowerCase()];
    if (mo == null) return null;
    const yr = m[3] ? m[3].length === 2 ? 2000 + parseInt(m[3]) : parseInt(m[3]) : defaultYear;
    return `${yr}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return null;
};

// ─── TABLE PARSER ───────────────────────────────────────────────────────────
// Flexible: supports FA Full-Time's common formats
//   7-col:  Pos Team P W D L GD Pts                       (no GF/GA)
//   8-col:  Pos Team P W D L GF GA Pts                    (no GD)
//   9-col:  Pos Team P W D L GF GA GD Pts                 (full)
// Tokens may be tab- or space-separated. Team names may contain spaces.
// Trailing "*" or "(-3)" style points-deduction markers are tolerated.
function parseTable(text) {
  const rows = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const raw of lines) {
    // Normalise: strip decorative "*", "(P3)" markers from the end
    let line = raw.replace(/\s*[*†‡]+\s*$/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();

    // Skip header rows
    if (/^(pos|#|team|played)\b/i.test(line)) continue;
    if (/^p\s+w\s+d\s+l/i.test(line)) continue;

    // Tab-separated first, fall back to whitespace
    let tokens = line.includes('\t') ? line.split('\t').map(s => s.trim()).filter(Boolean) : line.split(/\s+/);
    if (tokens.length < 8) continue; // pos + team + ≥6 numbers

    // Position must be the first token
    const posTok = tokens[0].replace(/[.)]/g, '');
    if (!/^\d+$/.test(posTok)) continue;
    const pos = parseInt(posTok);

    // Walk from the end collecting numeric stats
    const nums = [];
    let i = tokens.length - 1;
    while (i > 0 && /^-?\d+$/.test(tokens[i])) {
      nums.unshift(parseInt(tokens[i]));
      i--;
    }
    if (nums.length < 6) continue; // need at least P W D L ? Pts

    const team = tokens.slice(1, i + 1).join(' ').trim();
    if (!team) continue;
    let p, w, d, l, gf, ga, gd, pts;
    if (nums.length >= 9) {
      [p, w, d, l, gf, ga, gd, pts] = nums;
    } else if (nums.length === 8) {
      // P W D L GF GA ? Pts — assume GD is the 7th, otherwise derive
      [p, w, d, l, gf, ga, gd, pts] = nums;
    } else if (nums.length === 7) {
      // P W D L GD Pts — common Full-Time short form  (position is pos, so 7 stats total after team)
      [p, w, d, l, gd, pts] = nums.slice(0, 6);
      // Last-col guard
      if (nums.length === 7) pts = nums[6];
      gf = null;
      ga = null;
      if (gd == null) gd = 0;
    } else if (nums.length === 6) {
      // P W D L GD Pts
      [p, w, d, l, gd, pts] = nums;
      gf = null;
      ga = null;
    }
    if (gd == null && gf != null && ga != null) gd = gf - ga;
    const norm = normaliseTeam(team);
    rows.push({
      pos,
      team: norm,
      p,
      w,
      d,
      l,
      gf: gf ?? 0,
      ga: ga ?? 0,
      gd: gd ?? 0,
      pts,
      self: /blidworth/i.test(norm)
    });
  }
  return rows;
}

// ─── FIXTURES / RESULTS PARSER ──────────────────────────────────────────────
// Splits results (have a score "3-1") from fixtures (have a kickoff time).
// De-duplicate "Dinnington Town J.F.C. Dinnington Town J.F.C." → "Dinnington Town J.F.C."
function dedupeTeam(name) {
  const t = name.trim().replace(/\s+/g, ' ');
  const half = Math.floor(t.length / 2);
  const first = t.slice(0, half).trim();
  const rest = t.slice(half).trim();
  if (first && (rest === first || rest.startsWith(first))) return first;
  // Word-level: if the tokens repeat cleanly, keep first half
  const w = t.split(' ');
  if (w.length >= 2 && w.length % 2 === 0) {
    const a = w.slice(0, w.length / 2).join(' ');
    const b = w.slice(w.length / 2).join(' ');
    if (a === b) return a;
  }
  return t;
}
function parseFixtures(text, defaultYear) {
  const fixtures = [],
    results = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const raw of lines) {
    // FA Full-Time tab-separated row looks like:
    //   "Tue 21/04/26\t15:00\tDinnington Town J.F.C.\tBlidworth Welfare\tH\tLeague"
    // or results:
    //   "Sat 11/04/26\tBlidworth Welfare\t2-1\tHolbrook Sports\tLeague"
    let tokens = raw.includes('\t') ? raw.split('\t').map(s => s.trim()).filter(Boolean) : raw.split(/\s{2,}|(?<=\d)\s(?=[A-Z])/).map(s => s.trim()).filter(Boolean);
    if (tokens.length < 3) continue;

    // Find a date somewhere in the first two tokens
    let dateIdx = -1,
      date = null;
    for (let i = 0; i < Math.min(2, tokens.length); i++) {
      const m = tokens[i].match(/(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{1,2}\s+[a-z]{3}(?:\s+\d{2,4})?)/i);
      if (m) {
        date = parseDate(m[0], defaultYear);
        if (date) {
          dateIdx = i;
          break;
        }
      }
    }
    if (!date) continue;
    const rest = tokens.slice(dateIdx + 1);

    // Look for a score token "2-1"
    const scoreIdx = rest.findIndex(t => /^\d{1,2}\s*[-–:]\s*\d{1,2}$/.test(t));
    if (scoreIdx >= 1 && scoreIdx < rest.length - 1) {
      const [hs, as] = rest[scoreIdx].split(/[-–:]/).map(n => parseInt(n));
      results.push({
        date,
        home: normaliseTeam(dedupeTeam(rest[scoreIdx - 1])),
        hs,
        as,
        away: normaliseTeam(dedupeTeam(rest[scoreIdx + 1])),
        comp: 'League'
      });
      continue;
    }

    // Fixture: expect [time?, home, away, venue?]
    let time = '15:00';
    let cursor = 0;
    const timeMatch = rest[0]?.match(/^(\d{1,2})[:.](\d{2})$/);
    if (timeMatch) {
      time = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
      cursor = 1;
    }

    // Home/away may be separated by 'v' token or just adjacent
    const vIdx = rest.slice(cursor).findIndex(t => /^(v|vs|v\.)$/i.test(t));
    let home, away;
    if (vIdx >= 0) {
      home = rest[cursor + vIdx - 1];
      away = rest[cursor + vIdx + 1];
    } else {
      home = rest[cursor];
      away = rest[cursor + 1];
    }
    if (!home || !away) continue;

    // Strip trailing H/A/League markers from away name
    away = away.replace(/\s+(H|A|League|Cup)$/i, '').trim();
    home = dedupeTeam(home);
    away = dedupeTeam(away);

    // Skip obvious junk (single letter tokens as team names)
    if (home.length < 3 || away.length < 3) continue;
    home = normaliseTeam(home);
    away = normaliseTeam(away);
    const isHome = /blidworth/i.test(home);
    fixtures.push({
      date,
      time,
      home,
      away,
      comp: 'League',
      venue: isHome ? 'H' : 'A'
    });
  }
  return {
    fixtures,
    results
  };
}

// ─── DIFF FOR PREVIEW ───────────────────────────────────────────────────────
function diffSummary(oldArr, newArr, keyFn) {
  const oldKeys = new Set(oldArr.map(keyFn));
  const newKeys = new Set(newArr.map(keyFn));
  const added = [...newKeys].filter(k => !oldKeys.has(k));
  const removed = [...oldKeys].filter(k => !newKeys.has(k));
  return {
    added: added.length,
    removed: removed.length,
    total: newArr.length
  };
}

// ─── EXPORTED COMPONENT ─────────────────────────────────────────────────────
function FASyncPanel({
  onClose
}) {
  const [tableText, setTableText] = React.useState('');
  const [fixturesText, setFixturesText] = React.useState('');
  const [preview, setPreview] = React.useState(null);
  const [applied, setApplied] = React.useState(false);
  const currentYear = new Date().getFullYear();
  const runParse = () => {
    const newTable = tableText.trim() ? parseTable(tableText) : null;
    const {
      fixtures: newFix,
      results: newRes
    } = fixturesText.trim() ? parseFixtures(fixturesText, currentYear) : {
      fixtures: null,
      results: null
    };
    setPreview({
      table: newTable,
      fixtures: newFix,
      results: newRes,
      tableDiff: newTable ? diffSummary(BW_DATA.table, newTable, t => t.team) : null,
      fixDiff: newFix ? diffSummary(BW_DATA.fixtures, newFix, f => `${f.date}|${f.home}`) : null,
      resDiff: newRes ? diffSummary(BW_DATA.results, newRes, r => `${r.date}|${r.home}`) : null
    });
  };
  const apply = () => {
    if (!preview) return;
    if (preview.table?.length) BW_DATA.table = preview.table;
    if (preview.fixtures?.length) BW_DATA.fixtures = preview.fixtures;
    if (preview.results?.length) BW_DATA.results = preview.results;

    // Also freshen nextMatch / lastMatch from the parsed data
    if (preview.fixtures?.length) {
      const upcoming = preview.fixtures.filter(f => new Date(f.date) >= new Date(new Date().toDateString())).sort((a, b) => a.date.localeCompare(b.date))[0];
      if (upcoming) {
        const isHome = /blidworth/i.test(upcoming.home);
        BW_DATA.nextMatch = {
          ...BW_DATA.nextMatch,
          home: isHome ? {
            ...BW_DATA.nextMatch.home
          } : {
            short: teamAbbr(upcoming.home),
            name: upcoming.home
          },
          away: !isHome ? {
            ...BW_DATA.nextMatch.home
          } : {
            short: teamAbbr(upcoming.away),
            name: upcoming.away
          },
          kickoff: `${upcoming.date}T${upcoming.time}:00+01:00`,
          venue: isHome ? 'Welfare Ground' : 'Away'
        };
      }
    }
    if (preview.results?.length) {
      const latest = [...preview.results].sort((a, b) => b.date.localeCompare(a.date))[0];
      if (latest) {
        BW_DATA.lastMatch = {
          ...BW_DATA.lastMatch,
          home: {
            short: teamAbbr(latest.home),
            name: latest.home,
            score: latest.hs
          },
          away: {
            short: teamAbbr(latest.away),
            name: latest.away,
            score: latest.as
          },
          date: latest.date,
          scorers: [],
          comp: latest.comp
        };
      }
    }

    // Persist the whole updated dataset into localStorage so it survives reload.
    localStorage.setItem('bwfc-fa-data', JSON.stringify({
      table: BW_DATA.table,
      fixtures: BW_DATA.fixtures,
      results: BW_DATA.results,
      nextMatch: BW_DATA.nextMatch,
      lastMatch: BW_DATA.lastMatch,
      syncedAt: new Date().toISOString()
    }));
    setApplied(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fa-sync-modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fa-sync-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fa-sync-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)'
    }
  }, "FA Full-Time Sync"), /*#__PURE__*/React.createElement("h3", {
    className: "h-display",
    style: {
      fontSize: 24,
      marginTop: 4
    }
  }, "Paste league data")), /*#__PURE__*/React.createElement("button", {
    className: "fa-close",
    onClick: onClose
  }, "\u2715")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      lineHeight: 1.6,
      opacity: 0.75,
      marginBottom: 20
    }
  }, "Open the FA Full-Time page, select the table rows or fixture list with your mouse, copy, and paste below. Whitespace-separated columns \u2014 any format works."), /*#__PURE__*/React.createElement("div", {
    className: "fa-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "fa-label"
  }, "League Table"), /*#__PURE__*/React.createElement("textarea", {
    className: "fa-textarea",
    placeholder: `1  Clipstone            31 22 5 4 71 24 47 71\n2  Blidworth Welfare    31 21 4 6 66 28 38 67\n...`,
    value: tableText,
    onChange: e => setTableText(e.target.value),
    rows: 10
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "fa-label"
  }, "Fixtures & Results"), /*#__PURE__*/React.createElement("textarea", {
    className: "fa-textarea",
    placeholder: `Sat 25 Apr  Blidworth Welfare  v  Ashfield Town   15:00\nSat 11 Apr  Blidworth Welfare  3-1  Rainworth MW\n...`,
    value: fixturesText,
    onChange: e => setFixturesText(e.target.value),
    rows: 10
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fa-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "fa-btn fa-btn-ghost",
    onClick: runParse,
    disabled: !tableText.trim() && !fixturesText.trim()
  }, "Parse & preview"), preview && /*#__PURE__*/React.createElement("button", {
    className: "fa-btn fa-btn-gold",
    onClick: apply,
    disabled: applied
  }, applied ? 'Applied — reloading…' : 'Apply to site'), preview && /*#__PURE__*/React.createElement("button", {
    className: "fa-btn fa-btn-ghost",
    onClick: () => exportJSON(preview)
  }, "\u2B07 Export data.json")), preview && /*#__PURE__*/React.createElement("div", {
    className: "fa-preview"
  }, preview.table && /*#__PURE__*/React.createElement(PreviewRow, {
    label: "Table",
    summary: `${preview.table.length} rows parsed — ${preview.tableDiff.added} new teams, ${preview.tableDiff.removed} dropped`,
    ok: preview.table.length > 0
  }), preview.fixtures && /*#__PURE__*/React.createElement(PreviewRow, {
    label: "Fixtures",
    summary: `${preview.fixtures.length} fixtures`,
    ok: preview.fixtures.length > 0
  }), preview.results && /*#__PURE__*/React.createElement(PreviewRow, {
    label: "Results",
    summary: `${preview.results.length} results`,
    ok: preview.results.length > 0
  }), preview.table?.length === 0 && preview.fixtures?.length === 0 && preview.results?.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#b00'
    }
  }, "Couldn't parse anything \u2014 double-check the format. Each row needs a position (for tables) or a date (for fixtures)."))));
}

// Export the merged dataset as a JSON file for republishing.
function exportJSON(preview) {
  const merged = {
    ...BW_DATA,
    table: preview.table?.length ? preview.table : BW_DATA.table,
    fixtures: preview.fixtures?.length ? preview.fixtures : BW_DATA.fixtures,
    results: preview.results?.length ? preview.results : BW_DATA.results,
    nextMatch: BW_DATA.nextMatch,
    lastMatch: BW_DATA.lastMatch,
    _syncedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(merged, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bwfc-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function PreviewRow({
  label,
  summary,
  ok
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fa-preview-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: `fa-badge ${ok ? 'fa-ok' : 'fa-fail'}`
  }, ok ? '✓' : '✕'), /*#__PURE__*/React.createElement("strong", {
    style: {
      width: 80,
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 11,
      letterSpacing: '0.1em'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12
    }
  }, summary));
}
function teamAbbr(name) {
  const words = name.split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map(w => w[0]).join('').toUpperCase().slice(0, 3);
}

// Rehydrate from localStorage on load — so synced data survives refresh.
(function hydrate() {
  try {
    const raw = localStorage.getItem('bwfc-fa-data');
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.table) BW_DATA.table = saved.table;
    if (saved.fixtures) BW_DATA.fixtures = saved.fixtures;
    if (saved.results) BW_DATA.results = saved.results;
    BW_DATA._syncedAt = saved.syncedAt;
  } catch (e) {}
  // Always derive nextMatch from the current fixtures list so stale sync data can't pin it.
  try {
    const today = new Date(new Date().toDateString()).getTime();
    const upcoming = (BW_DATA.fixtures || []).filter(f => new Date(f.date).getTime() >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
    if (upcoming) {
      const isHome = /blidworth/i.test(upcoming.home);
      const oppName = isHome ? upcoming.away : upcoming.home;
      const abbr = oppName.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase();
      BW_DATA.nextMatch = {
        ...BW_DATA.nextMatch,
        home: isHome ? {
          short: 'BWFC',
          name: 'Blidworth Welfare',
          crest: 'assets/crest.png'
        } : {
          short: abbr,
          name: upcoming.home
        },
        away: isHome ? {
          short: abbr,
          name: upcoming.away
        } : {
          short: 'BWFC',
          name: 'Blidworth Welfare',
          crest: 'assets/crest.png'
        },
        kickoff: `${upcoming.date}T${upcoming.time}:00+01:00`,
        venue: isHome ? 'Welfare Ground' : 'Away'
      };
    }
    const latestResult = [...(BW_DATA.results || [])].sort((a, b) => b.date.localeCompare(a.date))[0];
    if (latestResult) {
      BW_DATA.lastMatch = {
        ...BW_DATA.lastMatch,
        home: {
          short: latestResult.home.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase(),
          name: latestResult.home,
          score: latestResult.hs
        },
        away: {
          short: latestResult.away.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase(),
          name: latestResult.away,
          score: latestResult.as
        },
        date: latestResult.date,
        comp: latestResult.comp,
        scorers: BW_DATA.lastMatch?.scorers || []
      };
    }
  } catch (e) {}
})();
window.FASyncPanel = FASyncPanel;
