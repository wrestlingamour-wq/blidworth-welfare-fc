// Homepage V1 — CLASSIC
// Dense, broadcast-style, takeover hero with crest reveal + countdown
// Traditional pro-club layout: hero, match strip, news grid, table, shop, community, social

function HomeClassic() {
  const d = BW_DATA;
  const next = d.nextMatch;
  return (
    <div style={{ background: 'var(--paper)' }}>
      {/* HERO — dark takeover with crest reveal */}
      <section style={{
        background: 'var(--ink)', color: 'var(--paper)',
        position: 'relative', overflow: 'hidden',
        minHeight: 720,
      }}>
        {/* Placeholder backdrop */}
        <div className="ph" style={{
          position: 'absolute', inset: 0, opacity: 0.45,
          background: `repeating-linear-gradient(135deg, #1a1a1a 0 16px, #0f0f0f 16px 32px)`,
          zIndex: 0,
        }}>
          <span className="ph-label" style={{ position: 'absolute', bottom: 16, right: 16 }}>
            [ hero photo: Whitlock celebration, derby night ]
          </span>
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.9) 100%)',
          zIndex: 1,
        }}/>

        <div className="wrap" style={{ position: 'relative', zIndex: 2, paddingTop: 80, paddingBottom: 64 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'start' }}>
            {/* LEFT: story */}
            <div>
              <div className="reveal reveal-1" style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                <span className="chip gold">Top Story</span>
                <span className="chip" style={{ background: 'transparent', color: 'var(--paper)', borderColor: 'var(--rule-light)' }}>
                  Match Report
                </span>
              </div>
              <h1 className="reveal reveal-2 h-editorial" style={{
                fontSize: 'clamp(48px, 6vw, 96px)',
                fontWeight: 400, marginBottom: 40, textWrap: 'balance',
                lineHeight: 1.1,
              }}>
                Whitlock brace seals<br/>derby spoils
              </h1>
              <p className="reveal reveal-3" style={{
                fontSize: 18, opacity: 0.8, maxWidth: 560, marginBottom: 40, textWrap: 'pretty',
              }}>
                Joe Whitlock struck twice as a clinical Welfare performance moved the side within four points of leaders Clipstone, with three games in hand on the chasing pack.
              </p>
              <div className="reveal reveal-4" style={{ display: 'flex', gap: 16 }}>
                <a href="article.html" className="btn" style={{ background: 'var(--gold)', color: 'var(--ink)', borderColor: 'var(--gold)' }}>
                  Read Report →
                </a>
                <a href="#" className="btn ghost-light">Highlights</a>
              </div>

              <div className="reveal reveal-5" style={{
                marginTop: 72, paddingTop: 32, borderTop: '1px solid var(--rule-light)',
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
              }}>
                {[
                  ['League Pos.', '2nd'],
                  ['Points', '67'],
                  ['Form', 'WWDLW'],
                  ['Top Scorer', 'Whitlock · 18'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 8 }}>{k}</div>
                    <div className="h-display mono-num" style={{ fontSize: 28, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: next match card + crest reveal */}
            <div className="reveal reveal-3">
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <img src="assets/crest.png" alt="BWFC crest"
                     className="crest-reveal"
                     style={{ height: 180, width: 'auto', margin: '0 auto',
                       filter: 'drop-shadow(0 0 40px rgba(212,162,76,0.25))' }}/>
              </div>
              <div style={{
                background: 'var(--ink-2)', border: '1px solid var(--rule-light)',
                padding: 32,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span className="eyebrow" style={{ color: 'var(--gold)' }}>Next Match</span>
                  <span className="chip" style={{ background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' }}>
                    <span className="chip-dot"/>Tickets Live
                  </span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 24, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {next.comp} · {next.round}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                  <div style={{ textAlign: 'center' }}>
                    <img src="assets/crest.png" style={{ height: 56, margin: '0 auto 10px' }}/>
                    <div className="h-display" style={{ fontSize: 16, fontWeight: 600 }}>Blidworth W.</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div className="h-display mono-num" style={{ fontSize: 28, fontWeight: 400, opacity: 0.5 }}>VS</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      height: 56, width: 56, margin: '0 auto 10px',
                      background: 'repeating-linear-gradient(45deg, #d4a24c 0 6px, #a77f35 6px 12px)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--ink)',
                    }}>ASH</div>
                    <div className="h-display" style={{ fontSize: 16, fontWeight: 600 }}>Ashfield Town</div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--rule-light)', paddingTop: 20, marginBottom: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                    Sat 25 April · 15:00 · Welfare Ground
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--rule-light)', paddingTop: 24, marginBottom: 24 }}>
                  <div className="eyebrow" style={{ opacity: 0.6, marginBottom: 16, textAlign: 'center' }}>
                    Kick-off in
                  </div>
                  <Countdown target={next.kickoff} compact onDark/>
                </div>
                <a href="tickets.html" className="btn red" style={{ width: '100%', justifyContent: 'center' }}>
                  Buy Tickets →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIXTURES STRIP */}
      <section style={{ background: 'var(--paper-2)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 24, overflowX: 'auto' }}>
          <div className="eyebrow" style={{ flexShrink: 0 }}>Fixtures</div>
          {d.fixtures.slice(0, 4).map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 24, borderRight: i < 3 ? '1px solid var(--rule)' : 'none', flexShrink: 0 }}>
              <div className="eyebrow mono-num" style={{ opacity: 0.6 }}>
                {new Date(f.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {f.home === 'Blidworth Welfare' ? 'BWFC' : f.home.split(' ')[0]} v {f.away === 'Blidworth Welfare' ? 'BWFC' : f.away.split(' ')[0]}
              </div>
              <span className="chip" style={{ fontSize: 9 }}>{f.venue}</span>
            </div>
          ))}
          <a href="fixtures.html" className="btn sm ghost" style={{ marginLeft: 'auto', flexShrink: 0 }}>All fixtures →</a>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section style={{ padding: '96px 0' }}>
        <div className="wrap">
          <SectionHeader eyebrow="Latest" title="The Newsroom"
            action={{ label: 'All News', href: 'news.html' }}/>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 32 }}>
            <NewsCard item={d.news[0]} size="xl"/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <NewsCard item={d.news[1]} size="md"/>
              <NewsCard item={d.news[2]} size="md"/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <NewsCard item={d.news[3]} size="md"/>
              <NewsCard item={d.news[4]} size="md"/>
            </div>
          </div>
        </div>
      </section>

      {/* LEAGUE TABLE + FORM */}
      <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '96px 0' }}>
        <div className="wrap">
          <SectionHeader eyebrow="CMA North · 2025/26" title="Where we stand"
            action={{ label: 'Full Table', href: 'table.html' }} onDark/>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 48 }}>
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--rule-light)' }}>
                    {['#', 'Club', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map(h => (
                      <th key={h} style={{
                        padding: '14px 8px', textAlign: h === 'Club' ? 'left' : 'center',
                        fontFamily: 'var(--font-display)', fontWeight: 500,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        fontSize: 11, opacity: 0.6,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.table.slice(0, 8).map(r => (
                    <tr key={r.team} style={{
                      borderBottom: '1px solid var(--rule-light)',
                      background: r.self ? 'rgba(212,162,76,0.08)' : 'transparent',
                    }}>
                      <td style={{ padding: '14px 8px', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {r.pos <= 1 && <div style={{ width: 3, height: 20, background: 'var(--gold)' }}/>}
                          {r.pos === 2 && <div style={{ width: 3, height: 20, background: 'var(--gold)', opacity: 0.5 }}/>}
                          {r.pos >= 12 && <div style={{ width: 3, height: 20, background: 'var(--red)' }}/>}
                          {r.pos}
                        </div>
                      </td>
                      <td style={{ padding: '14px 8px', fontWeight: r.self ? 700 : 500, color: r.self ? 'var(--gold)' : 'inherit' }}>{r.team}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.p}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.w}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.d}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.l}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.gd > 0 ? '+' + r.gd : r.gd}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 20 }}>Recent Form</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                {['W', 'W', 'D', 'L', 'W'].map((f, i) => (
                  <div key={i} style={{
                    width: 48, height: 48,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: f === 'W' ? 'var(--green)' : f === 'D' ? '#8a7b4a' : 'var(--red)',
                    color: '#fff',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
                  }}>{f}</div>
                ))}
              </div>
              <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 16 }}>Last Five</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {d.results.slice(0, 5).map((r, i) => {
                  const home = r.home === 'Blidworth Welfare';
                  const wld = home ? (r.hs > r.as ? 'W' : r.hs < r.as ? 'L' : 'D') : (r.as > r.hs ? 'W' : r.as < r.hs ? 'L' : 'D');
                  const col = wld === 'W' ? 'var(--green)' : wld === 'D' ? '#8a7b4a' : 'var(--red)';
                  return (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: 'auto 1fr auto',
                      alignItems: 'center', gap: 16,
                      padding: '10px 0', borderBottom: '1px solid var(--rule-light)',
                    }}>
                      <div style={{ width: 4, height: 32, background: col }}/>
                      <div style={{ fontSize: 13 }}>
                        <div style={{ fontWeight: 600 }}>
                          {home ? r.away : r.home} <span style={{ opacity: 0.5 }}>({home ? 'H' : 'A'})</span>
                        </div>
                        <div style={{ opacity: 0.5, fontSize: 11, marginTop: 2 }}>
                          {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {r.comp}
                        </div>
                      </div>
                      <div className="h-display mono-num" style={{ fontSize: 20, fontWeight: 600 }}>
                        {r.hs}-{r.as}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CENTENARY TILE + SHOP */}
      <section style={{ padding: '96px 0', background: 'var(--paper)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32, minHeight: 520 }}>
            <div style={{
              background: 'var(--ink)', color: 'var(--paper)',
              padding: 56, position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{
                position: 'absolute', right: -80, top: -80,
                width: 420, height: 420,
                background: 'radial-gradient(circle, rgba(212,162,76,0.25) 0%, transparent 70%)',
              }}/>
              <div style={{ position: 'relative' }}>
                <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 20 }}>1926 — 2026</div>
                <h2 className="h-editorial" style={{ fontSize: 72, fontWeight: 400, textWrap: 'balance', marginBottom: 20 }}>
                  One hundred years<br/>at the Welfare.
                </h2>
                <p style={{ fontSize: 16, opacity: 0.75, maxWidth: 480, marginBottom: 32 }}>
                  A season-long celebration of a century of football in Blidworth. Heritage matches, archive exhibitions, and a commemorative kit honouring the generations who built this club.
                </p>
              </div>
              <div style={{ position: 'relative', display: 'flex', gap: 12 }}>
                <a href="#" className="btn" style={{ background: 'var(--gold)', color: 'var(--ink)', borderColor: 'var(--gold)' }}>Centenary Programme</a>
                <a href="#" className="btn ghost-light">Our History</a>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 32 }}>
              <a href="shop.html" className="ph gold" style={{ padding: 32, textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
                  <span className="eyebrow">Club Shop · New</span>
                  <div>
                    <div className="h-display" style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Centenary Home Shirt</div>
                    <div style={{ fontSize: 14, opacity: 0.85 }}>Heritage black w/ gold trim — £42 →</div>
                  </div>
                </div>
              </a>
              <a href="lotto.html" className="ph red" style={{ padding: 32, textDecoration: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
                  <span className="eyebrow">Welfare Lotto</span>
                  <div>
                    <div className="h-display" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1 }}>Coming soon.</div>
                    <div style={{ fontSize: 14, opacity: 0.85, marginTop: 8 }}>Launching Autumn 2026 · Get early access →</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL FEED */}
      <section style={{ padding: '96px 0', background: 'var(--paper-2)' }}>
        <div className="wrap">
          <SectionHeader eyebrow="Follow" title="@BlidworthWFC"
            action={{ label: 'All socials', href: '#' }}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {d.socials.map((s, i) => <SocialItem key={i} s={s}/>)}
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <SponsorStrip sponsors={d.sponsors}/>
    </div>
  );
}

window.HomeClassic = HomeClassic;
