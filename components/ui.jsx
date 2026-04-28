// Shared UI components for BWFC site

// ============ NAV ============
function SiteNav({ variant = 'light', current = '' }) {
  const [open, setOpen] = React.useState(null);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const dark = variant === 'dark';
  const nav = [
    { k: 'news', label: 'News', href: 'news.html', sub: [
      ['First Team', 'news.html?cat=firstteam'],
      ['Announcements', 'news.html?cat=announcements'],
      ['Sponsorships', 'news.html?cat=sponsorships'],
    ]},
    { k: 'fixtures', label: 'Fixtures', href: 'fixtures.html', sub: [
      ['Fixtures', 'fixtures.html#fixtures'],
      ['Results', 'fixtures.html#results'],
      ['League Table', 'table.html'],
    ]},
    { k: 'club', label: 'Club', href: 'club.html', sub: [
      ['History & Honours', 'club.html#history'],
      ['Board & Contacts', 'club.html#board'],
    ]},
    { k: 'tickets', label: 'Tickets', href: 'tickets.html', sub: null },
    { k: 'lotto', label: 'Lotto', href: 'lotto.html', sub: null },
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: dark ? 'var(--ink)' : (scrolled ? 'rgba(245,243,238,0.95)' : 'var(--paper)'),
      color: dark ? 'var(--paper)' : 'var(--ink)',
      borderBottom: `1px solid ${dark ? 'var(--rule-light)' : 'var(--rule)'}`,
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'background 0.3s, backdrop-filter 0.3s',
    }}
    onMouseLeave={() => setOpen(null)}
    >
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', height: 72, gap: 24 }}>

        {/* Logo — always visible */}
        <a href="index.html" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <img src="assets/crest.png" alt="BWFC" style={{ height: 48, width: 'auto' }}/>
          <div style={{ lineHeight: 1 }}>
            <div className="h-display" style={{ fontSize: 16, fontWeight: 700 }}>Blidworth Welfare</div>
            <div className="eyebrow" style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>Football Club · Est. 1926</div>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="site-nav-desktop" style={{ gap: 4, marginLeft: 'auto', alignItems: 'stretch' }}>
          {nav.map(item => (
            <div key={item.k} onMouseEnter={() => setOpen(item.k)} style={{ position: 'relative' }}>
              <a href={item.href} style={{
                display: 'flex', alignItems: 'center', padding: '0 14px', height: 72,
                fontFamily: 'var(--font-display)', textTransform: 'uppercase',
                letterSpacing: '0.1em', fontSize: 13, fontWeight: 500,
                color: current === item.k ? 'var(--gold)' : 'inherit',
                borderBottom: current === item.k ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom: '-1px',
              }}>
                {item.label}
              </a>
              {item.sub && open === item.k && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0,
                  background: dark ? 'var(--ink-2)' : 'var(--white)',
                  border: `1px solid ${dark ? 'var(--rule-light)' : 'var(--rule)'}`,
                  minWidth: 220, padding: '12px 0',
                  animation: 'reveal 0.2s ease forwards',
                }}>
                  {item.sub.map(([label, href]) => (
                    <a key={label} href={href} style={{ display: 'block', padding: '10px 20px', fontSize: 13, letterSpacing: '0.02em' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
                    >{label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop: Buy Tickets + Admin */}
        <a href="tickets.html" className="btn red sm site-nav-buy-btn" style={{ marginLeft: 8, flexShrink: 0 }}>Buy Tickets →</a>
        <a href="admin/index.html" className="site-nav-admin" title="Admin Panel"
          style={{
            marginLeft: 4, flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 6,
            border: '1px solid rgba(0,0,0,0.15)',
            fontFamily: 'var(--font-display)', textTransform: 'uppercase',
            letterSpacing: '0.08em', fontSize: 11, fontWeight: 600,
            color: current === 'admin' ? 'var(--gold)' : 'rgba(0,0,0,0.35)',
            transition: 'all 0.2s', textDecoration: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; }}
        >&#9881; Admin</a>

        {/* Mobile: hamburger button */}
        <button
          className="site-nav-burger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            cursor: 'pointer', padding: 8, color: 'inherit',
            flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor' }}/>
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor' }}/>
          <span style={{ display: 'block', width: 16, height: 2, background: 'currentColor' }}/>
        </button>
      </div>

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <div className="site-nav-mobile-menu">
          <button className="site-nav-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">✕</button>
          {nav.map(item => (
            <div key={item.k}>
              <a href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</a>
              {item.sub && (
                <div className="site-nav-mobile-sub">
                  {item.sub.map(([label, href]) => (
                    <a key={label} href={href} onClick={() => setMobileOpen(false)}>{label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href="tickets.html" onClick={() => setMobileOpen(false)} style={{ color: 'var(--gold)', marginTop: 16 }}>Buy Tickets →</a>
        </div>
      )}
    </header>
  );
}

// ============ TICKER ============
// Auto-generates ticker items from BW_DATA — next fixture, latest news, lotto status.
// Anything you update in data.jsx flows through here automatically.
function Ticker({ items }) {
  const list = items || buildTickerItems(BW_DATA);
  const doubled = [...list, ...list];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((it, i) => (
          <div key={i} className="ticker-item">
            {it.live
              ? <span className="ticker-live">● {it.label}</span>
              : <span className="ticker-dot" />
            }
            <span>{it.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildTickerItems(d) {
  const items = [];
  const today = new Date(new Date().toDateString());

  // 1. Next upcoming fixture involving Blidworth — always first, marked LIVE
  const upcoming = (d.fixtures || [])
    .filter(f => /blidworth/i.test(f.home) || /blidworth/i.test(f.away))
    .filter(f => new Date(f.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  if (upcoming) {
    const isHome = /blidworth/i.test(upcoming.home);
    const opp = isHome ? upcoming.away : upcoming.home;
    const dateStr = new Date(upcoming.date).toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short',
    }).toUpperCase();
    items.push({
      label: 'NEXT MATCH',
      live: true,
      text: `${isHome ? 'BWFC V' : opp.toUpperCase() + ' V BWFC —'} ${isHome ? opp.toUpperCase() : ''} · ${dateStr} · ${upcoming.time} · ${isHome ? 'WELFARE GROUND' : 'AWAY'}`.replace(/\s+/g, ' ').trim(),
    });
  }

  // 2. Latest result if recent (last 10 days)
  const recent = (d.results || [])
    .filter(r => /blidworth/i.test(r.home) || /blidworth/i.test(r.away))
    .filter(r => r.hs !== null && r.as !== null)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (recent) {
    const daysSince = Math.floor((today - new Date(recent.date)) / (1000 * 60 * 60 * 24));
    if (daysSince <= 10) {
      const isHome = /blidworth/i.test(recent.home);
      const opp = isHome ? recent.away : recent.home;
      const bwScore = isHome ? recent.hs : recent.as;
      const oppScore = isHome ? recent.as : recent.hs;
      const result = bwScore > oppScore ? 'WIN' : bwScore < oppScore ? 'DEFEAT' : 'DRAW';
      items.push({
        text: `LATEST RESULT: BWFC ${bwScore}-${oppScore} ${opp.toUpperCase()} — ${result}`,
      });
    }
  }

  // 3. Lead news item
  const lead = (d.news || [])[0];
  if (lead) {
    items.push({ text: `${lead.cat.toUpperCase()}: ${lead.title}` });
  }

  // 4. League position
  const selfRow = (d.table || []).find(r => r.self);
  if (selfRow) {
    items.push({
      text: `LEAGUE: ${selfRow.pos}${ordinal(selfRow.pos)} in Premier South · ${selfRow.pts} pts from ${selfRow.p} · ${selfRow.w}W-${selfRow.d}D-${selfRow.l}L`,
    });
  }

  // 5. Always-on club messages
  items.push({ text: 'CENTENARY 1926–2026: A season one hundred years in the making' });
  items.push({ text: 'LOTTO: Launching Autumn 2026 — get early access' });
  items.push({ text: 'CLUB SHOP: Centenary home shirt available to pre-order' });

  return items;
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}

// ============ COUNTDOWN ============
function Countdown({ target, compact = false, onDark = false }) {
  const [t, setT] = React.useState(() => diffParts(target));
  React.useEffect(() => {
    const i = setInterval(() => setT(diffParts(target)), 1000);
    return () => clearInterval(i);
  }, [target]);
  function diffParts(tgt) {
    const raw = new Date(tgt).getTime() - Date.now();
    const diff = Math.max(0, raw);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    // Window: "LIVE" during 90-min match + 15-min half-time; "Played" after
    const minsSinceKO = raw < 0 ? -raw / 60000 : -1;
    const state = raw > 0 ? 'pre' : (minsSinceKO < 110 ? 'live' : 'played');
    return { d, h, m, s, state };
  }
  const pad = n => String(n).padStart(2, '0');
  const size = compact ? 28 : 56;
  const col = onDark ? 'var(--paper)' : 'var(--ink)';
  const dim = onDark ? 'var(--muted-dark)' : 'var(--muted)';

  if (t.state === 'live') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{
          width: 12, height: 12, borderRadius: '50%', background: 'var(--red)',
          boxShadow: '0 0 0 0 rgba(200,16,46,0.8)',
          animation: 'pulse 1.5s infinite',
        }}/>
        <div className="h-display" style={{
          fontSize: compact ? 24 : 40, fontWeight: 700, color: col,
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>Live now</div>
      </div>
    );
  }
  if (t.state === 'played') {
    return (
      <div className="h-display" style={{
        fontSize: compact ? 18 : 28, fontWeight: 600, color: col,
        textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7,
      }}>Full time · See result ↓</div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: compact ? 16 : 28, alignItems: 'flex-end' }}>
      {[['D', t.d], ['H', t.h], ['M', t.m], ['S', t.s]].map(([l, v], i) => (
        <div key={l} style={{ textAlign: 'center' }}>
          <div className="h-display mono-num" style={{
            fontSize: size, fontWeight: 600, color: col, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>{pad(v)}</div>
          <div className="eyebrow" style={{ marginTop: 8, color: dim, fontSize: compact ? 9 : 11 }}>
            {l === 'D' ? 'Days' : l === 'H' ? 'Hours' : l === 'M' ? 'Mins' : 'Secs'}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ FIXTURE / RESULT CARDS ============
function MatchCard({ match, variant = 'upcoming', onDark = false }) {
  const fg = onDark ? 'var(--paper)' : 'var(--ink)';
  const border = onDark ? 'var(--rule-light)' : 'var(--rule)';
  const isResult = variant === 'result';
  const d = new Date(match.date || match.kickoff);
  const dateStr = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();
  return (
    <div style={{
      border: `1px solid ${border}`, padding: 20,
      display: 'flex', flexDirection: 'column', gap: 12,
      background: onDark ? 'var(--ink-2)' : 'var(--white)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="eyebrow" style={{ color: fg, opacity: 0.7 }}>{match.comp}</span>
        {isResult
          ? <span className="chip dark" style={{ background: 'var(--red)', borderColor: 'var(--red)', color: '#fff' }}>FT</span>
          : <span className="eyebrow" style={{ color: fg, opacity: 0.7 }}>{dateStr}</span>
        }
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16, padding: '8px 0' }}>
        <div style={{ textAlign: 'right' }}>
          <div className="h-display" style={{ fontSize: 22, fontWeight: 600, color: fg }}>{match.home?.short || match.home}</div>
        </div>
        {isResult ? (
          <div className="h-display mono-num" style={{ fontSize: 36, fontWeight: 700, color: fg, padding: '0 16px' }}>
            {match.home?.score ?? match.hs} – {match.away?.score ?? match.as}
          </div>
        ) : (
          <div className="h-display mono-num" style={{ fontSize: 22, color: fg, opacity: 0.5, padding: '0 16px', letterSpacing: '0.08em' }}>
            {match.time || '15:00'}
          </div>
        )}
        <div>
          <div className="h-display" style={{ fontSize: 22, fontWeight: 600, color: fg }}>{match.away?.short || match.away}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: fg, opacity: 0.7, display: 'flex', justifyContent: 'space-between' }}>
        <span>{match.venue || 'Welfare Ground'}</span>
        {isResult ? <a href="#" style={{ color: 'var(--gold)' }}>Match Report →</a>
          : <a href="tickets.html" style={{ color: 'var(--gold)' }}>Tickets →</a>}
      </div>
    </div>
  );
}

// ============ NEWS CARD ============
function NewsCard({ item, size = 'md', onDark = false }) {
  const heights = { sm: 200, md: 260, lg: 420, xl: 520 };
  const fg = onDark ? 'var(--paper)' : 'var(--ink)';
  const titleSize = { sm: 18, md: 22, lg: 32, xl: 44 };
  return (
    <a href={`article.html`} style={{ display: 'block', color: fg, cursor: 'pointer' }}
       className="news-card">
      <div className="ph" style={{ height: heights[size], marginBottom: 16 }}>
        <span className="ph-label">[ photo: {item.img} ]</span>
      </div>
      <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 10 }}>{item.cat}</div>
      <h3 className="h-editorial" style={{
        fontSize: titleSize[size], fontWeight: 400,
        marginBottom: 10, textWrap: 'balance',
      }}>{item.title}</h3>
      {size !== 'sm' && (
        <p style={{ fontSize: 14, opacity: 0.75, textWrap: 'pretty', marginBottom: 12 }}>{item.kicker}</p>
      )}
      <div className="eyebrow" style={{ opacity: 0.5, fontSize: 10 }}>
        {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {item.author}
      </div>
    </a>
  );
}

// ============ SPONSOR STRIP ============
function SponsorStrip({ sponsors, onDark = false }) {
  return (
    <div style={{
      padding: '40px 0',
      borderTop: `1px solid ${onDark ? 'var(--rule-light)' : 'var(--rule)'}`,
      borderBottom: `1px solid ${onDark ? 'var(--rule-light)' : 'var(--rule)'}`,
    }}>
      <div className="wrap">
        <div className="eyebrow" style={{ textAlign: 'center', opacity: 0.6, marginBottom: 24, color: onDark ? 'var(--paper)' : 'var(--ink)' }}>
          Official Partners of Blidworth Welfare FC
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1px solid ${onDark ? 'var(--rule-light)' : 'var(--rule)'}` }}>
          {sponsors.map((s, i) => (
            <div key={s} style={{
              padding: '28px 16px', textAlign: 'center',
              borderRight: (i % 4 !== 3) ? `1px solid ${onDark ? 'var(--rule-light)' : 'var(--rule)'}` : 'none',
              borderBottom: i < 4 ? `1px solid ${onDark ? 'var(--rule-light)' : 'var(--rule)'}` : 'none',
              fontFamily: 'var(--font-display)', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 13,
              color: onDark ? 'var(--paper)' : 'var(--ink)', opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
            >{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ FOOTER ============
function SiteFooter() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '80px 0 40px' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr repeat(4, 1fr)', gap: 48, marginBottom: 64 }}>
          <div>
            <img src="assets/crest.png" alt="BWFC" style={{ height: 80, marginBottom: 20 }} />
            <div className="h-display" style={{ fontSize: 20, marginBottom: 8 }}>Blidworth Welfare FC</div>
            <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.6 }}>
              Welfare Ground, Mansfield Road<br/>
              Blidworth, Nottinghamshire<br/>
              NG21 0RJ
            </p>
          </div>
          {[
            { h: 'Club', items: ['History', 'Honours', 'Board', 'Contact', 'Job Vacancies'] },
            { h: 'Teams', items: ['First Team', 'Squad', 'Manager', 'Academy', 'Reserves'] },
            { h: 'Match', items: ['Fixtures', 'Results', 'League Table', 'Tickets', 'Match Centre'] },
            { h: 'Support', items: ['Club Shop', 'Lotto', 'Sponsorship', 'Volunteer', 'Donate'] },
          ].map(col => (
            <div key={col.h}>
              <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 16 }}>{col.h}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(x => <li key={x}><a href="#" style={{ fontSize: 14, opacity: 0.85 }}>{x}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <hr className="rule-light" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 32, fontSize: 12, opacity: 0.6 }}>
          <div>© 2026 Blidworth Welfare Football Club. Founded 1926.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
            <a href="#">Accessibility</a>
            <a href="#">Safeguarding</a>
          </div>
          <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-display)', letterSpacing: '0.1em', fontSize: 11 }}>
            <a href="#">X</a>
            <a href="#">IG</a>
            <a href="#">FB</a>
            <a href="#">YT</a>
            <a href="#">TT</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============ SECTION HEADER ============
function SectionHeader({ eyebrow, title, action, onDark = false, size = 'md' }) {
  const titleSize = size === 'lg' ? 56 : 40;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      marginBottom: 32, gap: 24,
      borderBottom: `1px solid ${onDark ? 'var(--rule-light)' : 'var(--rule)'}`,
      paddingBottom: 20,
    }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 12 }}>{eyebrow}</div>}
        <h2 className="h-display" style={{ fontSize: titleSize, fontWeight: 600 }}>{title}</h2>
      </div>
      {action && <a href={action.href} className="btn sm ghost" style={{
        color: onDark ? 'var(--paper)' : 'var(--ink)',
        borderColor: onDark ? 'var(--paper)' : 'var(--ink)',
      }}>{action.label} →</a>}
    </div>
  );
}

// ============ SOCIAL FEED ITEM ============
function SocialItem({ s }) {
  const badgeCol = s.platform === 'X' ? '#000' : s.platform === 'Instagram' ? '#e4405f' : s.platform === 'Facebook' ? '#1877f2' : '#000';
  return (
    <div style={{
      border: '1px solid var(--rule)', padding: 20,
      background: 'var(--white)', display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    className="hover-lift">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: badgeCol, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          }}>{s.platform[0]}</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{s.handle}</div>
        </div>
        <span className="eyebrow" style={{ opacity: 0.5, fontSize: 10 }}>{s.when}</span>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.5 }}>{s.text}</p>
    </div>
  );
}

Object.assign(window, {
  SiteNav, Ticker, Countdown, MatchCard, NewsCard, SponsorStrip, SiteFooter, SectionHeader, SocialItem,
});
