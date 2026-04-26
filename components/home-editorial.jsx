// Homepage V3 — EDITORIAL
// Newspaper / magazine feel. Heavy serif, asymmetric columns, large numerals,
// byline-style headers, deep verticals. Almost print-like.

function HomeEditorial() {
  const d = BW_DATA;
  const next = d.nextMatch;
  return (
    <div style={{ background: 'var(--paper)' }}>
      {/* MASTHEAD */}
      <div style={{
        borderBottom: '3px double var(--ink)', padding: '20px 0 16px',
        background: 'var(--paper)',
      }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24 }}>
          <div style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14 }}>
            Saturday · 18 April 2026 · No. MMXXVI
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="h-editorial" style={{ fontSize: 14, fontStyle: 'italic', opacity: 0.7 }}>Founded 1926</div>
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14 }}>
            The Welfare Ground · Blidworth, Notts.
          </div>
        </div>
      </div>

      {/* TITLE */}
      <div style={{ borderBottom: '1px solid var(--ink)', padding: '32px 0', background: 'var(--paper)' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'center' }}>
          <img src="assets/crest.png" className="crest-reveal" style={{ height: 120 }}/>
          <div style={{ textAlign: 'center' }}>
            <h1 className="h-editorial reveal reveal-1" style={{
              fontSize: 'clamp(72px, 10vw, 160px)',
              fontWeight: 400, lineHeight: 0.9, letterSpacing: '-0.02em',
            }}>
              The Welfare
            </h1>
            <div className="eyebrow reveal reveal-2" style={{ marginTop: 8, letterSpacing: '0.3em', fontSize: 13 }}>
              The Official Journal of Blidworth Welfare Football Club
            </div>
          </div>
        </div>
      </div>

      {/* FRONT PAGE */}
      <section style={{ padding: '64px 0 96px', borderBottom: '1px solid var(--ink)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.2fr 1fr', gap: 48 }}>
            {/* LEFT COLUMN — next match, pinned */}
            <aside style={{ borderRight: '1px solid var(--rule)', paddingRight: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--red)' }}>Next Fixture</div>
              <div className="h-editorial" style={{ fontSize: 28, fontWeight: 400, textWrap: 'balance', marginBottom: 8 }}>
                BWFC <span style={{ fontStyle: 'italic' }}>v</span> Ashfield Town
              </div>
              <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 24 }}>
                Sat 25 April · 15:00 kick-off<br/>
                Welfare Ground · CMA North
              </div>
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, marginBottom: 20 }}>
                <div className="eyebrow" style={{ opacity: 0.5, marginBottom: 12 }}>Countdown</div>
                <Countdown target={next.kickoff} compact/>
              </div>
              <a href="tickets.html" className="btn red sm" style={{ width: '100%', justifyContent: 'center' }}>Buy Tickets →</a>

              <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
                <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 16 }}>Last Five</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                  {['W', 'W', 'D', 'L', 'W'].map((f, i) => (
                    <div key={i} style={{
                      width: 32, height: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: f === 'W' ? 'var(--ink)' : f === 'D' ? 'var(--paper-2)' : 'var(--red)',
                      color: f === 'D' ? 'var(--ink)' : '#fff',
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                      border: '1px solid var(--ink)',
                    }}>{f}</div>
                  ))}
                </div>
                {d.results.slice(0, 3).map((r, i) => {
                  const home = r.home === 'Blidworth Welfare';
                  return (
                    <div key={i} style={{ padding: '10px 0', borderBottom: '1px dotted var(--rule)', fontSize: 13 }}>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>
                        {home ? 'v' : '@'} {home ? r.away : r.home}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6, fontSize: 11 }}>
                        <span>{new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                        <span className="mono-num">{r.hs}–{r.as}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* CENTRE — lead article */}
            <article>
              <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 24 }}>
                ★ Match Report · CMA North · Matchday 31
              </div>
              <h2 className="h-editorial reveal reveal-1" style={{
                fontSize: 'clamp(48px, 5.5vw, 88px)',
                fontWeight: 400, lineHeight: 0.96, textWrap: 'balance', marginBottom: 24,
              }}>
                Whitlock's double seals derby day spoils over Rainworth.
              </h2>
              <div className="h-editorial" style={{
                fontSize: 22, fontStyle: 'italic', textWrap: 'balance',
                marginBottom: 32, opacity: 0.8,
              }}>
                A clinical Welfare performance closes the gap on Clipstone to four points — with three matches in hand on the chasing pack.
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, marginBottom: 32, opacity: 0.6 }}>
                <span>By <em>James Holbrook</em></span>
                <span>·</span>
                <span>11 April 2026</span>
                <span>·</span>
                <span>4 min read</span>
              </div>
              <div className="ph" style={{ height: 480, marginBottom: 32 }}>
                <span className="ph-label">[ photo: Whitlock wheels away, crowd behind ]</span>
              </div>
              <div style={{
                columnCount: 2, columnGap: 32, fontSize: 15, lineHeight: 1.7,
                textWrap: 'pretty',
              }}>
                <p style={{ marginBottom: 16 }}>
                  <span style={{
                    fontFamily: 'var(--font-editorial)', fontSize: 72, float: 'left',
                    lineHeight: 0.85, marginRight: 8, marginTop: 4,
                  }}>T</span>
                  here are games a club needs, and then there are the ones it needs to win well. Saturday, against a Rainworth Miners Welfare side unbeaten in six, was the latter — and the Welfare answered in the kind of forthright, professional performance that has defined Dan Mellors' tenure.
                </p>
                <p style={{ marginBottom: 16 }}>
                  Joe Whitlock's opener inside fifteen minutes set the tone: Callum Parr riding a challenge in midfield before sliding a pass that Whitlock, with characteristic composure, tucked under the advancing keeper.
                </p>
                <p style={{ marginBottom: 16 }}>
                  Parr made it two early in the second half with a fierce strike from the edge of the area, before Whitlock's second — a header from a Barrett cross — put the game beyond doubt with twelve minutes still to play.
                </p>
                <p style={{ marginBottom: 16 }}>
                  Rainworth's late consolation did little to flatter their afternoon, and the Welfare head into the run-in with three points, clean sheets banked, and Clipstone's lead shrinking ahead of a titanic month of fixtures.
                </p>
                <p style={{ marginBottom: 16, fontStyle: 'italic' }}>
                  "We've a group that believes. That's the difference this season" — <em>Dan Mellors, post-match.</em>
                </p>
              </div>
              <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--rule)', display: 'flex', gap: 16 }}>
                <a href="article.html" className="btn sm ghost">Full Report →</a>
                <a href="#" className="btn sm ghost">Player Ratings</a>
                <a href="#" className="btn sm ghost">Highlights</a>
              </div>
            </article>

            {/* RIGHT — Mini digest */}
            <aside style={{ borderLeft: '1px solid var(--rule)', paddingLeft: 32 }}>
              <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 20 }}>In This Edition</div>

              {d.news.slice(1, 5).map((n, i) => (
                <a key={n.id} href="article.html" style={{
                  display: 'block', padding: '20px 0',
                  borderBottom: i < 3 ? '1px solid var(--rule)' : 'none',
                  color: 'var(--ink)',
                }}>
                  <div className="eyebrow" style={{ opacity: 0.5, marginBottom: 8, fontSize: 10 }}>{n.cat}</div>
                  <h3 className="h-editorial" style={{ fontSize: 22, fontWeight: 400, textWrap: 'balance', marginBottom: 8 }}>
                    {n.title}
                  </h3>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>
                    {new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                </a>
              ))}

              <div style={{
                marginTop: 32, padding: 24,
                background: 'var(--ink)', color: 'var(--paper)',
              }}>
                <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 12 }}>Centenary</div>
                <div className="h-editorial" style={{ fontSize: 24, textWrap: 'balance', marginBottom: 16 }}>
                  1926 — 2026. One hundred years at the Welfare.
                </div>
                <a href="#" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  The Programme →
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* SECOND PAGE — LEAGUE + STATISTICS */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--ink)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 16 }}>The Table · Central Midlands North</div>
              <h2 className="h-editorial" style={{ fontSize: 56, fontWeight: 400, marginBottom: 32 }}>
                Second, and ready.
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                    {['#', 'Club', 'P', 'W', 'D', 'L', 'Pts'].map(h => (
                      <th key={h} style={{
                        padding: '10px 8px', textAlign: h === 'Club' ? 'left' : 'center',
                        fontFamily: 'var(--font-editorial)', fontStyle: 'italic',
                        fontWeight: 400, fontSize: 13, opacity: 0.7,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.table.slice(0, 6).map(r => (
                    <tr key={r.team} style={{
                      borderBottom: '1px solid var(--rule)',
                      background: r.self ? 'rgba(10,10,10,0.04)' : 'transparent',
                    }}>
                      <td style={{ padding: '14px 8px', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{r.pos}</td>
                      <td style={{ padding: '14px 8px', fontWeight: r.self ? 700 : 500,
                        fontFamily: r.self ? 'var(--font-editorial)' : 'inherit',
                        fontStyle: r.self ? 'italic' : 'normal',
                        fontSize: r.self ? 18 : 14,
                      }}>{r.team}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.p}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.w}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.d}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.l}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: 16 }}>{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 16 }}>By The Numbers · 2025/26</div>
              <h2 className="h-editorial" style={{ fontSize: 56, fontWeight: 400, marginBottom: 40 }}>
                A season in figures.
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                {[
                  ['18', 'Goals by Whitlock, the division\'s top scorer'],
                  ['11', 'Clean sheets kept by Aaron Finch'],
                  ['2.16', 'Points per game — second only to Clipstone'],
                  ['47%', 'Avg. possession across the season'],
                  ['66', 'Goals scored — a club record in pursuit'],
                  ['4', 'Point gap to the division summit'],
                ].map(([n, caption]) => (
                  <div key={n} style={{ borderTop: '1px solid var(--ink)', paddingTop: 16 }}>
                    <div className="h-editorial" style={{ fontSize: 88, fontWeight: 400, lineHeight: 0.9, marginBottom: 12 }}>{n}</div>
                    <div style={{ fontSize: 13, opacity: 0.7, textWrap: 'pretty' }}>{caption}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP / LOTTO */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--ink)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <a href="shop.html" style={{
              padding: 56, background: 'var(--ink)', color: 'var(--paper)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: 360,
            }}>
              <div>
                <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 16 }}>Advertisement · Club Shop</div>
                <div className="h-editorial" style={{ fontSize: 48, fontWeight: 400, textWrap: 'balance', marginBottom: 16 }}>
                  The centenary home shirt.
                </div>
                <p style={{ fontSize: 14, opacity: 0.75, maxWidth: 320 }}>
                  Heritage black, embroidered crest in commemorative gold. Limited run of 1,926.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                <div className="h-display mono-num" style={{ fontSize: 48 }}>£42</div>
                <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Pre-order now →
                </div>
              </div>
            </a>
            <a href="lotto.html" style={{
              padding: 56, border: '1px solid var(--ink)', color: 'var(--ink)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: 360, background: 'var(--paper)',
            }}>
              <div>
                <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 16 }}>Welfare Lotto</div>
                <div style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 18, opacity: 0.7, marginBottom: 8 }}>
                  In development
                </div>
                <div className="h-display" style={{ fontSize: 96, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Coming soon.
                </div>
              </div>
              <div>
                <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 12 }}>
                  Weekly £1 draw launching Autumn 2026. All proceeds will support the youth academy and ground improvements.
                </p>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Get Early Access →
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL / DISPATCHES */}
      <section style={{ padding: '80px 0' }}>
        <div className="wrap">
          <div style={{ borderBottom: '1px solid var(--ink)', paddingBottom: 16, marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 className="h-editorial" style={{ fontSize: 48, fontWeight: 400 }}>
              Dispatches <span style={{ fontStyle: 'italic', opacity: 0.5 }}>from the socials</span>
            </h2>
            <div className="eyebrow" style={{ color: 'var(--red)' }}>@BlidworthWFC</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--ink)' }}>
            {d.socials.map((s, i) => (
              <div key={i} style={{
                padding: 24,
                borderRight: i < 3 ? '1px solid var(--ink)' : 'none',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dotted var(--rule)', paddingBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14 }}>
                    {s.platform}
                  </div>
                  <span className="eyebrow" style={{ opacity: 0.5, fontSize: 10 }}>{s.when}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.5 }}>{s.text}</p>
                <div style={{ marginTop: 'auto', fontSize: 12, opacity: 0.5 }}>{s.handle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SponsorStrip sponsors={d.sponsors}/>
    </div>
  );
}

window.HomeEditorial = HomeEditorial;
