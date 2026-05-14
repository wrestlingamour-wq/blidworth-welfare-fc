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
  return /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 32,
      alignItems: 'start',
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 500
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "twitter-timeline",
    "data-height": "500",
    "data-chrome": "noheader nofooter",
    href: "https://x.com/BlidworthFC"
  }, "Tweets by @BlidworthFC")), /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 500
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "fb-root"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fb-page",
    "data-href": "https://www.facebook.com/blidworthwelfarefc",
    "data-tabs": "timeline",
    "data-width": "",
    "data-height": "500",
    "data-small-header": "true",
    "data-adapt-container-width": "true",
    "data-hide-cover": "false",
    "data-show-facepile": "false"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 500,
      border: '1px solid var(--rule)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      padding: 40,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "56",
    height: "56",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "20",
    rx: "5.5",
    stroke: "var(--ink)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4",
    stroke: "var(--ink)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "6.5",
    r: "1",
    fill: "var(--ink)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 8
    }
  }, "Instagram"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      fontFamily: 'var(--font-display)',
      letterSpacing: '-0.02em',
      marginBottom: 8
    }
  }, "@blidworthwelfare_fc1st"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      opacity: 0.6,
      lineHeight: 1.5
    }
  }, "Match-day photos, training shots and behind-the-scenes from the Welfare Ground.")), /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/blidworthwelfare_fc1st/",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-block',
      padding: '12px 28px',
      background: 'var(--ink)',
      color: 'var(--paper)',
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontSize: 12,
      fontWeight: 600,
      textDecoration: 'none'
    }
  }, "Follow on Instagram \u2192")));
}
function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function HomeModern() {
  const d = BW_DATA;

  // ── Auto-derive next match from fixtures list ─────────────────────────────
  const shortName = name => {
    if (/blidworth/i.test(name)) return 'BWFC';
    return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 4);
  };
  const upcoming = (d.fixtures || []).find(f => {
    const dt = new Date(f.date + 'T' + (f.time || '15:00') + ':00');
    return dt.getTime() >= Date.now() - 3 * 60 * 60 * 1000; // include matches started up to 3h ago
  });
  const next = upcoming ? {
    home: {
      name: upcoming.home,
      short: shortName(upcoming.home),
      crest: /blidworth/i.test(upcoming.home) ? 'assets/crest.png' : null
    },
    away: {
      name: upcoming.away,
      short: shortName(upcoming.away),
      crest: /blidworth/i.test(upcoming.away) ? 'assets/crest.png' : null
    },
    kickoff: upcoming.date + 'T' + (upcoming.time || '15:00') + ':00',
    comp: upcoming.comp || d.nextMatch && d.nextMatch.comp || 'Camper UK Premier South',
    venue: /blidworth/i.test(upcoming.home) ? 'Welfare Ground' : upcoming.home,
    tickets: d.nextMatch && d.nextMatch.tickets || false
  } : d.nextMatch || {
    home: {
      name: 'Blidworth Welfare',
      short: 'BWFC',
      crest: 'assets/crest.png'
    },
    away: {
      name: 'TBC',
      short: 'TBC'
    },
    kickoff: new Date(Date.now() + 7 * 86400000).toISOString(),
    comp: 'Camper UK Premier South',
    tickets: false
  };
  const [hoverNews, setHoverNews] = React.useState(null);

  // ── Derive live stats from the synced table ──────────────────────────────
  const self = (d.table || []).find(r => r.self) || {
    pos: 16,
    p: 0,
    w: 0,
    d: 0,
    l: 0,
    gd: 0,
    pts: 0
  };
  const totalTeams = (d.table || []).length || 18;
  const maxGames = Math.max(...(d.table || []).map(r => r.p || 0), 0);
  const toGo = Math.max(0, (totalTeams - 1) * 2 - self.p); // rough round-robin estimate

  // Opponent lookup for position chip
  const oppName = /blidworth/i.test(next.home?.name || '') ? next.away?.name : next.home?.name;
  const opp = (d.table || []).find(r => r.team === oppName);
  const isHomeFixture = /blidworth/i.test(next.home?.name || '');

  // Kick-off date formatting — always reflects synced nextMatch
  const ko = new Date(next.kickoff);
  const koDate = ko.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).toUpperCase();
  const koTime = ko.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--paper)',
      position: 'relative',
      minHeight: 820,
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '80px 56px 80px 80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      borderRight: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "reveal reveal-1",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/crest.png",
    className: "crest-reveal",
    style: {
      height: 64
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Centenary Season \xB7 2026/27")), /*#__PURE__*/React.createElement("div", {
    className: "reveal reveal-2"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "h-display",
    style: {
      fontSize: 'clamp(80px, 11vw, 200px)',
      fontWeight: 700,
      lineHeight: 0.86,
      letterSpacing: '-0.03em'
    }
  }, "THE", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      WebkitTextStroke: '2px var(--ink)',
      WebkitTextFillColor: 'transparent',
      fontStyle: 'italic'
    }
  }, "WEL"), /*#__PURE__*/React.createElement("span", null, "FARE"))), /*#__PURE__*/React.createElement("p", {
    className: "reveal reveal-3 h-editorial",
    style: {
      fontSize: 32,
      fontWeight: 400,
      marginTop: 40,
      maxWidth: 520,
      textWrap: 'balance'
    }
  }, "One hundred years of football in the heart of Nottinghamshire.")), /*#__PURE__*/React.createElement("div", {
    className: "reveal reveal-4",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 0,
      marginTop: 64,
      borderTop: '1px solid var(--rule)'
    }
  }, [['Est.', '1926'], ['Position', ordinal(self.pos)], ['Points', String(self.pts)], ['Played', String(self.p)]].map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      padding: '24px 20px',
      borderRight: i < 3 ? '1px solid var(--rule)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      opacity: 0.5,
      marginBottom: 8
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    className: "h-display mono-num",
    style: {
      fontSize: 32,
      fontWeight: 600
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink)',
      color: 'var(--paper)',
      padding: '80px 56px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 240,
      height: 240,
      background: 'var(--gold)',
      transform: 'rotate(45deg) translate(50%, -50%)',
      transformOrigin: 'top right'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "reveal reveal-2",
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 32
    }
  }, next.tickets !== false && /*#__PURE__*/React.createElement("span", {
    className: "chip",
    style: {
      background: 'var(--red)',
      borderColor: 'var(--red)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip-dot"
  }), " TICKETS LIVE"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      opacity: 0.7
    }
  }, next.comp || 'Camper UK Premier South')), /*#__PURE__*/React.createElement("div", {
    className: "h-display",
    style: {
      fontSize: 14,
      opacity: 0.6,
      marginBottom: 24
    }
  }, koDate, " \xB7 ", koTime), (() => {
    const oppShort = (isHomeFixture ? next.away?.short : next.home?.short) || 'OPP';
    const oppFull = (oppName || 'Opponent').toUpperCase();
    const words = oppFull.split(' ');
    const splitPt = Math.ceil(words.length / 2);
    const oppLine1 = words.slice(0, splitPt).join(' ');
    const oppLine2 = words.slice(splitPt).join(' ');
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        marginBottom: 48
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
      src: "assets/crest.png",
      style: {
        height: 96,
        marginBottom: 16
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "h-display",
      style: {
        fontSize: 36,
        fontWeight: 700,
        lineHeight: 0.95
      }
    }, "BLIDWORTH"), /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginTop: 12,
        opacity: 0.6
      }
    }, isHomeFixture ? 'Home' : 'Away', " \xB7 ", ordinal(self.pos))), /*#__PURE__*/React.createElement("div", null, (() => {
      const oppLogo = isHomeFixture ? next.away?.logo : next.home?.logo;
      return oppLogo ? /*#__PURE__*/React.createElement("img", {
        src: oppLogo,
        style: {
          height: 96,
          width: 96,
          objectFit: 'contain',
          marginBottom: 16
        }
      }) : /*#__PURE__*/React.createElement("div", {
        style: {
          height: 96,
          width: 96,
          marginBottom: 16,
          background: 'repeating-linear-gradient(45deg, #d4a24c 0 8px, #a77f35 8px 16px)',
          border: '2px solid var(--paper)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--ink)'
        }
      }, oppShort);
    })(), /*#__PURE__*/React.createElement("div", {
      className: "h-display",
      style: {
        fontSize: 36,
        fontWeight: 700,
        lineHeight: 0.95
      }
    }, oppLine1, oppLine2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), oppLine2)), /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginTop: 12,
        opacity: 0.6
      }
    }, isHomeFixture ? 'Away' : 'Home', " \xB7 ", opp ? ordinal(opp.pos) : '—')));
  })()), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--rule-light)',
      paddingTop: 32,
      marginBottom: 32,
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      opacity: 0.6,
      marginBottom: 20
    }
  }, "Kick-off in"), /*#__PURE__*/React.createElement(Countdown, {
    target: next.kickoff,
    onDark: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal reveal-3",
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "tickets.html",
    className: "btn red",
    style: {
      flex: 1,
      justifyContent: 'center'
    }
  }, "Buy Tickets \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "btn ghost-light",
    style: {
      flex: 1,
      justifyContent: 'center'
    }
  }, "Matchday Info")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--gold)',
      color: 'var(--ink)',
      padding: '20px 0',
      overflow: 'hidden',
      borderTop: '1px solid var(--ink)',
      borderBottom: '1px solid var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 48,
      whiteSpace: 'nowrap',
      animation: 'ticker 60s linear infinite',
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    }
  }, Array(12).fill(0).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 48
    }
  }, "UP THE WELFARE ", /*#__PURE__*/React.createElement("span", null, "\u2605"), " SINCE 1926 ", /*#__PURE__*/React.createElement("span", null, "\u2605"), " 100 YEARS STRONG ", /*#__PURE__*/React.createElement("span", null, "\u2605"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 0',
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Newsfeed",
    title: "What's happening",
    action: {
      label: 'All News',
      href: 'news.html'
    },
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 24,
      gridAutoRows: 'minmax(280px, auto)'
    }
  }, d.news.map((n, i) => {
    const layouts = [{
      gridColumn: 'span 3',
      gridRow: 'span 2',
      size: 'xl'
    }, {
      gridColumn: 'span 3',
      gridRow: 'span 1',
      size: 'md'
    }, {
      gridColumn: 'span 3',
      gridRow: 'span 1',
      size: 'md'
    }, {
      gridColumn: 'span 2',
      gridRow: 'span 1',
      size: 'sm'
    }, {
      gridColumn: 'span 2',
      gridRow: 'span 1',
      size: 'sm'
    }, {
      gridColumn: 'span 2',
      gridRow: 'span 1',
      size: 'sm'
    }];
    const l = layouts[i] || layouts[5];
    return /*#__PURE__*/React.createElement("div", {
      key: n.id,
      style: l,
      onMouseEnter: () => setHoverNews(i),
      onMouseLeave: () => setHoverNews(null)
    }, /*#__PURE__*/React.createElement("a", {
      href: `article.html?id=${n.id}`,
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: 'var(--ink)',
        overflow: 'hidden',
        background: 'var(--white)',
        border: '1px solid var(--rule)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        transform: hoverNews === i ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hoverNews === i ? '0 20px 40px rgba(0,0,0,0.08)' : 'none'
      }
    }, n.photos && n.photos[0] ? /*#__PURE__*/React.createElement("img", {
      src: n.photos[0],
      style: {
        flex: 1,
        minHeight: 160,
        width: '100%',
        objectFit: 'cover',
        display: 'block'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      className: "ph",
      style: {
        flex: 1,
        minHeight: 160
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "ph-label"
    }, "[ ", n.img || 'photo', " ]")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        color: 'var(--gold)',
        marginBottom: 8
      }
    }, n.cat), /*#__PURE__*/React.createElement("h3", {
      className: "h-editorial",
      style: {
        fontSize: l.size === 'xl' ? 40 : l.size === 'md' ? 22 : 16,
        fontWeight: 400,
        textWrap: 'balance',
        marginBottom: 8
      }
    }, n.title), l.size !== 'sm' && /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        opacity: 0.7
      }
    }, n.kicker))));
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ink)',
      color: 'var(--paper)',
      padding: '96px 0',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -40,
      right: -40,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 280,
      opacity: 0.04,
      color: 'var(--gold)',
      letterSpacing: '-0.05em',
      lineHeight: 0.85
    }
  }, "PREMIER", /*#__PURE__*/React.createElement("br", null), "SOUTH"), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Standings",
    title: "Camper UK \xB7 Premier Division South",
    action: {
      label: 'Full Table',
      href: 'table.html'
    },
    onDark: true,
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink-2)',
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['#', 'Club', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: '16px 10px',
      textAlign: h === 'Club' ? 'left' : 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontSize: 11,
      opacity: 0.6,
      borderBottom: '1px solid var(--rule-light)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, d.table.slice(0, 10).map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.team,
    style: {
      background: r.self ? 'var(--gold)' : 'transparent',
      color: r.self ? 'var(--ink)' : 'inherit'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 10px',
      fontVariantNumeric: 'tabular-nums',
      fontWeight: 700
    }
  }, r.pos), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 10px',
      fontWeight: r.self ? 700 : 500
    }
  }, r.team), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 10px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.p), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 10px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.w), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 10px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.d), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 10px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.l), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 10px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.gd > 0 ? '+' + r.gd : r.gd), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 10px',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums',
      fontWeight: 700,
      fontSize: 16
    }
  }, r.pts)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 24
    }
  }, "The Welfare \xB7 Season"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 4
    }
  }, [['Played', String(self.p)], ['Wins', String(self.w)], ['Draws', String(self.d)], ['Losses', String(self.l)], ['GD', self.gd > 0 ? '+' + self.gd : String(self.gd)], ['Points', String(self.pts)], ['Position', ordinal(self.pos)], ['To Go', String(toGo)]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      padding: '20px 20px',
      background: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      opacity: 0.5,
      marginBottom: 6
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    className: "h-display mono-num",
    style: {
      fontSize: 28,
      fontWeight: 600
    }
  }, v)))), /*#__PURE__*/React.createElement("a", {
    href: "fixtures.html",
    className: "btn ghost-light",
    style: {
      marginTop: 24,
      width: '100%',
      justifyContent: 'center'
    }
  }, "Full Fixtures & Results \u2192"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0',
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "shop.html",
    className: "big-tile",
    style: {
      padding: '80px 48px',
      minHeight: 480,
      background: 'var(--ink)',
      color: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'repeating-linear-gradient(135deg, #1a1a1a 0 16px, #0f0f0f 16px 32px)',
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 16
    }
  }, "Club Shop"), /*#__PURE__*/React.createElement("div", {
    className: "h-editorial",
    style: {
      fontSize: 48,
      textWrap: 'balance'
    }
  }, "The centenary shirt is here.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-display mono-num",
    style: {
      fontSize: 40
    }
  }, "\xA342"), /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow",
    style: {
      fontSize: 28
    }
  }, "\u2192"))), /*#__PURE__*/React.createElement("a", {
    href: "lotto.html",
    className: "big-tile",
    style: {
      padding: '80px 48px',
      minHeight: 480,
      background: 'var(--red)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 16
    }
  }, "Welfare Lotto"), /*#__PURE__*/React.createElement("div", {
    className: "h-display",
    style: {
      fontSize: 96,
      fontWeight: 700,
      lineHeight: 0.9,
      textWrap: 'balance'
    }
  }, "Coming", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'var(--font-editorial)',
      fontStyle: 'italic',
      fontWeight: 400
    }
  }, "soon."))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      opacity: 0.9,
      marginBottom: 8
    }
  }, "Launching Autumn 2026 \xB7 \xA31/week \xB7 Friday draws"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      fontWeight: 600
    }
  }, "GET EARLY ACCESS \u2192"))), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "big-tile",
    style: {
      padding: '80px 48px',
      minHeight: 480,
      background: 'var(--gold)',
      color: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 16
    }
  }, "1926 \u2014 2026"), /*#__PURE__*/React.createElement("div", {
    className: "h-editorial",
    style: {
      fontSize: 48,
      textWrap: 'balance'
    }
  }, "One hundred years at the Welfare.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      fontWeight: 600
    }
  }, "CENTENARY PROGRAMME \u2192")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Follow the club",
    title: "@BlidworthFC",
    action: {
      label: 'Follow on X',
      href: 'https://x.com/BlidworthFC'
    }
  }), /*#__PURE__*/React.createElement(SocialEmbeds, null))), /*#__PURE__*/React.createElement(SponsorStrip, {
    sponsors: d.sponsors
  }));
}
window.HomeModern = HomeModern;
