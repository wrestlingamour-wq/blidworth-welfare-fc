// Homepage V1 — CLASSIC
// Dense, broadcast-style, takeover hero with crest reveal + countdown
// Traditional pro-club layout: hero, match strip, news grid, table, shop, community, social

function HomeClassic() {
  const d = BW_DATA;
  const next = d.nextMatch;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ink)',
      color: 'var(--paper)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 720
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph",
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.45,
      background: `repeating-linear-gradient(135deg, #1a1a1a 0 16px, #0f0f0f 16px 32px)`,
      zIndex: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ph-label",
    style: {
      position: 'absolute',
      bottom: 16,
      right: 16
    }
  }, "[ hero photo: Whitlock celebration, derby night ]")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.9) 100%)',
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative',
      zIndex: 2,
      paddingTop: 80,
      paddingBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 64,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "reveal reveal-1",
    style: {
      display: 'flex',
      gap: 12,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip gold"
  }, "Top Story"), /*#__PURE__*/React.createElement("span", {
    className: "chip",
    style: {
      background: 'transparent',
      color: 'var(--paper)',
      borderColor: 'var(--rule-light)'
    }
  }, "Match Report")), /*#__PURE__*/React.createElement("h1", {
    className: "reveal reveal-2 h-editorial",
    style: {
      fontSize: 'clamp(48px, 6vw, 96px)',
      fontWeight: 400,
      marginBottom: 40,
      textWrap: 'balance',
      lineHeight: 1.1
    }
  }, "Whitlock brace seals", /*#__PURE__*/React.createElement("br", null), "derby spoils"), /*#__PURE__*/React.createElement("p", {
    className: "reveal reveal-3",
    style: {
      fontSize: 18,
      opacity: 0.8,
      maxWidth: 560,
      marginBottom: 40,
      textWrap: 'pretty'
    }
  }, "Joe Whitlock struck twice as a clinical Welfare performance moved the side within four points of leaders Clipstone, with three games in hand on the chasing pack."), /*#__PURE__*/React.createElement("div", {
    className: "reveal reveal-4",
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "article.html",
    className: "btn",
    style: {
      background: 'var(--gold)',
      color: 'var(--ink)',
      borderColor: 'var(--gold)'
    }
  }, "Read Report \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "btn ghost-light"
  }, "Highlights")), /*#__PURE__*/React.createElement("div", {
    className: "reveal reveal-5",
    style: {
      marginTop: 72,
      paddingTop: 32,
      borderTop: '1px solid var(--rule-light)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 32
    }
  }, [['League Pos.', '2nd'], ['Points', '67'], ['Form', 'WWDLW'], ['Top Scorer', 'Whitlock · 18']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 8
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    className: "h-display mono-num",
    style: {
      fontSize: 28,
      fontWeight: 600
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    className: "reveal reveal-3"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/crest.png",
    alt: "BWFC crest",
    className: "crest-reveal",
    style: {
      height: 180,
      width: 'auto',
      margin: '0 auto',
      filter: 'drop-shadow(0 0 40px rgba(212,162,76,0.25))'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink-2)',
      border: '1px solid var(--rule-light)',
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)'
    }
  }, "Next Match"), /*#__PURE__*/React.createElement("span", {
    className: "chip",
    style: {
      background: 'var(--red)',
      color: '#fff',
      borderColor: 'var(--red)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip-dot"
  }), "Tickets Live")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.6,
      marginBottom: 24,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, next.comp, " \xB7 ", next.round), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: 16,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/crest.png",
    style: {
      height: 56,
      margin: '0 auto 10px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-display",
    style: {
      fontSize: 16,
      fontWeight: 600
    }
  }, "Blidworth W.")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-display mono-num",
    style: {
      fontSize: 28,
      fontWeight: 400,
      opacity: 0.5
    }
  }, "VS")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: 56,
      margin: '0 auto 10px',
      background: 'repeating-linear-gradient(45deg, #d4a24c 0 6px, #a77f35 6px 12px)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--ink)'
    }
  }, "ASH"), /*#__PURE__*/React.createElement("div", {
    className: "h-display",
    style: {
      fontSize: 16,
      fontWeight: 600
    }
  }, "Ashfield Town"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--rule-light)',
      paddingTop: 20,
      marginBottom: 20,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.6,
      marginBottom: 4
    }
  }, "Sat 25 April \xB7 15:00 \xB7 Welfare Ground")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--rule-light)',
      paddingTop: 24,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      opacity: 0.6,
      marginBottom: 16,
      textAlign: 'center'
    }
  }, "Kick-off in"), /*#__PURE__*/React.createElement(Countdown, {
    target: next.kickoff,
    compact: true,
    onDark: true
  })), /*#__PURE__*/React.createElement("a", {
    href: "tickets.html",
    className: "btn red",
    style: {
      width: '100%',
      justifyContent: 'center'
    }
  }, "Buy Tickets \u2192")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--paper-2)',
      borderBottom: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      padding: '24px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      flexShrink: 0
    }
  }, "Fixtures"), d.fixtures.slice(0, 4).map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingRight: 24,
      borderRight: i < 3 ? '1px solid var(--rule)' : 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow mono-num",
    style: {
      opacity: 0.6
    }
  }, new Date(f.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  }).toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, f.home === 'Blidworth Welfare' ? 'BWFC' : f.home.split(' ')[0], " v ", f.away === 'Blidworth Welfare' ? 'BWFC' : f.away.split(' ')[0]), /*#__PURE__*/React.createElement("span", {
    className: "chip",
    style: {
      fontSize: 9
    }
  }, f.venue))), /*#__PURE__*/React.createElement("a", {
    href: "fixtures.html",
    className: "btn sm ghost",
    style: {
      marginLeft: 'auto',
      flexShrink: 0
    }
  }, "All fixtures \u2192"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Latest",
    title: "The Newsroom",
    action: {
      label: 'All News',
      href: 'news.html'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(NewsCard, {
    item: d.news[0],
    size: "xl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(NewsCard, {
    item: d.news[1],
    size: "md"
  }), /*#__PURE__*/React.createElement(NewsCard, {
    item: d.news[2],
    size: "md"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(NewsCard, {
    item: d.news[3],
    size: "md"
  }), /*#__PURE__*/React.createElement(NewsCard, {
    item: d.news[4],
    size: "md"
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ink)',
      color: 'var(--paper)',
      padding: '96px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "CMA North \xB7 2025/26",
    title: "Where we stand",
    action: {
      label: 'Full Table',
      href: 'table.html'
    },
    onDark: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid var(--rule-light)'
    }
  }, ['#', 'Club', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: '14px 8px',
      textAlign: h === 'Club' ? 'left' : 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontSize: 11,
      opacity: 0.6
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, d.table.slice(0, 8).map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.team,
    style: {
      borderBottom: '1px solid var(--rule-light)',
      background: r.self ? 'rgba(212,162,76,0.08)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 8px',
      fontVariantNumeric: 'tabular-nums',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, r.pos <= 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 3,
      height: 20,
      background: 'var(--gold)'
    }
  }), r.pos === 2 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 3,
      height: 20,
      background: 'var(--gold)',
      opacity: 0.5
    }
  }), r.pos >= 12 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 3,
      height: 20,
      background: 'var(--red)'
    }
  }), r.pos)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 8px',
      fontWeight: r.self ? 700 : 500,
      color: r.self ? 'var(--gold)' : 'inherit'
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
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.gd > 0 ? '+' + r.gd : r.gd), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 8px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums',
      fontWeight: 700
    }
  }, r.pts)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 20
    }
  }, "Recent Form"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginBottom: 32
    }
  }, ['W', 'W', 'D', 'L', 'W'].map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: f === 'W' ? 'var(--green)' : f === 'D' ? '#8a7b4a' : 'var(--red)',
      color: '#fff',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18
    }
  }, f))), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 16
    }
  }, "Last Five"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, d.results.slice(0, 5).map((r, i) => {
    const home = r.home === 'Blidworth Welfare';
    const wld = home ? r.hs > r.as ? 'W' : r.hs < r.as ? 'L' : 'D' : r.as > r.hs ? 'W' : r.as < r.hs ? 'L' : 'D';
    const col = wld === 'W' ? 'var(--green)' : wld === 'D' ? '#8a7b4a' : 'var(--red)';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 16,
        padding: '10px 0',
        borderBottom: '1px solid var(--rule-light)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        height: 32,
        background: col
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600
      }
    }, home ? r.away : r.home, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: 0.5
      }
    }, "(", home ? 'H' : 'A', ")")), /*#__PURE__*/React.createElement("div", {
      style: {
        opacity: 0.5,
        fontSize: 11,
        marginTop: 2
      }
    }, new Date(r.date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    }), " \xB7 ", r.comp)), /*#__PURE__*/React.createElement("div", {
      className: "h-display mono-num",
      style: {
        fontSize: 20,
        fontWeight: 600
      }
    }, r.hs, "-", r.as));
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 0',
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 32,
      minHeight: 520
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink)',
      color: 'var(--paper)',
      padding: 56,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -80,
      top: -80,
      width: 420,
      height: 420,
      background: 'radial-gradient(circle, rgba(212,162,76,0.25) 0%, transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 20
    }
  }, "1926 \u2014 2026"), /*#__PURE__*/React.createElement("h2", {
    className: "h-editorial",
    style: {
      fontSize: 72,
      fontWeight: 400,
      textWrap: 'balance',
      marginBottom: 20
    }
  }, "One hundred years", /*#__PURE__*/React.createElement("br", null), "at the Welfare."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      opacity: 0.75,
      maxWidth: 480,
      marginBottom: 32
    }
  }, "A season-long celebration of a century of football in Blidworth. Heritage matches, archive exhibitions, and a commemorative kit honouring the generations who built this club.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "btn",
    style: {
      background: 'var(--gold)',
      color: 'var(--ink)',
      borderColor: 'var(--gold)'
    }
  }, "Centenary Programme"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "btn ghost-light"
  }, "Our History"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "shop.html",
    className: "ph gold",
    style: {
      padding: 32,
      textDecoration: 'none',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Club Shop \xB7 New"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "h-display",
    style: {
      fontSize: 32,
      fontWeight: 700,
      marginBottom: 8
    }
  }, "Centenary Home Shirt"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      opacity: 0.85
    }
  }, "Heritage black w/ gold trim \u2014 \xA342 \u2192")))), /*#__PURE__*/React.createElement("a", {
    href: "lotto.html",
    className: "ph red",
    style: {
      padding: 32,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Welfare Lotto"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "h-display",
    style: {
      fontSize: 44,
      fontWeight: 700,
      lineHeight: 1
    }
  }, "Coming soon."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      opacity: 0.85,
      marginTop: 8
    }
  }, "Launching Autumn 2026 \xB7 Get early access \u2192")))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 0',
      background: 'var(--paper-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Follow",
    title: "@BlidworthWFC",
    action: {
      label: 'All socials',
      href: '#'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24
    }
  }, d.socials.map((s, i) => /*#__PURE__*/React.createElement(SocialItem, {
    key: i,
    s: s
  }))))), /*#__PURE__*/React.createElement(SponsorStrip, {
    sponsors: d.sponsors
  }));
}
window.HomeClassic = HomeClassic;
