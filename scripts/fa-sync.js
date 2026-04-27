/**
 * FA Full-Time League Table Sync
 * Fetches the Camper UK Premier Division South league table from FA Full-Time
 * and updates components/data.jsx with the latest standings.
 */

const puppeteer = require('puppeteer');
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
  var trimmed = name.trim();
  return ALIASES[trimmed] || trimmed;
}

async function fetchTable() {
  var browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  try {
    var page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('Fetching: ' + FA_TABLE_URL);

    // Use load event + extra wait rather than networkidle2 which can timeout
    await page.goto(FA_TABLE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });

    // Wait up to 15s for a table with numeric cells to appear
    await page.waitForFunction(
      function() {
        var tables = document.querySelectorAll('table');
        for (var t of tables) {
          var ths = Array.from(t.querySelectorAll('th')).map(function(h) { return h.textContent.trim().toUpperCase(); });
          if (ths.some(function(h) { return h === 'PTS' || h === 'POINTS'; })) return true;
        }
        return false;
      },
      { timeout: 15000 }
    ).catch(function() { console.log('Table header wait timed out, trying anyway...'); });

    // Extra pause for JS rendering
    await new Promise(function(r) { setTimeout(r, 3000); });

    var rows = await page.evaluate(function() {
      var results = [];
      var tables = document.querySelectorAll('table');
      var standingsTable = null;
      for (var t of tables) {
        var headers = Array.from(t.querySelectorAll('th')).map(function(h) { return h.textContent.trim().toUpperCase(); });
        if (headers.some(function(h) { return h === 'PTS' || h === 'P' || h === 'POINTS'; })) {
          standingsTable = t;
          break;
        }
      }
      if (!standingsTable) return results;
      standingsTable.querySelectorAll('tbody tr').forEach(function(row) {
        var cells = Array.from(row.querySelectorAll('td')).map(function(c) { return c.textContent.trim(); });
        if (cells.length >= 6) results.push(cells);
      });
      return results;
    });

    console.log('Found ' + rows.length + ' rows in table');
    return rows;
  } finally {
    await browser.close();
  }
}

function parseRows(rows) {
  var table = [];
  rows.forEach(function(cells) {
    var pos = parseInt(cells[0]);
    if (isNaN(pos)) return;

    var teamIdx = 1;
    if (!cells[teamIdx] || !isNaN(parseInt(cells[teamIdx]))) teamIdx = 2;
    var teamName = normalise(cells[teamIdx] || '');

    // FA Full-Time has home/away split columns, so read from the end:
    // last = pts, second-to-last = gd, positions -5 -4 -3 = W D L
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
  if (updated === source) {
    console.warn('WARNING: Could not find table array in data.jsx');
    return false;
  }
  var withTimestamp = updated.replace(/_syncedAt:\s*'[^']*'/, "_syncedAt: '" + new Date().toISOString() + "'");
  fs.writeFileSync(DATA_FILE, withTimestamp.indexOf('_syncedAt') !== -1 ? withTimestamp : updated, 'utf8');
  console.log('Updated data.jsx with ' + newTable.length + ' teams');
  return true;
}

async function main() {
  if (!SYNC_ENABLED) {
    console.log('FA sync disabled.');
    process.exit(0);
  }
  try {
    var rows = await fetchTable();
    if (rows.length === 0) {
      console.error('No table rows found - FA Full-Time page may not have loaded');
      process.exit(1);
    }
    var table = parseRows(rows);
    if (table.length < 5) {
      console.error('Only parsed ' + table.length + ' teams - check page structure');
      process.exit(1);
    }
    updateDataFile(table);
    console.log('Done - ' + table.length + ' teams synced from FA Full-Time');
  } catch (err) {
    console.error('FA sync failed: ' + err.message);
    process.exit(1);
  }
}

main();
