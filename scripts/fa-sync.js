/**
 * FA Full-Time League Table Sync
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches the Camper UK Premier Division South league table from FA Full-Time
 * and updates website/components/data.jsx with the latest standings.
 *
 * SETUP (one-time):
 *   1. Find your league table URL on fulltime.thefa.com
 *      It looks like: https://fulltime.thefa.com/displayTeague.do?selectedSeason=...&selectedDivision=...
 *   2. Replace FA_TABLE_URL below with that URL
 *   3. Commit this file — the workflow will do the rest automatically
 * ─────────────────────────────────────────────────────────────────────────────
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ── CONFIGURE THIS ────────────────────────────────────────────────────────────
// Paste the full URL of Blidworth's league table on fulltime.thefa.com
// Example: https://fulltime.thefa.com/displayTeague.do?selectedSeason=940055191&selectedDivision=940062791
// Abacus Lighting Central Midlands Alliance League — Premier Division South 2025/26
// league=1854955, season=61164433, division=572016962
const FA_TABLE_URL = 'https://fulltime.thefa.com/table.html?league=1854955&selectedSeason=61164433&selectedDivision=572016962&selectedCompetition=0&selectedFixtureGroupKey=1_647276211';

// Set to true once you've confirmed the URL above works
const SYNC_ENABLED = true;
// ─────────────────────────────────────────────────────────────────────────────

const DATA_FILE = path.join(__dirname, '../components/data.jsx');

// Club name normalisation — handles common variations between FA and our data
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
  const trimmed = name.trim();
  return ALIASES[trimmed] || trimmed;
}

async function fetchTable() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (compatible; BWFC-Sync/1.0)');
    console.log(`Fetching: ${FA_TABLE_URL}`);
    await page.goto(FA_TABLE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for table to render
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => null);

    const rows = await page.evaluate(() => {
      const results = [];
      // Try to find the standings table — FA Full-Time uses various selectors
      const tables = document.querySelectorAll('table');
      let standingsTable = null;

      for (const t of tables) {
        const headers = Array.from(t.querySelectorAll('th')).map(h => h.textContent.trim().toUpperCase());
        // Look for a table with typical league standings columns
        if (headers.some(h => h === 'PTS' || h === 'P' || h === 'POINTS')) {
          standingsTable = t;
          break;
        }
      }

      if (!standingsTable) return results;

      const tableRows = standingsTable.querySelectorAll('tbody tr');
      tableRows.forEach((row, index) => {
        const cells = Array.from(row.querySelectorAll('td')).map(c => c.textContent.trim());
        if (cells.length < 6) return;
        results.push(cells);
      });
      return results;
    });

    console.log(`Found ${rows.length} rows in table`);
    return rows;
  } finally {
    await browser.close();
  }
}

function parseRows(rows) {
  const table = [];
  rows.forEach((cells, index) => {
    // Try to parse: pos, team, P, W, D, L, GF, GA, GD, Pts (various formats)
    // Attempt to detect which column is which by position
    const pos = parseInt(cells[0]);
    if (isNaN(pos)) return;

    // Find the team name (usually cells[1], but could be cells[1-2] if there's a badge column)
    let teamIdx = 1;
    let teamName = cells[teamIdx];
    if (!teamName || !isNaN(parseInt(teamName))) teamIdx = 2;
    teamName = normalise(cells[teamIdx] || '');

    // Numbers should be at the end
    const nums = [];
    for (let i = cells.length - 1; i > teamIdx; i--) {
      const n = parseInt(cells[i]);
      if (!isNaN(n)) nums.unshift(n);
      else break;
    }

    // Expected: ...P, W, D, L, [GF, GA], GD, Pts
    const pts = nums[nums.length - 1];
    const gd  = nums[nums.length - 2];
    const p   = nums[0];
    const w   = nums[1];
    const d   = nums[2];
    const l   = nums[3];

    const isSelf = teamName.toLowerCase().includes('blidworth');

    table.push({
      pos,
      team: teamName,
      p: p || 0,
      w: w || 0,
      d: d || 0,
      l: l || 0,
      gd: gd || 0,
      pts: pts || 0,
      ...(isSelf ? { self: true } : {}),
    });
  });
  return table;
}

function updateDataFile(newTable) {
  const source = fs.readFileSync(DATA_FILE, 'utf8');

  // Replace the table array in the source
  const tableJson = JSON.stringify(newTable, null, 4)
    .split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n');

  // Find and replace the table: [...] section
  const updated = source.replace(
    /table:\s*\[[\s\S]*?\],/,
    `table: ${tableJson},`
  );

  if (updated === source) {
    console.warn('WARNING: Could not find table array in data.jsx — no changes made');
    return false;
  }

  // Add sync timestamp
  const withTimestamp = updated.replace(
    /_syncedAt:\s*'[^']*'/,
    `_syncedAt: '${new Date().toISOString()}'`
  );

  fs.writeFileSync(DATA_FILE, withTimestamp.includes('_syncedAt') ? withTimestamp : updated, 'utf8');
  console.log(`✓ Updated data.jsx with ${newTable.length} teams`);
  return true;
}

async function main() {
  if (!SYNC_ENABLED || FA_TABLE_URL === 'REPLACE_WITH_YOUR_FA_FULLTTIME_URL') {
    console.log('FA sync is not yet configured.');
    console.log('To enable:');
    console.log('  1. Find your league table URL on fulltime.thefa.com');
    console.log('  2. Set FA_TABLE_URL in scripts/fa-sync.js');
    console.log('  3. Set SYNC_ENABLED = true');
    console.log('  4. Commit the file — syncs will run automatically Wed & Sun at 6am');
    process.exit(0);
  }

  try {
    const rows = await fetchTable();
    if (rows.length === 0) {
      console.error('No table rows found — FA Full-Time page structure may have changed');
      process.exit(1);
    }
    const table = parseRows(rows);
    if (table.length < 5) {
      console.error(`Only parsed ${table.length} teams — s