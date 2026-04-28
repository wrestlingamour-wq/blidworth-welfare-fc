// Homepage V2 — MODERN
// Bold split-screen hero, huge type, heavy grid, live match widget
// Feels digital-first, broadcast-graphic inspired, lots of motion

function SocialEmbeds() {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    // X / Twitter timeline
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load(containerRef.current);
    } else {
      const s = document.createElement('script');
      s.src = 'https://platform.twitter.com/widgets.js';
      s.async = true;
      s.charset = 'utf-8';
      document.head.appendChild(s);
    }
    // Facebook Page Plugin
    if (window.FB) {
      window.FB.XFBML.parse(containerRef.current);
    } else if (!document.getElementById('facebook-jssdk')) {
      const fb = document.createElement('script');
      fb.id = 'facebook-jssdk';
      fb.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v21.0';
      fb.async = true;
      fb.defer = true;
      fb.crossOrigin = 'anonymous';
      document.head.appendChild(fb);
    }
  }, []);

  return (
    <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginTop: 48 }}>
      <div style={{ minHeight: 500 }}>
        <a className="twitter-timeline"
           data-height="500"
           data-chrome="noheader nofooter"
           href="https://x.com/BlidworthFC">
          Tweets by @BlidworthFC
        </a>
      </div>
      <div style={{ minHeight: 500 }}>
        <div id="fb-root"></div>
        <div className="fb-page"
             data-href="https://www.facebook.com/blidworthwelfarefc"
             data-tabs="timeline"
             data-width=""
             data-height="500"
             data-small-header="true"
             data-adapt-container-width="true"
             data-hide-cover="false"
             data-show-facepile="false">
        </div>
      </div>
    </div>
  );
}

function ordinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}
function HomeModern() {
  const d = BW_DATA;
  const next = d.nextMatch;
  const [hoverNews, setHoverNews] = React.useState(null);

  // ── Derive live stats from the synced table ──────────────────────────────
  const self = (d.table || []).find(r => r.self) || { pos: 16, p: 0, w: 0, d: 0, l: 0, gd: 0, pts: 0 };
  const totalTeams = (d.table || []).length || 18;
  const maxGames = Math.max(...(d.table || []).map(r => r.p || 0), 0);
  const toGo = Math.max(0, (totalTeams - 1) * 2 - self.p); // rough round-robin estimate

  // Opponent lookup for position chip
  const oppName = /blidworth/i.test(next.home?.name || '') ? next.away?.name : next.home?.name;
  const opp = (d.table || []).find(r => r.team === oppName);
  const isHomeFixture = /blidworth/i.test(next.home?.name || '');

  // Kick-off date formatting — always reflects synced nextMatch
  const ko = new Date(next.kickoff);
  const koDate = ko.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase();
  const koTime = ko.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  return (
    <div>
      {/* HERO — split screen: massive wordmark left, match takeover right */}
      <section style={{
        background: 'var(--paper)', position: 'relative',
        minHeight: 820, display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
      }}>
        {/* LEFT */}
        <div style={{
          padding: '80px 56px 80px 80px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', borderRight: '1px solid var(--rule)',
        }}>
          <div>
            <div className="reveal reveal-1" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
              <img src="assets/crest.png" className="crest-reveal"
                   style={{ height: 64 }}/>
              <div className="eyebrow">Centenary Season · 2026/27</div>
            </div>

            <div className="reveal reveal-2">
              <h1 className="h-display" style={{
                fontSize: 'clamp(80px, 11vw, 200px)',
                fontWeight: 700, lineHeight: 0.86,
                letterSpacing: '-0.03em',
              }}>
                THE<br/>
                <span style={{
                  WebkitTextStroke: '2px var(--ink)',
                  WebkitTextFillColor: 'transparent',
                  fontStyle: 'italic',
                }}>WEL</span><span>FARE</span>
              </h1>
            </div>

            <p className="reveal reveal-3 h-editorial" style={{
              fontSize: 32, fontWeight: 400, marginTop: 40,
              maxWidth: 520, textWrap: 'balance',
            }}>
              One hundred years of football in the heart of Nottinghamshire.
            </p>
          </div>

          <div className="reveal reveal-4" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0, marginTop: 64,
            borderTop: '1px solid var(--rule)',
          }}>
            {[
              ['Est.', '1926'],
              ['Position', ordinal(self.pos)],
              ['Points', String(self.pts)],
              ['Played', String(self.p)],
            ].map(([k, v], i) => (

              <div key={k} style={{
                padding: '24px 20px',
                borderRight: i < 3 ? '1px solid var(--rule)' : 'none',
              }}>
                <div className="eyebrow" style={{ opacity: 0.5, marginBottom: 8 }}>{k}</div>
                <div className="h-display mono-num" style={{ fontSize: 32, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — match takeover */}
        <div style={{
          background: 'var(--ink)', color: 'var(--paper)',
          padding: '80px 56px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Diagonal accent */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 240, height: 240,
            background: 'var(--gold)', transform: 'rotate(45deg) translate(50%, -50%)',
            transformOrigin: 'top right',
          }}/>

          <div className="reveal reveal-2" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              {next.tickets !== false && (
                <span className="chip" style={{ background: 'var(--red)', borderColor: 'var(--red)', color: '#fff' }}>
                  <span className="chip-dot"/> TICKETS LIVE
                </span>
              )}
              <span className="eyebrow" style={{ opacity: 0.7 }}>{next.comp || 'Camper UK Premier South'}</span>
            </div>
            <div className="h-display" style={{ fontSize: 14, opacity: 0.6, marginBottom: 24 }}>
              {koDate} · {koTime}
            </div>

            {(() => {
              const oppShort = (isHomeFixture ? next.away?.short : next.home?.short) || 'OPP';
              const oppFull = (oppName || 'Opponent').toUpperCase();
              const words = oppFull.split(' ');
              const splitPt = Math.ceil(words.length / 2);
              const oppLine1 = words.slice(0, splitPt).join(' ');
              const oppLine2 = words.slice(splitPt).join(' ');
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
                  <div>
                    <img src="assets/crest.png" style={{ height: 96, marginBottom: 16 }}/>
                    <div className="h-display" style={{ fontSize: 36, fontWeight: 700, lineHeight: 0.95 }}>
                      BLIDWORTH
                    </div>
                    <div className="eyebrow" style={{ marginTop: 12, opacity: 0.6 }}>{isHomeFixture ? 'Home' : 'Away'} · {ordinal(self.pos)}</div>
                  </div>
                  <div>
                    {(() => {
                      const oppLogo = isHomeFixture ? next.away?.logo : next.home?.logo;
                      return oppLogo
                        ? <img src={oppLogo} style={{ height: 96, width: 96, objectFit: 'contain', marginBottom: 16 }} />
                        : <div style={{
                            height: 96, width: 96, marginBottom: 16,
                            background: 'repeating-linear-gradient(45deg, #d4a24c 0 8px, #a77f35 8px 16px)',
                            border: '2px solid var(--paper)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)',
                          }}>{oppShort}</div>;
                    })()}
                    <div className="h-display" style={{ fontSize: 36, fontWeight: 700, lineHeight: 0.95 }}>
                      {oppLine1}{oppLine2 && <><br/>{oppLine2}</>}
                    </div>
                    <div className="eyebrow" style={{ marginTop: 12, opacity: 0.6 }}>{isHomeFixture ? 'Away' : 'Home'} · {opp ? ordinal(opp.pos) : '—'}</div>
                  </div>
                </div>
              );
            })()}


          </div>

          <div style={{ borderTop: '1px solid var(--rule-light)', paddingTop: 32, marginBottom: 32, position: 'relative', zIndex: 1 }}>
            <div className="eyebrow" style={{ opacity: 0.6, marginBottom: 20 }}>Kick-off in</div>
            <Countdown target={next.kickoff} onDark/>
          </div>

          <div className="reveal reveal-3" style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 12 }}>
            <a href="tickets.html" className="btn red" style={{ flex: 1, justifyContent: 'center' }}>Buy Tickets →</a>
            <a href="#" className="btn ghost-light" style={{ flex: 1, justifyContent: 'center' }}>Matchday Info</a>
          </div>
        </div>
      </section>

      {/* MARQUEE DIVIDER */}
      <div style={{
        background: 'var(--gold)', color: 'var(--ink)',
        padding: '20px 0', overflow: 'hidden',
        borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)',
      }}>
        <div style={{
          display: 'flex', gap: 48, whiteSpace: 'nowrap',
          animation: 'ticker 60s linear infinite',
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
          letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          {Array(12).fill(0).map((_, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
              UP THE WELFARE <span>★</span> SINCE 1926 <span>★</span> 100 YEARS STRONG <span>★</span>
            </span>
          ))}
        </div>
      </div>

      {/* NEWS GRID — modular, asymmetric, lots of hover motion */}
      <section style={{ padding: '96px 0', background: 'var(--paper)' }}>
        <div className="wrap">
          <SectionHeader eyebrow="Newsfeed" title="What's happening"
            action={{ label: 'All News', href: 'news.html' }} size="lg"/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24, gridAutoRows: 'minmax(280px, auto)' }}>
            {d.news.map((n, i) => {
              const layouts = [
                { gridColumn: 'span 3', gridRow: 'span 2', size: 'xl' },
                { gridColumn: 'span 3', gridRow: 'span 1', size: 'md' },
                { gridColumn: 'span 3', gridRow: 'span 1', size: 'md' },
                { gridColumn: 'span 2', gridRow: 'span 1', size: 'sm' },
                { gridColumn: 'span 2', gridRow: 'span 1', size: 'sm' },
                { gridColumn: 'span 2', gridRow: 'span 1', size: 'sm' },
              ];
              const l = layouts[i] || layouts[5];
              return (
                <div key={n.id} style={l}
                  onMouseEnter={() => setHoverNews(i)}
                  onMouseLeave={() => setHoverNews(null)}>
                  <a href={`article.html?id=${n.id}`} style={{
                    display: 'flex', flexDirection: 'column', height: '100%',
                    color: 'var(--ink)', overflow: 'hidden',
                    background: 'var(--white)', border: '1px solid var(--rule)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    transform: hoverNews === i ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: hoverNews === i ? '0 20px 40px rgba(0,0,0,0.08)' : 'none',
                  }}>
                    {n.photos && n.photos[0]
                      ? <img src={n.photos[0]} style={{ flex: 1, minHeight: 160, width: '100%', objectFit: 'cover', display: 'block' }} />
                      : <div className="ph" style={{ flex: 1, minHeight: 160 }}><span className="ph-label">[ {n.img || 'photo'} ]</span></div>
                    }
                    <div style={{ padding: 20 }}>
                      <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 8 }}>{n.cat}</div>
                      <h3 className="h-editorial" style={{
                        fontSize: l.size === 'xl' ? 40 : l.size === 'md' ? 22 : 16,
                        fontWeight: 400, textWrap: 'balance', marginBottom: 8,
                      }}>{n.title}</h3>
                      {l.size !== 'sm' && <p style={{ fontSize: 13, opacity: 0.7 }}>{n.kicker}</p>}
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEAGUE TABLE — horizontal sprawl */}
      <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 280, opacity: 0.04, color: 'var(--gold)',
          letterSpacing: '-0.05em', lineHeight: 0.85,
        }}>PREMIER<br/>SOUTH</div>

        <div className="wrap" style={{ position: 'relative' }}>
          <SectionHeader eyebrow="Standings" title="Camper UK · Premier Division South"
            action={{ label: 'Full Table', href: 'table.html' }} onDark size="lg"/>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 56 }}>
            <div style={{ background: 'var(--ink-2)', padding: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr>
                    {['#', 'Club', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map(h => (
                      <th key={h} style={{
                        padding: '16px 10px', textAlign: h === 'Club' ? 'left' : 'center',
                        fontFamily: 'var(--font-display)', fontWeight: 500,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        fontSize: 11, opacity: 0.6,
                        borderBottom: '1px solid var(--rule-light)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.table.slice(0, 10).map(r => (
                    <tr key={r.team} style={{
                      background: r.self ? 'var(--gold)' : 'transparent',
                      color: r.self ? 'var(--ink)' : 'inherit',
                    }}>
                      <td style={{ padding: '14px 10px', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{r.pos}</td>
                      <td style={{ padding: '14px 10px', fontWeight: r.self ? 700 : 500 }}>{r.team}</td>
                      <td style={{ padding: '14px 10px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.p}</td>
                      <td style={{ padding: '14px 10px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.w}</td>
                      <td style={{ padding: '14px 10px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.d}</td>
                      <td style={{ padding: '14px 10px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.l}</td>
                      <td style={{ padding: '14px 10px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.gd > 0 ? '+' + r.gd : r.gd}</td>
                      <td style={{ padding: '14px 10px', textAlign: 'center', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: 16 }}>{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 24 }}>The Welfare · Season</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {[
                  ['Played', String(self.p)],
                  ['Wins', String(self.w)],
                  ['Draws', String(self.d)],
                  ['Losses', String(self.l)],
                  ['GD', self.gd > 0 ? '+' + self.gd : String(self.gd)],
                  ['Points', String(self.pts)],
                  ['Position', ordinal(self.pos)],
                  ['To Go', String(toGo)],
                ].map(([k, v]) => (
                  <div key={k} style={{ padding: '20px 20px', background: 'var(--ink-2)' }}>
                    <div className="eyebrow" style={{ opacity: 0.5, marginBottom: 6 }}>{k}</div>
                    <div className="h-display mono-num" style={{ fontSize: 28, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <a href="fixtures.html" className="btn ghost-light" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
                Full Fixtures & Results →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BIG TILES — SHOP / LOTTO / CENTENARY */}
      <section style={{ padding: '0', background: 'var(--paper)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
          <a href="shop.html" className="big-tile" style={{
            padding: '80px 48px', minHeight: 480, background: 'var(--ink)', color: 'var(--paper)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0,
              background: 'repeating-linear-gradient(135deg, #1a1a1a 0 16px, #0f0f0f 16px 32px)',
              opacity: 0.5 }}/>
            <div style={{ position: 'relative' }}>
              <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 16 }}>Club Shop</div>
              <div className="h-editorial" style={{ fontSize: 48, textWrap: 'balance' }}>
                The centenary shirt is here.
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="h-display mono-num" style={{ fontSize: 40 }}>£42</div>
              <span className="btn-arrow" style={{ fontSize: 28 }}>→</span>
            </div>
          </a>
          <a href="lotto.html" className="big-tile" style={{
            padding: '80px 48px', minHeight: 480, background: 'var(--red)', color: '#fff',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'relative' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Welfare Lotto</div>
              <div className="h-display" style={{ fontSize: 96, fontWeight: 700, lineHeight: 0.9, textWrap: 'balance' }}>
                Coming<br/><em style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontWeight: 400 }}>soon.</em>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 8 }}>
                Launching Autumn 2026 · £1/week · Friday draws
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>
                GET EARLY ACCESS →
              </div>
            </div>
          </a>
          <a href="#" className="big-tile" style={{
            padding: '80px 48px', minHeight: 480, background: 'var(--gold)', color: 'var(--ink)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'relative' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>1926 — 2026</div>
              <div className="h-editorial" style={{ fontSize: 48, textWrap: 'balance' }}>
                One hundred years at the Welfare.
              </div>
            </div>
            <div style={{ position: 'relative', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>
              CENTENARY PROGRAMME →
            </div>
          </a>
        </div>
      </section>

      {/* SOCIAL FEED */}
      <section style={{ padding: '96px 0' }}>
        <div className="wrap">
          <SectionHeader eyebrow="Follow the club" title="@BlidworthFC"
            action={{ label: 'Follow on X', href: 'https://x.com/BlidworthFC' }}/>
          <SocialEmbeds />
        </div>
      </section>

      <SponsorStrip sponsors={d.sponsors}/>
    </div>
  );
}

window.HomeModern = HomeModern;
