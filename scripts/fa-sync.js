/**
 * FA Full-Time League Table Sync
 * HTML is fetched externally (via curl in the workflow) and passed as a file path arg,
 * or fetched directly if no arg given.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FA_TABLE_URL = 'https://fulltime.thefa.com/table.html?league=1854955&selectedSeason=912243998&selectedDivision=201151991&selectedCompetition=0&selectedFixtureGroupKey=1_532713038';
const SYNC_ENABLED = true;
const DATA_FILE = path.join(__dirname, '../components/data.jsx');

const ALIASES = {
  'Blidworth Welfare FC': 'Blidworth Welfare',
  'Blidworth Welfare F.C.': 'Blidworth Welfare',
  'Graham Street Prims FC': 'Graham Street Prims',
  'Selston FC': 'Selston F.C. First',
  'Borrowash Victoria FC': 'Borrowash Victoria First',
  'Linby CW': 'Linby Colliery Welfare F.C.',
  'Cromford & Wirksworth': 'Cromford & Wirksworth Town FC',
  'Mansfield Hosiery': 'Mansfield Hosiery Mills F.C.',
  'Holbrook Sports': 'Holbrook Sports FC',
};

function normalise(name) {
  return ALIASES[name.trim()] || name.trim();
}

function fetchHtml(url) {
  return new Promise(function(resolve, reject) {
    var options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    };
    https.get(url, options, function(res) {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHtml(res.headers.location).then(resolve).catch(reject);
      }
      var data = [];
      res.on('data', function(c) { data.push(c); });
      res.on('end', function() { resolve(Buffer.concat(data).toString('utf8')); });
    }).on('error', reject);
  });
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
}

function parseHtml(html) {
  var tableMatch = html.match(/<table[\s\S]*?<\/table>/gi);
  if (!tableMatch) return [];
  var standingsTable = null;
  for (var t of tableMatch) {
    var headers = [];
    var thRe = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    var thM;
    while ((thM = thRe.exec(t)) !== null) headers.push(stripTags(thM[1]).toUpperCase());
    if (headers.some(function(h) { return h === 'PTS' || h === 'POINTS' || h === 'P'; })) {
      standingsTable = t;
      break;
    }
  }
  if (!standingsTable) return [];
  var rows = [];
  var tbodyMatch = standingsTable.match(/<tbody[\s\S]*?<\/tbody>/i);
  if (!tbodyMatch) return [];
  var rowRe = /<tr[\s\S]*?<\/tr>/gi;
  var rowM;
  while ((rowM = rowRe.exec(tbodyMatch[0])) !== null) {
    var cells = [];
    var tdRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    var tdM;
    while ((tdM = tdRe.exec(rowM[0])) !== null) cells.push(stripTags(tdM[1]));
    if (cells.length >= 6) rows.push(cells);
  }
  return rows;
}

function parseRows(rows) {
  var table = [];
  rows.forEach(function(cells) {
    var pos = parseInt(cells[0]);
    if (isNaN(pos)) return;
    var teamIdx = 1;
    if (!cells[teamIdx] || !isNaN(parseInt(cells[teamIdx]))) teamIdx = 2;
    var teamName = normalise(cells[teamIdx] || '');
    if (!teamName) return;
    var nums = [];
    for (var i = teamIdx + 1; i < cells.length; i++) {
      var n = parseInt(cells[i]);
      nums.push(isNaN(n) ? null : n);
    }
    while (nums.length && nums[nums.length - 1] === null) nums.pop();
    if (nums.length < 5) return;
    var pts = nums[nums.length - 1];
    var gd  = nums[nums.length - 2];
    var p   = nums[0];
    var w   = nums[nums.length - 5];
    var d   = nums[nums.length - 4];
    var l   = nums[nums.length - 3];
    var isSelf = teamName.toLowerCase().indexOf('blidworth') !== -1;
    var entry = { pos: pos, team: teamName, p: p || 0, w: w || 0, d: d || 0, l: l || 0, gd: gd || 0, pts: pts || 0 };
    if (isSelf) entry.self = true;
    table.push(entry);
  });
  return table;
}

function updateDataFile(newTable) {
  var source = fs.readFileSync(DATA_FILE, 'utf8');
  var tableJson = JSON.stringify(newTable, null, 4)
    .split('\n').map(function(l, i) { return i === 0 ? l : '  ' + l; }).join('\n');
  var updated = source.replace(/table:\s*\[[\s\S]*?\],/, 'table: ' + tableJson + ',');
  if (updated === source) { console.warn('WARNING: Could not find table array in data.jsx'); return false; }
  var withTimestamp = updated.replace(/_syncedAt:\s*'[^']*'/, "_syncedAt: '" + new Date().toISOString() + "'");
  fs.writeFileSync(DATA_FILE, withTimestamp.indexOf('_syncedAt') !== -1 ? withTimestamp : updated, 'utf8');
  console.log('Updated data.jsx with ' + newTable.length + ' teams');
  return true;
}

async function main() {
  if (!SYNC_ENABLED) { process.exit(0); }
  try {
    var html;
    var htmlFile = process.argv[2];
    if (htmlFile) {
      console.log('Reading HTML from file: ' + htmlFile);
      html = fs.readFileSync(htmlFile, 'utf8');
    } else {
      console.log('Fetching: ' + FA_TABLE_URL);
      html = await fetchHtml(FA_TABLE_URL);
    }
    console.log('HTML size: ' + html.length + ' bytes');

    var rows = parseHtml(html);
    console.log('Found ' + rows.length + ' table rows');
    if (rows.length === 0) { console.error('No table rows found'); process.exit(1); }

    var table = parseRows(rows);
    if (table.length < 5) {
      console.error('Only parsed ' + table.length + ' teams');
      rows.slice(0, 3).forEach(function(r) { console.log('Row:', JSON.stringify(r)); });
      process.exit(1);
    }

    var bwfc = table.find(function(t) { return t.self; });
    if (bwfc) console.log('Blidworth: pos=' + bwfc.pos + ' P=' + bwfc.p + ' Pts=' + bwfc.pts);

    updateDataFile(table);
    console.log('Done - ' + table.length + ' teams synced');
  } catch (err) {
    console.error('FA sync failed: ' + err.message);
    process.exit(1);
  }
}

main();
