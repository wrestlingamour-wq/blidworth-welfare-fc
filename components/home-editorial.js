// Homepage V3 — EDITORIAL
// Newspaper / magazine feel. Heavy serif, asymmetric columns, large numerals,
// byline-style headers, deep verticals. Almost print-like.

function HomeEditorial() {
  const d = BW_DATA;
  const next = d.nextMatch;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '3px double var(--ink)',
      padding: '20px 0 16px',
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-editorial)',
      fontStyle: 'italic',
      fontSize: 14
    }
  }, "Saturday \xB7 18 April 2026 \xB7 No. MMXXVI"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-editorial",
    style: {
      fontSize: 14,
      fontStyle: 'italic',
      opacity: 0.7
    }
  }, "Founded 1926")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      fontFamily: 'var(--font-editorial)',
      fontStyle: 'italic',
      fontSize: 14
    }
  }, "The Welfare Ground \xB7 Blidworth, Notts."))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--ink)',
      padding: '32px 0',
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/crest.png",
    className: "crest-reveal",
    style: {
      height: 120
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "h-editorial reveal reveal-1",
    style: {
      fontSize: 'clamp(72px, 10vw, 160px)',
      fontWeight: 400,
      lineHeight: 0.9,
      letterSpacing: '-0.02em'
    }
  }, "The Welfare"), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow reveal reveal-2",
    style: {
      marginTop: 8,
      letterSpacing: '0.3em',
      fontSize: 13
    }
  }, "The Official Journal of Blidworth Welfare Football Club")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '64px 0 96px',
      borderBottom: '1px solid var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 2.2fr 1fr',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      borderRight: '1px solid var(--rule)',
      paddingRight: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 16,
      color: 'var(--red)'
    }
  }, "Next Fixture"), /*#__PURE__*/React.createElement("div", {
    className: "h-editorial",
    style: {
      fontSize: 28,
      fontWeight: 400,
      textWrap: 'balance',
      marginBottom: 8
    }
  }, "BWFC ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "v"), " Ashfield Town"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: 0.7,
      marginBottom: 24
    }
  }, "Sat 25 April \xB7 15:00 kick-off", /*#__PURE__*/React.createElement("br", null), "Welfare Ground \xB7 CMA North"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--rule)',
      paddingTop: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      opacity: 0.5,
      marginBottom: 12
    }
  }, "Countdown"), /*#__PURE__*/React.createElement(Countdown, {
    target: next.kickoff,
    compact: true
  })), /*#__PURE__*/React.createElement("a", {
    href: "tickets.html",
    className: "btn red sm",
    style: {
      width: '100%',
      justifyContent: 'center'
    }
  }, "Buy Tickets \u2192"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      paddingTop: 24,
      borderTop: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--red)',
      marginBottom: 16
    }
  }, "Last Five"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 20
    }
  }, ['W', 'W', 'D', 'L', 'W'].map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: f === 'W' ? 'var(--ink)' : f === 'D' ? 'var(--paper-2)' : 'var(--red)',
      color: f === 'D' ? 'var(--ink)' : '#fff',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 14,
      border: '1px solid var(--ink)'
    }
  }, f))), d.results.slice(0, 3).map((r, i) => {
    const home = r.home === 'Blidworth Welfare';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        padding: '10px 0',
        borderBottom: '1px dotted var(--rule)',
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        marginBottom: 2
      }
    }, home ? 'v' : '@', " ", home ? r.away : r.home), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        opacity: 0.6,
        fontSize: 11
      }
    }, /*#__PURE__*/React.createElement("span", null, new Date(r.date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    })), /*#__PURE__*/React.createElement("span", {
      className: "mono-num"
    }, r.hs, "\u2013", r.as)));
  }))), /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--red)',
      marginBottom: 24
    }
  }, "\u2605 Match Report \xB7 CMA North \xB7 Matchday 31"), /*#__PURE__*/React.createElement("h2", {
    className: "h-editorial reveal reveal-1",
    style: {
      fontSize: 'clamp(48px, 5.5vw, 88px)',
      fontWeight: 400,
      lineHeight: 0.96,
      textWrap: 'balance',
      marginBottom: 24
    }
  }, "Whitlock's double seals derby day spoils over Rainworth."), /*#__PURE__*/React.createElement("div", {
    className: "h-editorial",
    style: {
      fontSize: 22,
      fontStyle: 'italic',
      textWrap: 'balance',
      marginBottom: 32,
      opacity: 0.8
    }
  }, "A clinical Welfare performance closes the gap on Clipstone to four points \u2014 with three matches in hand on the chasing pack."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      fontSize: 13,
      marginBottom: 32,
      opacity: 0.6
    }
  }, /*#__PURE__*/React.createElement("span", null, "By ", /*#__PURE__*/React.createElement("em", null, "James Holbrook")), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "11 April 2026"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "4 min read")), /*#__PURE__*/React.createElement("div", {
    className: "ph",
    style: {
      height: 480,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ph-label"
  }, "[ photo: Whitlock wheels away, crowd behind ]")), /*#__PURE__*/React.createElement("div", {
    style: {
      columnCount: 2,
      columnGap: 32,
      fontSize: 15,
      lineHeight: 1.7,
      textWrap: 'pretty'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-editorial)',
      fontSize: 72,
      float: 'left',
      lineHeight: 0.85,
      marginRight: 8,
      marginTop: 4
    }
  }, "T"), "here are games a club needs, and then there are the ones it needs to win well. Saturday, against a Rainworth Miners Welfare side unbeaten in six, was the latter \u2014 and the Welfare answered in the kind of forthright, professional performance that has defined Dan Mellors' tenure."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 16
    }
  }, "Joe Whitlock's opener inside fifteen minutes set the tone: Callum Parr riding a challenge in midfield before sliding a pass that Whitlock, with characteristic composure, tucked under the advancing keeper."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 16
    }
  }, "Parr made it two early in the second half with a fierce strike from the edge of the area, before Whitlock's second \u2014 a header from a Barrett cross \u2014 put the game beyond doubt with twelve minutes still to play."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 16
    }
  }, "Rainworth's late consolation did little to flatter their afternoon, and the Welfare head into the run-in with three points, clean sheets banked, and Clipstone's lead shrinking ahead of a titanic month of fixtures."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 16,
      fontStyle: 'italic'
    }
  }, "\"We've a group that believes. That's the difference this season\" \u2014 ", /*#__PURE__*/React.createElement("em", null, "Dan Mellors, post-match."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      paddingTop: 20,
      borderTop: '1px solid var(--rule)',
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "article.html",
    className: "btn sm ghost"
  }, "Full Report \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "btn sm ghost"
  }, "Player Ratings"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "btn sm ghost"
  }, "Highlights"))), /*#__PURE__*/React.createElement("aside", {
    style: {
      borderLeft: '1px solid var(--rule)',
      paddingLeft: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--red)',
      marginBottom: 20
    }
  }, "In This Edition"), d.news.slice(1, 5).map((n, i) => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    href: "article.html",
    style: {
      display: 'block',
      padding: '20px 0',
      borderBottom: i < 3 ? '1px solid var(--rule)' : 'none',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      opacity: 0.5,
      marginBottom: 8,
      fontSize: 10
    }
  }, n.cat), /*#__PURE__*/React.createElement("h3", {
    className: "h-editorial",
    style: {
      fontSize: 22,
      fontWeight: 400,
      textWrap: 'balance',
      marginBottom: 8
    }
  }, n.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.6
    }
  }, new Date(n.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      padding: 24,
      background: 'var(--ink)',
      color: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 12
    }
  }, "Centenary"), /*#__PURE__*/React.createElement("div", {
    className: "h-editorial",
    style: {
      fontSize: 24,
      textWrap: 'balance',
      marginBottom: 16
    }
  }, "1926 \u2014 2026. One hundred years at the Welfare."), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--gold)',
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, "The Programme \u2192")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0',
      borderBottom: '1px solid var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--red)',
      marginBottom: 16
    }
  }, "The Table \xB7 Central Midlands North"), /*#__PURE__*/React.createElement("h2", {
    className: "h-editorial",
    style: {
      fontSize: 56,
      fontWeight: 400,
      marginBottom: 32
    }
  }, "Second, and ready."), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid var(--ink)'
    }
  }, ['#', 'Club', 'P', 'W', 'D', 'L', 'Pts'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: '10px 8px',
      textAlign: h === 'Club' ? 'left' : 'center',
      fontFamily: 'var(--font-editorial)',
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: 13,
      opacity: 0.7
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, d.table.slice(0, 6).map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.team,
    style: {
      borderBottom: '1px solid var(--rule)',
      background: r.self ? 'rgba(10,10,10,0.04)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 8px',
      fontVariantNumeric: 'tabular-nums',
      fontWeight: 600
    }
  }, r.pos), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 8px',
      fontWeight: r.self ? 700 : 500,
      fontFamily: r.self ? 'var(--font-editorial)' : 'inherit',
      fontStyle: r.self ? 'italic' : 'normal',
      fontSize: r.self ? 18 : 14
    }
  }, r.team), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 8px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.p), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 8px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.w), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 8px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.d), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 8px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.l), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 8px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums',
      fontWeight: 700,
      fontSize: 16
    }
  }, r.pts)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--red)',
      marginBottom: 16
    }
  }, "By The Numbers \xB7 2025/26"), /*#__PURE__*/React.createElement("h2", {
    className: "h-editorial",
    style: {
      fontSize: 56,
      fontWeight: 400,
      marginBottom: 40
    }
  }, "A season in figures."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 32
    }
  }, [['18', 'Goals by Whitlock, the division\'s top scorer'], ['11', 'Clean sheets kept by Aaron Finch'], ['2.16', 'Points per game — second only to Clipstone'], ['47%', 'Avg. possession across the season'], ['66', 'Goals scored — a club record in pursuit'], ['4', 'Point gap to the division summit']].map(([n, caption]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      borderTop: '1px solid var(--ink)',
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-editorial",
    style: {
      fontSize: 88,
      fontWeight: 400,
      lineHeight: 0.9,
      marginBottom: 12
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: 0.7,
      textWrap: 'pretty'
    }
  }, caption)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0',
      borderBottom: '1px solid var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "shop.html",
    style: {
      padding: 56,
      background: 'var(--ink)',
      color: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 360
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 16
    }
  }, "Advertisement \xB7 Club Shop"), /*#__PURE__*/React.createElement("div", {
    className: "h-editorial",
    style: {
      fontSize: 48,
      fontWeight: 400,
      textWrap: 'balance',
      marginBottom: 16
    }
  }, "The centenary home shirt."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      opacity: 0.75,
      maxWidth: 320
    }
  }, "Heritage black, embroidered crest in commemorative gold. Limited run of 1,926.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-display mono-num",
    style: {
      fontSize: 48
    }
  }, "\xA342"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--gold)',
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "Pre-order now \u2192"))), /*#__PURE__*/React.createElement("a", {
    href: "lotto.html",
    style: {
      padding: 56,
      border: '1px solid var(--ink)',
      color: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 360,
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--red)',
      marginBottom: 16
    }
  }, "Welfare Lotto"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-editorial)',
      fontStyle: 'italic',
      fontSize: 18,
      opacity: 0.7,
      marginBottom: 8
    }
  }, "In development"), /*#__PURE__*/React.createElement("div", {
    className: "h-display",
    style: {
      fontSize: 96,
      fontWeight: 700,
      lineHeight: 0.9,
      letterSpacing: '-0.02em',
      textWrap: 'balance'
    }
  }, "Coming soon.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      opacity: 0.7,
      marginBottom: 12
    }
  }, "Weekly \xA31 draw launching Autumn 2026. All proceeds will support the youth academy and ground improvements."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Get Early Access \u2192")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--ink)',
      paddingBottom: 16,
      marginBottom: 40,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h-editorial",
    style: {
      fontSize: 48,
      fontWeight: 400
    }
  }, "Dispatches ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      opacity: 0.5
    }
  }, "from the socials")), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--red)'
    }
  }, "@BlidworthWFC")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 0,
      border: '1px solid var(--ink)'
    }
  }, d.socials.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: 24,
      borderRight: i < 3 ? '1px solid var(--ink)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px dotted var(--rule)',
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-editorial)',
      fontStyle: 'italic',
      fontSize: 14
    }
  }, s.platform), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      opacity: 0.5,
      fontSize: 10
    }
  }, s.when)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.5
    }
  }, s.text), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      fontSize: 12,
      opacity: 0.5
    }
  }, s.handle)))))), /*#__PURE__*/React.createElement(SponsorStrip, {
    sponsors: d.sponsors
  }));
}
window.HomeEditorial = HomeEditorial;
