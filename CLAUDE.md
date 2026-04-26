# Blidworth Welfare FC — Project Context

Read this first in every new chat. It's the source of truth for what's real, what's placeholder, and what's been decided.

---

## The Club (real facts)

- **Name:** Blidworth Welfare FC
- **Founded:** 1926 — **centenary season is 2026** (this site is themed around it)
- **Location:** Blidworth, Nottinghamshire
- **League (2025–26):** Camper UK League · Premier Division South
- **Current position:** 16th of 18 (fighting relegation, 4 games left as of 18 Apr 2026)
- **Points:** 22 · **Played:** 26
- **Ground name in site:** "Welfare Ground" — NEEDS USER CONFIRMATION, may be wrong
- **Colours:** Red, black, white, gold (centenary accent)

## Real data in the site

- **Full 18-team league table** — from user's FA Full-Time paste (Apr 2026 snapshot)
  - Top: Graham Street Prims · Bottom: Mansfield Hosiery
  - Blidworth highlighted at 16th
  - Columns: P, W, D, L, GD, PTS (no GF/GA — this league doesn't publish them)
- **Next match:** Sat 18 Apr 2026 vs Holbrook Sports (H), 15:00
- **6 real upcoming fixtures** (18 Apr – 2 May)
- **6 recent results** — written as plausible form for a 16th-placed side (2-0 L, 1-1 D, 3-1 L, 2-2 D, 4-0 L, 1-3 L) — NOT real results, but realistic

## Placeholders / fiction still in the site (needs user input)

- **Squad** — all player names are invented. Appearance/goal stats are invented.
  - User to either (a) provide real squad or (b) ask Claude to strip stats and just show roster
- **Manager name:** "Dan Mellors" — placeholder
- **Top scorers in table sidebar** — invented names
- **Sponsors list** — fictional ("The Forest Fox Pub", "NG21 Autocentre", "Welbeck Timber")
- **Social posts (@BlidworthWFC)** — placeholder copy
- **Centenary dinner date, academy intake dates** — plausible but not confirmed

## What's been built

### Pages (root of project)
- `home.html` — main landing page (hero, next match, news, table preview, etc.)
- `table.html` — full league table
- `fixtures.html` — fixtures + results
- `squad.html` — squad listing (PLACEHOLDER DATA)
- `tickets.html` — ticket info for matches
- `admin.html` — **mock admin dashboard** (login screen + dashboard UI, not wired to anything)
- `hosting.html` — running-cost breakdown page for the user's reference

### Key components
- `data.jsx` — central data store (`BW_DATA`). All content lives here.
- `components/fa-sync.jsx` — **FA Sync panel** for pasting FA Full-Time table/fixtures. Parses & previews, then applies + persists to `localStorage`. Has an **Export JSON** button to download the merged dataset for republishing.
- Styles: `styles/base.css` + page-specific styles inline

### Design system
- Typography: display = serif, body = sans. Variables in `styles/base.css` under `--font-display`, `--font-body`
- Colours: `--ink` (near-black), `--paper` / `--paper-2` (off-whites), `--gold` (centenary accent), `--red` (club red), `--green` (form win indicator), `--rule` (dividers)

## How the user publishes changes (current workflow)

The site is a **static HTML project**. No backend. No CMS wired up.

1. User tells Claude what to change (new article, fixture update, etc.)
2. Claude edits files directly, OR
3. User pastes FA Full-Time data into the FA Sync panel, previews, clicks "Export JSON"
4. User uploads the updated files to their host (Netlify / Cloudflare Pages / GitHub Pages)

There is NO admin login that actually works. `admin.html` is a design mock to show the user what a CMS-backed version would look like.

## Hosting decision (pending)

User is leaning toward **DIY with Claude as dev support** — Tier 1 from `hosting.html`:
- Domain: ~£12/yr
- Hosting: free (Netlify / Cloudflare Pages)
- Claude: helps write/edit on demand in chat sessions
- **Total: £12–£192/yr**

See `hosting.html` for full three-tier breakdown if user wants to revisit.

## Working notes for future Claude sessions

- **Every page uses React + Babel** via script tags (pinned versions — don't change the integrity hashes)
- **Named style objects** — if adding a new component with a styles object, name it like `homeStyles`, `tableStyles`, NEVER just `styles` (breaks when multiple components are on the same page)
- **When the user says "sync from FA"** — they mean open the FA Sync panel on the live site and paste league data; Claude doesn't do this scraping
- **When the user asks for a new match report / article** — write it as a new entry in `BW_DATA.news` in `data.jsx`, then confirm how they want to publish
- **Keep invented data minimal.** If you don't know something real (player names, sponsors, manager), ASK the user rather than inventing more fiction. There's already enough placeholder content to clean up.

## Outstanding asks from user (as of 18 Apr 2026)

- Decide what to do about squad (provide real / strip to roster only)
- Confirm ground name
- Provide manager name
- Decide on sponsor list (real sponsors? clear them?)
- Pick a hosting tier and get the site deployed to a real domain

## Tone & style

- Grassroots, unpretentious, community-rooted
- Proud of the 1926 heritage without being kitsch
- "Up the Welfare" is the fan chant — use sparingly as a flourish
- No emoji unless specifically asked
- Sharp, editorial typography over generic-web-template vibes
