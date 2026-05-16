'use client';

import {
  useEffect,
  useState,
  CSSProperties,
  ReactNode,
  MouseEvent as ReactMouseEvent,
} from 'react';

// ─── Design tokens ────────────────────────────────────────────────
const C  = '#00ffd1';
const C2 = '#7c5cff';
const BG = '#06070b';
const MONO = 'var(--font-jetbrains-mono), Menlo, monospace';

// ─── Data ─────────────────────────────────────────────────────────
const PROFILE = {
  name: 'Bogdan Obradović',
  initials: 'BO',
  location: 'Kragujevac, Serbia',
  timezone: 'GMT+1 / CET',
  email: 'bogdanobradovic02@gmail.com',
  github: 'BogdanO221',
  githubUrl: 'https://github.com/BogdanO221',
  linkedinUrl: 'https://www.linkedin.com/in/bogdan-obradovic-8a9230272/',
  yearsCoding: 4,
  projectsShipped: 12,
};

const SKILLS_FRONTEND = [
  { name: 'React',         level: 92 },
  { name: 'TypeScript',    level: 86 },
  { name: 'Tailwind CSS',  level: 94 },
  { name: 'Next.js',       level: 78 },
  { name: 'Framer Motion', level: 80 },
  { name: 'Node.js',       level: 70 },
];

const SKILLS_ENGINEERING = [
  { name: 'PTV Vissim',       level: 88 },
  { name: 'SUMO',             level: 82 },
  { name: 'AutoCAD',          level: 90 },
  { name: 'QGIS / GIS',       level: 76 },
  { name: 'Traffic modeling', level: 84 },
  { name: 'Signal timing',    level: 80 },
];

type Project = {
  id: string;
  name: string;
  tag: string;
  role: string;
  year: number;
  summary: string;
  description: string;
  stack: string[];
  metrics: { users?: string; stars?: number; rating?: number; status: string };
  url?: string;
  color: string;
};

const PROJECTS: Project[] = [
  {
    id: 'tripvice',
    name: 'Tripvice.net',
    tag: 'flagship',
    role: 'Co-creator · Frontend Lead',
    year: 2024,
    summary:
      'AI travel planner that turns natural-language prompts into day-by-day itineraries with maps, bookings & budgets.',
    description:
      'Tripvice converts a single sentence — "5 days in Lisbon, mid-range, foodie" — into a structured itinerary with day plans, geocoded stops, transit hints and cost estimates. I built the React frontend, the itinerary canvas, and the streaming response UI.',
    stack: ['React', 'Next.js', 'Tailwind', 'OpenAI', 'Mapbox', 'PostgreSQL'],
    metrics: { users: '4.2k', rating: 4.7, status: 'live' },
    url: 'tripvice.net',
    color: '#00ffd1',
  },
  {
    id: 'newsapp',
    name: 'NewsApp',
    tag: 'product',
    role: 'Solo',
    year: 2023,
    summary:
      'Topic-clustered news reader with saved-for-later, keyboard nav and a focus-mode reader view.',
    description:
      'A React news client that clusters headlines into topics, supports keyboard-only navigation (j/k for items, o to open) and ships with a distraction-free reader.',
    stack: ['React', 'Vite', 'NewsAPI', 'CSS Modules'],
    metrics: { stars: 38, status: 'maintained' },
    color: '#7c5cff',
  },
  {
    id: 'piggame',
    name: 'PigGame',
    tag: 'classic',
    role: 'Solo',
    year: 2022,
    summary:
      'The dice game, rebuilt in vanilla JS as a learning vehicle for state machines and DOM patterns.',
    description:
      'Two-player Pig with hold/roll mechanics, score-to-100, animated dice and a clean state machine.',
    stack: ['Vanilla JS', 'HTML', 'CSS'],
    metrics: { stars: 12, status: 'archived' },
    color: '#ffb84d',
  },
];

const EXPERIENCE = [
  {
    year: '2024 — present',
    role: 'Freelance Frontend Engineer',
    org: 'Independent',
    kind: 'work' as const,
    detail:
      'Building product UIs for early-stage teams. React, TypeScript, design-system work.',
  },
  {
    year: '2024',
    role: 'Co-creator · Frontend',
    org: 'Tripvice.net',
    kind: 'work' as const,
    detail:
      'Co-founded the AI travel planner. Owned the itinerary canvas and the streaming UI.',
  },
  {
    year: '2023 — 2024',
    role: 'Junior Traffic Engineer',
    org: 'Municipal Traffic Bureau · Kragujevac',
    kind: 'work' as const,
    detail:
      'Signal timing studies, microsimulation models in Vissim, intersection redesigns.',
  },
  {
    year: '2019 — 2024',
    role: 'B.Sc. Road & Transport Engineering',
    org: 'University of Kragujevac',
    kind: 'edu' as const,
    detail: 'Thesis: Microsimulation-based optimization of signalized intersections.',
  },
];

// 12 weeks × 7 days deterministic commit heatmap
const COMMITS_30D = (() => {
  let s = 7;
  const out: number[] = [];
  for (let i = 0; i < 84; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    out.push(Math.floor(r * r * 5));
  }
  return out;
})();

// ─── Primitives ───────────────────────────────────────────────────

function Bracket({
  pos,
  color,
  size = 9,
  m = 5,
}: {
  pos: 'tl' | 'tr' | 'bl' | 'br';
  color: string;
  size?: number;
  m?: number;
}) {
  const w = 1.5;
  const styles: Record<typeof pos, CSSProperties> = {
    tl: { top: m, left: m,    borderTop: `${w}px solid ${color}`, borderLeft:  `${w}px solid ${color}` },
    tr: { top: m, right: m,   borderTop: `${w}px solid ${color}`, borderRight: `${w}px solid ${color}` },
    bl: { bottom: m, left: m, borderBottom: `${w}px solid ${color}`, borderLeft:  `${w}px solid ${color}` },
    br: { bottom: m, right: m,borderBottom: `${w}px solid ${color}`, borderRight: `${w}px solid ${color}` },
  };
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        opacity: 0.65,
        pointerEvents: 'none',
        ...styles[pos],
      }}
    />
  );
}

function Panel({
  label,
  code,
  headerRight,
  children,
  accent,
  style,
  padding,
}: {
  label?: string;
  code?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  accent: string;
  style?: CSSProperties;
  padding?: number | string;
}) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,.018)',
        border: '1px solid rgba(255,255,255,.06)',
        borderRadius: 14,
        backdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      <Bracket pos="tl" color={accent} />
      <Bracket pos="tr" color={accent} />
      <Bracket pos="bl" color={accent} />
      <Bracket pos="br" color={accent} />
      {label && (
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,.05)',
            fontFamily: MONO, fontSize: 10,
            letterSpacing: 1.4, textTransform: 'uppercase',
            color: 'rgba(255,255,255,.42)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: accent }}>▸</span>
            {label}
            {code && <span style={{ opacity: 0.55 }}>{code}</span>}
          </span>
          {headerRight}
        </div>
      )}
      <div style={{ padding: padding ?? (label ? 18 : 22) }}>{children}</div>
    </div>
  );
}

function Counter({
  value,
  suffix = '',
  duration = 1300,
  format = (n: number) => n.toLocaleString(),
}: {
  value: number;
  suffix?: string;
  duration?: number;
  format?: (n: number) => string;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {format(n)}
      {suffix}
    </span>
  );
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div
      style={{
        animation: `portfolio-reveal .6s ${delay}ms cubic-bezier(.2,.7,.3,1) both`,
      }}
    >
      {children}
    </div>
  );
}

function LiveClock() {
  const [t, setT] = useState<Date | null>(null);
  useEffect(() => {
    setT(new Date());
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!t) return <span>--:--:-- GMT+1</span>;
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {pad(t.getHours())}:{pad(t.getMinutes())}:{pad(t.getSeconds())} GMT+1
    </span>
  );
}

function SectionHead({
  chip,
  title,
  sub,
  accent,
  code,
  action,
}: {
  chip?: string;
  title: string;
  sub?: string;
  accent: string;
  code?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: 20, gap: 16,
      }}
    >
      <div>
        {chip && (
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 10px', borderRadius: 999,
              background: `${accent}11`, border: `1px solid ${accent}30`,
              fontFamily: MONO, fontSize: 10,
              color: accent, letterSpacing: 1.2, marginBottom: 14,
            }}
          >
            {chip}
            {code && <span style={{ opacity: 0.55, fontFamily: MONO }}>{code}</span>}
          </div>
        )}
        <h2
          style={{
            margin: 0, fontSize: 'var(--section-title-size)', fontWeight: 600,
            color: '#fff', letterSpacing: -0.6, lineHeight: 1.05,
          }}
        >
          {title}
        </h2>
        {sub && (
          <p
            style={{
              margin: '8px 0 0', fontSize: 14,
              color: 'rgba(255,255,255,.55)', maxWidth: 540, lineHeight: 1.5,
            }}
          >
            {sub}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── Radar chart ──────────────────────────────────────────────────

function RadarChart({
  data,
  size = 300,
  color,
  color2,
}: {
  data: { name: string; level: number }[];
  size?: number;
  color: string;
  color2: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 28;
  const n = data.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, v: number): [number, number] => {
    const rr = (v / 100) * r;
    return [cx + Math.cos(angle(i)) * rr, cy + Math.sin(angle(i)) * rr];
  };
  const ring = (frac: number) => {
    let d = '';
    for (let i = 0; i < n; i++) {
      const x = cx + Math.cos(angle(i)) * r * frac;
      const y = cy + Math.sin(angle(i)) * r * frac;
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
    }
    return d + 'Z';
  };
  const shape = data.map((d, i) => point(i, d.level));
  const pathData =
    shape
      .map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1))
      .join('') + 'Z';
  const gradId = `rg-${color.slice(1)}`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <path key={i} d={ring(f)} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
      ))}
      {data.map((_, i) => {
        const x = cx + Math.cos(angle(i)) * r;
        const y = cy + Math.sin(angle(i)) * r;
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,.06)" strokeWidth="1" />;
      })}
      <path
        d={pathData}
        fill={`url(#${gradId})`}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {shape.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={color} />
      ))}
      {data.map((d, i) => {
        const lx = cx + Math.cos(angle(i)) * (r + 18);
        const ly = cy + Math.sin(angle(i)) * (r + 18);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            fill="rgba(255,255,255,.65)"
            fontSize="10"
            fontFamily={MONO}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {d.name}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Sidebar icons ────────────────────────────────────────────────

const IconDiamond = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M7 1.5l5.5 5.5L7 12.5 1.5 7z"/></svg>;
const IconCircle  = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5"/></svg>;
const IconHex     = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M7 1.5L12 4.5v5L7 12.5 2 9.5v-5z"/></svg>;
const IconGrid    = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1.5" y="1.5" width="4.5" height="4.5"/><rect x="8" y="1.5" width="4.5" height="4.5"/><rect x="1.5" y="8" width="4.5" height="4.5"/><rect x="8" y="8" width="4.5" height="4.5"/></svg>;
const IconHalf    = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5"/><path d="M7 2v10"/></svg>;
const IconHalf2   = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5"/><path d="M2 7h10"/></svg>;

// ─── Sidebar ──────────────────────────────────────────────────────

function Sidebar({ active }: { active: string }) {
  const sections = [
    { k: 'overview',   label: 'Overview',   icon: <IconDiamond/>, n: '01' },
    { k: 'about',      label: 'About',      icon: <IconCircle/>,  n: '02' },
    { k: 'skills',     label: 'Skills',     icon: <IconHex/>,     n: '03' },
    { k: 'projects',   label: 'Projects',   icon: <IconGrid/>,    n: '04', badge: 3 },
    { k: 'experience', label: 'Experience', icon: <IconHalf/>,    n: '05' },
    { k: 'contact',    label: 'Contact',    icon: <IconHalf2/>,   n: '06' },
  ];

  const go = (id: string) => (e: ReactMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside
      className="portfolio-sidebar"
      style={{
        position: 'sticky', top: 0, zIndex: 5,
        height: '100vh',
        borderRight: '1px solid rgba(255,255,255,.05)',
        background: 'rgba(8,9,12,.7)',
        backdropFilter: 'blur(18px)',
        display: 'flex', flexDirection: 'column',
        padding: '22px 14px 18px',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '2px 8px 18px' }}>
        <div
          style={{
            position: 'relative', width: 34, height: 34, borderRadius: 9,
            background: `linear-gradient(135deg, ${C}, ${C2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: BG, fontWeight: 700, fontSize: 13,
            boxShadow: `0 6px 22px ${C}44`,
          }}
        >
          BO
          <span
            style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 10, height: 10, borderRadius: '50%',
              background: '#4ade80', border: `2px solid ${BG}`,
              boxShadow: '0 0 6px #4ade80',
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Bogdan</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', fontFamily: MONO }}>portfolio.v2</div>
        </div>
      </div>

      {/* Availability */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 11px',
          background: 'rgba(74,222,128,.06)',
          border: '1px solid rgba(74,222,128,.18)',
          borderRadius: 8,
          marginBottom: 18,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#fff' }}>
          <span
            style={{
              width: 7, height: 7, borderRadius: '50%', background: '#4ade80',
              boxShadow: '0 0 6px #4ade80',
              animation: 'portfolio-pulse 2s ease-in-out infinite',
            }}
          />
          Open for freelance
        </span>
        <span
          style={{
            fontSize: 9, color: 'rgba(255,255,255,.5)',
            fontFamily: MONO,
            padding: '2px 5px', borderRadius: 3, background: 'rgba(255,255,255,.04)',
          }}
        >
          ⌘K
        </span>
      </div>

      <div
        style={{
          fontSize: 9, color: 'rgba(255,255,255,.32)',
          letterSpacing: 1.3, padding: '4px 12px', marginBottom: 6,
          fontFamily: MONO,
        }}
      >
        WORKSPACE
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {sections.map((s) => {
          const isActive = active === s.k;
          return (
            <a
              key={s.k}
              href={`#${s.k}`}
              onClick={go(s.k)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 11px', borderRadius: 7,
                color: isActive ? '#fff' : 'rgba(255,255,255,.55)',
                background: isActive ? 'rgba(255,255,255,.04)' : 'transparent',
                textDecoration: 'none', fontSize: 13,
                transition: 'background .15s, color .15s',
                borderLeft: isActive ? `2px solid ${C}` : '2px solid transparent',
                paddingLeft: 11,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,.025)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,.55)';
                }
              }}
            >
              <span style={{ color: isActive ? C : 'rgba(255,255,255,.4)', display: 'flex', width: 14 }}>
                {s.icon}
              </span>
              <span style={{ flex: 1 }}>{s.label}</span>
              {s.badge ? (
                <span
                  style={{
                    fontSize: 10, color: 'rgba(255,255,255,.65)',
                    padding: '1px 6px', borderRadius: 999,
                    background: 'rgba(255,255,255,.06)',
                  }}
                >
                  {s.badge}
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 9, color: 'rgba(255,255,255,.3)',
                    fontFamily: MONO,
                  }}
                >
                  {s.n}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* SYSTEM */}
      <div
        style={{
          fontSize: 9, color: 'rgba(255,255,255,.32)',
          letterSpacing: 1.3, padding: '4px 12px', marginBottom: 6, marginTop: 24,
          fontFamily: MONO,
        }}
      >
        SYSTEM
      </div>
      <div style={{ padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        <SysLine k="role"   v="FE + TE" />
        <SysLine k="loc"    v="KG · RS" />
        <SysLine k="uptime" v={`${PROFILE.yearsCoding}y · coding`} />
      </div>

      {/* NOW */}
      <div
        style={{
          fontSize: 9, color: 'rgba(255,255,255,.32)',
          letterSpacing: 1.3, padding: '4px 12px', marginBottom: 6,
          fontFamily: MONO,
        }}
      >
        NOW
      </div>
      <div
        style={{
          position: 'relative',
          padding: 13, borderRadius: 10,
          background: 'rgba(255,255,255,.025)',
          border: '1px solid rgba(255,255,255,.05)',
          marginBottom: 12,
        }}
      >
        <Bracket pos="tl" color={C} m={3} size={7} />
        <Bracket pos="br" color={C} m={3} size={7} />
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', fontFamily: MONO, letterSpacing: 0.5 }}>
          currently building
        </div>
        <div style={{ fontSize: 14, color: '#fff', fontWeight: 500, marginTop: 4 }}>Tripvice v2</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%', width: '68%',
                background: `linear-gradient(90deg, ${C}, ${C2})`,
                boxShadow: `0 0 6px ${C}55`,
              }}
            />
          </div>
          <span style={{ fontSize: 10, color: C, fontFamily: MONO }}>68%</span>
        </div>
      </div>

      {/* Profile chip */}
      <a
        href={PROFILE.linkedinUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 8,
          textDecoration: 'none',
          color: 'rgba(255,255,255,.75)', fontSize: 12,
          transition: 'background .12s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div
          style={{
            width: 26, height: 26, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C}, ${C2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: BG, fontWeight: 700, fontSize: 10,
          }}
        >
          BO
        </div>
        <span style={{ flex: 1 }}>Bogdan</span>
        <span style={{ opacity: 0.5 }}>↗</span>
      </a>
    </aside>
  );
}

function SysLine({ k, v }: { k: string; v: string }) {
  return (
    <div
      style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: MONO, fontSize: 10, letterSpacing: 0.3,
      }}
    >
      <span style={{ color: 'rgba(255,255,255,.4)' }}>{k}</span>
      <span style={{ color: 'rgba(255,255,255,.75)' }}>{v}</span>
    </div>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────

function TopBar() {
  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--topbar-pad)', flexWrap: 'wrap', gap: 10,
        borderBottom: '1px solid rgba(255,255,255,.04)',
        background: 'rgba(6,7,11,.75)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'rgba(255,255,255,.5)' }}>
        <span style={{ fontFamily: MONO, color: C }}>~/</span>
        <span>portfolio</span>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: '#fff', fontWeight: 500 }}>overview</span>
        <span
          style={{
            padding: '2px 7px', borderRadius: 4, marginLeft: 6,
            background: 'rgba(74,222,128,.1)', color: '#4ade80',
            fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 4px #4ade80' }} />
          LIVE
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,.5)' }}>
          <LiveClock />
        </span>
        <a
          href={`mailto:${PROFILE.email}`}
          style={{
            padding: '7px 14px', borderRadius: 7,
            background: '#fff', color: BG,
            textDecoration: 'none',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
            transition: 'transform .12s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
        >
          Book a call →
        </a>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="overview" style={{ paddingTop: 16, scrollMarginTop: 80 }}>
      <Reveal>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '5px 12px', borderRadius: 999,
            background: 'rgba(74,222,128,.08)',
            border: '1px solid rgba(74,222,128,.2)',
            fontSize: 11, color: '#4ade80', fontWeight: 500,
            fontFamily: MONO, letterSpacing: 0.5,
          }}
        >
          <span
            style={{
              width: 6, height: 6, borderRadius: '50%', background: '#4ade80',
              boxShadow: '0 0 6px #4ade80',
              animation: 'portfolio-pulse 2s ease-in-out infinite',
            }}
          />
          AVAILABLE · JUN 2026
        </div>
      </Reveal>

      <div
        style={{
          display: 'grid', gridTemplateColumns: 'var(--hero-cols)', gap: 48,
          alignItems: 'center', marginTop: 22,
        }}
      >
        <div>
          <Reveal delay={60}>
            <h1
              style={{
                margin: 0,
                fontSize: 'var(--hero-h1-size)',
                lineHeight: 'var(--hero-h1-line)' as unknown as number,
                letterSpacing: 'var(--hero-h1-letter)',
                fontWeight: 600,
                background: 'linear-gradient(180deg, #fff 30%, rgba(255,255,255,.55) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Bogdan
              <br />
              Obradović
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 14, color: 'rgba(255,255,255,.6)', marginTop: 22,
                display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
              }}
            >
              <span style={{ color: C }}>$</span>
              <span>whoami</span>
              <span style={{ color: 'rgba(255,255,255,.4)' }}>→</span>
              <span style={{ color: C }}>traffic_engineer</span>
              <span style={{ color: 'rgba(255,255,255,.4)' }}>+</span>
              <span style={{ color: C2 }}>frontend_developer</span>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <p
              style={{
                margin: '22px 0 0', fontSize: 20, lineHeight: 1.5,
                color: 'rgba(255,255,255,.78)', maxWidth: 580, fontWeight: 400,
              }}
            >
              I design systems that move — from urban traffic flows to interactive
              frontends. Co-creator of{' '}
              <a
                href="https://tripvice.net"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#fff', fontWeight: 500,
                  borderBottom: `1.5px solid ${C}`, textDecoration: 'none',
                }}
              >
                Tripvice.net
              </a>
              , an AI travel planner.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
              <BtnPrimary href={`mailto:${PROFILE.email}`}>Start a project →</BtnPrimary>
              <BtnSecondary href="#projects">View work</BtnSecondary>
              <BtnGhost href={PROFILE.githubUrl}>↓ GitHub</BtnGhost>
            </div>
          </Reveal>
        </div>

        <div className="portfolio-hero-portrait">
          <Reveal delay={180}>
            <HeroPortrait />
          </Reveal>
        </div>
      </div>

      <Reveal delay={340}>
        <div
          style={{
            display: 'grid', gridTemplateColumns: 'var(--stats-cols)', gap: 12,
            marginTop: 44,
          }}
        >
          <StatCard k="Years building"   v={PROFILE.yearsCoding}     suffix="+" sub="since 2021"          color={C}        />
          <StatCard k="Projects shipped" v={PROFILE.projectsShipped}            sub="web + traffic"       color={C2}       />
          <StatCard k="Active users"     v={4200}                               sub="on Tripvice.net"     color="#fff"     format={(n) => (n / 1000).toFixed(1) + 'k'} />
          <StatCard k="Client rating"    v={49}                                 sub="/ 50 · 23 reviews"   color="#fbbf24"  format={(n) => (n / 10).toFixed(1)} suffix="★" />
        </div>
      </Reveal>
    </section>
  );
}

function StatCard({
  k, v, sub, color, format, suffix,
}: {
  k: string;
  v: number;
  sub: string;
  color: string;
  format?: (n: number) => string;
  suffix?: string;
}) {
  return (
    <div
      style={{
        position: 'relative',
        padding: '18px 18px 16px',
        background: 'rgba(255,255,255,.02)',
        border: '1px solid rgba(255,255,255,.06)',
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Bracket pos="tl" color={C} m={4} size={7} />
      <Bracket pos="br" color={C} m={4} size={7} />
      <div
        style={{
          fontSize: 9.5, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase',
          letterSpacing: 1.2, fontFamily: MONO,
        }}
      >
        {k}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
        <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1.2, color, lineHeight: 1 }}>
          <Counter value={v} format={format ?? ((n) => n.toLocaleString())} />
        </span>
        {suffix && <span style={{ fontSize: 16, color, fontWeight: 500 }}>{suffix}</span>}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 5 }}>{sub}</div>
    </div>
  );
}

function HeroPortrait() {
  return (
    <div
      style={{
        position: 'relative', width: '100%', aspectRatio: '1 / 1.05',
        maxWidth: 320,
        borderRadius: 18,
        background: `linear-gradient(135deg, ${C}22, ${C2}22)`,
        border: '1px solid rgba(255,255,255,.08)',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Bracket pos="tl" color={C} />
      <Bracket pos="tr" color={C} />
      <Bracket pos="bl" color={C} />
      <Bracket pos="br" color={C} />
      <div
        style={{
          fontSize: 168, fontWeight: 700, letterSpacing: -8,
          background: `linear-gradient(135deg, ${C} 0%, ${C2} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1, paddingTop: 16,
        }}
      >
        BO
      </div>
      <div style={{ position: 'absolute', top: 14, left: 14, fontSize: 9.5, color: 'rgba(255,255,255,.4)', fontFamily: MONO, letterSpacing: 1 }}>
        ID · BO_001
      </div>
      <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 9.5, color: 'rgba(255,255,255,.4)', fontFamily: MONO, letterSpacing: 1 }}>
        v2026.05
      </div>
      <div
        style={{
          position: 'absolute', bottom: 14, left: 14, right: 14,
          display: 'flex', justifyContent: 'space-between',
          fontSize: 9.5, color: 'rgba(255,255,255,.55)', fontFamily: MONO, letterSpacing: 0.8,
        }}
      >
        <span>{PROFILE.location.toUpperCase()}</span>
        <span style={{ color: C }}>● ONLINE</span>
      </div>
      <div
        style={{
          position: 'absolute', inset: 36,
          border: `1px solid ${C}33`, borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute', top: 44, bottom: 44, left: '50%', width: 1,
          background: `linear-gradient(180deg, transparent, ${C}66, transparent)`,
        }}
      />
    </div>
  );
}

function BtnPrimary({ children, href }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      style={{
        padding: '12px 22px', borderRadius: 8,
        background: '#fff', color: BG,
        cursor: 'pointer', textDecoration: 'none',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
        transition: 'transform .12s, box-shadow .15s',
        display: 'inline-block',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = `0 10px 30px ${C}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {children}
    </a>
  );
}

function BtnSecondary({ children, href }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      style={{
        padding: '12px 22px', borderRadius: 8,
        background: 'rgba(255,255,255,.04)', color: '#fff',
        border: '1px solid rgba(255,255,255,.1)',
        textDecoration: 'none',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        transition: 'background .12s, border-color .12s',
        display: 'inline-block',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,.07)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,.04)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)';
      }}
    >
      {children}
    </a>
  );
}

function BtnGhost({ children, href }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        padding: '12px 16px', borderRadius: 8,
        background: 'transparent', color: 'rgba(255,255,255,.65)',
        textDecoration: 'none',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        transition: 'color .12s',
        display: 'inline-block',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.65)')}
    >
      {children}
    </a>
  );
}

// ─── About ────────────────────────────────────────────────────────

function About() {
  const principles = [
    { n: '01', t: 'Model the flow first',       d: 'Whether intersections or interfaces — I sketch state, edges, failure modes before pixels.' },
    { n: '02', t: 'Optimize for the slow path', d: 'Edge cases are the product. Smooth them and the happy path takes care of itself.' },
    { n: '03', t: 'Ship, measure, iterate',     d: 'Real users beat hypotheticals. Always.' },
  ];

  return (
    <section id="about" style={{ scrollMarginTop: 80 }}>
      <SectionHead
        chip="// 02 · ABOUT"
        title="Two careers, one obsession"
        accent={C}
        sub="I started modeling intersections and watching cities breathe. Then I realized frontends are traffic systems too: route attention, smooth congestion, optimize latency. I've been building them ever since."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'var(--about-cols)', gap: 16 }}>
        <Reveal>
          <Panel label="STORY" code="// about.md" accent={C}>
            <div style={{ lineHeight: 1.7, color: 'rgba(255,255,255,.78)', fontSize: 14.5, maxWidth: 620 }}>
              <p style={{ margin: 0 }}>
                I&apos;m a <span style={{ color: '#fff', fontWeight: 500 }}>Road &amp; Transport Engineer</span> who
                fell in love with web frontends somewhere between modeling a signalized intersection in Vissim
                and trying to make a React form not feel like one.
              </p>
              <p style={{ margin: '12px 0 0' }}>
                Today I split my time between freelance frontend work and side projects.
                The most consequential of those is <span style={{ color: C, fontWeight: 500 }}>Tripvice.net</span> — an
                AI travel planner I co-created. I built the frontend, the itinerary canvas, and the streaming response UI.
              </p>
              <p style={{ margin: '12px 0 0' }}>
                I&apos;m fluent in both vocabularies: signal timing diagrams and React DevTools, microsimulation
                models and design systems. That overlap is rarer than it should be, and it shapes how I build.
              </p>
            </div>
            <div
              style={{
                marginTop: 22, paddingTop: 18,
                borderTop: '1px dashed rgba(255,255,255,.08)',
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18,
              }}
            >
              <FactBlock k="Based in" v={PROFILE.location} />
              <FactBlock k="Languages" v="EN · SR · DE (A2)" />
              <FactBlock k="Workspace" v="Remote · Hybrid" />
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={80}>
          <Panel label="APPROACH" code="// principles" accent={C2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {principles.map((p) => (
                <div key={p.n} style={{ display: 'grid', gridTemplateColumns: '34px 1fr', gap: 12 }}>
                  <span
                    style={{
                      fontFamily: MONO, fontSize: 12,
                      color: C2, letterSpacing: 0.5, paddingTop: 2,
                    }}
                  >
                    {p.n}
                  </span>
                  <div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{p.t}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginTop: 4, lineHeight: 1.55 }}>
                      {p.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>
      </div>
    </section>
  );
}

function FactBlock({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 9.5, color: 'rgba(255,255,255,.4)',
          fontFamily: MONO,
          letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4,
        }}
      >
        {k}
      </div>
      <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{v}</div>
    </div>
  );
}

// ─── Skills ───────────────────────────────────────────────────────

function Skills() {
  const avgFe = Math.round(SKILLS_FRONTEND.reduce((a, b) => a + b.level, 0) / SKILLS_FRONTEND.length);
  return (
    <section id="skills" style={{ scrollMarginTop: 80 }}>
      <SectionHead
        chip="// 03 · SKILLS"
        code=" :: matrix"
        title="Built for both worlds"
        accent={C}
        sub="Self-assessed on a /100 scale. The radar is the frontend stack I use day-to-day; the bars are the engineering side."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'var(--skills1-cols)', gap: 16 }}>
        <Reveal>
          <Panel
            label="FRONTEND · RADAR"
            code="// react.stack"
            accent={C}
            headerRight={
              <span
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,.5)',
                }}
              >
                <span style={{ width: 6, height: 6, background: C, borderRadius: 1 }} />
                avg <span style={{ color: '#fff' }}>{avgFe}</span>
              </span>
            }
          >
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <RadarChart data={SKILLS_FRONTEND} size={300} color={C} color2={C2} />
              <div
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)', pointerEvents: 'none',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: 1 }}>
                  AVG
                </div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', lineHeight: 1 }}>{avgFe}</div>
              </div>
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={80}>
          <Panel label="ENGINEERING · TRAFFIC" code="// transport" accent={C2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SKILLS_ENGINEERING.map((s, i) => (
                <SkillBar key={s.name} s={s} accent={C2} accent2={C} i={i} />
              ))}
            </div>
            <div
              style={{
                marginTop: 18, paddingTop: 14,
                borderTop: '1px dashed rgba(255,255,255,.08)',
                display: 'flex', flexWrap: 'wrap', gap: 6,
              }}
            >
              {['Microsimulation', 'Signal timing', 'OD matrices', 'Vissim API', 'GIS analysis', 'Capacity studies'].map((c) => (
                <span
                  key={c}
                  style={{
                    padding: '4px 9px', borderRadius: 4,
                    background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(255,255,255,.06)',
                    fontFamily: MONO, fontSize: 10,
                    color: 'rgba(255,255,255,.7)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </Panel>
        </Reveal>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'var(--skills2-cols)', gap: 16, marginTop: 16 }}>
        <Reveal>
          <Panel label="FRONTEND · DETAIL" code="// stack.json" accent={C}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 28px' }}>
              {SKILLS_FRONTEND.map((s, i) => (
                <SkillBar key={s.name} s={s} accent={C} accent2={C2} i={i} />
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={80}>
          <Panel
            label="ACTIVITY"
            code="// 12 weeks"
            accent={C}
            headerRight={
              <span style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,.55)' }}>
                <span style={{ color: '#fff' }}>{COMMITS_30D.reduce((a, b) => a + b, 0)}</span> commits
              </span>
            }
          >
            <Heatmap />
            <div
              style={{
                display: 'flex', justifyContent: 'space-between', marginTop: 10,
                fontFamily: MONO, fontSize: 9.5, color: 'rgba(255,255,255,.4)',
                letterSpacing: 0.5,
              }}
            >
              <span>12 weeks ago</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>less</span>
                {[0.1, 0.3, 0.55, 0.8, 1].map((o, i) => (
                  <span key={i} style={{ width: 8, height: 8, borderRadius: 2, background: C, opacity: o }} />
                ))}
                <span>more</span>
              </div>
              <span>today</span>
            </div>
          </Panel>
        </Reveal>
      </div>
    </section>
  );
}

function SkillBar({
  s, accent, accent2, i,
}: {
  s: { name: string; level: number };
  accent: string;
  accent2: string;
  i: number;
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: MONO, fontSize: 11,
          marginBottom: 5,
        }}
      >
        <span style={{ color: 'rgba(255,255,255,.85)' }}>{s.name}</span>
        <span style={{ color: accent, fontVariantNumeric: 'tabular-nums' }}>{s.level}</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%', width: s.level + '%',
            background: `linear-gradient(90deg, ${accent}, ${accent2})`,
            boxShadow: `0 0 6px ${accent}66`,
            animation: `portfolio-grow 1s ${i * 70}ms ease-out both`,
          }}
        />
      </div>
    </div>
  );
}

function Heatmap() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
      {Array.from({ length: 12 }).map((_, col) => (
        <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Array.from({ length: 7 }).map((_, row) => {
            const v = COMMITS_30D[col * 7 + row];
            const opacity = 0.1 + (v / 5) * 0.85;
            return (
              <div
                key={row}
                style={{
                  width: '100%', aspectRatio: '1',
                  background: v === 0 ? 'rgba(255,255,255,.04)' : C,
                  opacity: v === 0 ? 1 : opacity,
                  borderRadius: 2,
                  boxShadow: v > 3 ? `0 0 5px ${C}` : 'none',
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────

function Projects() {
  return (
    <section id="projects" style={{ scrollMarginTop: 80 }}>
      <SectionHead
        chip="// 04 · PROJECTS"
        code={` :: ${PROJECTS.length} items`}
        title="Selected work"
        accent={C}
        sub="A flagship and two learning vehicles. Hover to peek; click to expand."
        action={
          <a
            href="#"
            style={{
              fontSize: 12, color: 'rgba(255,255,255,.55)', textDecoration: 'none',
              fontFamily: MONO, letterSpacing: 0.5,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            see archive →
          </a>
        }
      />

      <Reveal>
        <FlagshipCard p={PROJECTS[0]} />
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'var(--other-cols)', gap: 16, marginTop: 16 }}>
        {PROJECTS.slice(1).map((p, i) => (
          <Reveal key={p.id} delay={i * 80}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FlagshipCard({ p }: { p: Project }) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,.022)',
        border: '1px solid rgba(255,255,255,.07)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <Bracket pos="tl" color={C} />
      <Bracket pos="tr" color={C} />
      <Bracket pos="bl" color={C} />
      <Bracket pos="br" color={C} />
      <div
        style={{
          position: 'absolute', top: -100, right: -80, width: 360, height: 360,
          background: `radial-gradient(circle, ${p.color}22, transparent 70%)`,
          filter: 'blur(20px)', pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px',
          borderBottom: '1px solid rgba(255,255,255,.05)',
          fontFamily: MONO, fontSize: 10,
          letterSpacing: 1.4, textTransform: 'uppercase',
          color: 'rgba(255,255,255,.42)',
          position: 'relative',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: C }}>▸</span> FLAGSHIP <span style={{ opacity: 0.55 }}>// project.001</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4ade80' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 5px #4ade80' }} />
          LIVE · {p.metrics.users} users
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'var(--flagship-cols)', minHeight: 360, position: 'relative' }}>
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span
              style={{
                padding: '3px 9px', borderRadius: 999,
                background: `${p.color}1a`, color: p.color,
                fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase',
                fontFamily: MONO,
              }}
            >
              {p.tag}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontFamily: MONO }}>
              {p.year} · {p.role}
            </span>
          </div>
          <h3
            style={{
              margin: 0, fontSize: 'var(--flagship-title-size)', fontWeight: 600, letterSpacing: -1.2,
              color: '#fff', lineHeight: 1,
              display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap',
            }}
          >
            {p.name}
            <span style={{ fontFamily: MONO, fontSize: 12, color: p.color, letterSpacing: 0 }}>
              ↗ {p.url}
            </span>
          </h3>
          <p
            style={{
              margin: '14px 0 18px', fontSize: 14.5, lineHeight: 1.6,
              color: 'rgba(255,255,255,.75)', maxWidth: 480,
            }}
          >
            {p.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
            {p.stack.map((s) => (
              <span
                key={s}
                style={{
                  padding: '4px 10px', borderRadius: 5,
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.06)',
                  fontFamily: MONO, fontSize: 11,
                  color: 'rgba(255,255,255,.78)',
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <div
            className="portfolio-flagship-meta"
            style={{
              paddingTop: 18, borderTop: '1px dashed rgba(255,255,255,.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: 28 }}>
              <MiniMetric k="Users"  v="4.2k"  color={C} />
              <MiniMetric k="Rating" v="4.7★" color="#fbbf24" />
              <MiniMetric k="Status" v="live"  color="#4ade80" />
            </div>
            <a
              href={`https://${p.url}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 7,
                background: '#fff', color: BG, textDecoration: 'none',
                fontSize: 12, fontWeight: 600,
                transition: 'transform .12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
            >
              Visit tripvice.net <span>↗</span>
            </a>
          </div>
        </div>

        <TripvicePreview />
      </div>
    </div>
  );
}

function MiniMetric({ k, v, color }: { k: string; v: string; color: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 9.5, color: 'rgba(255,255,255,.45)',
          fontFamily: MONO,
          letterSpacing: 1.2, textTransform: 'uppercase',
        }}
      >
        {k}
      </div>
      <div style={{ fontSize: 16, color, fontWeight: 600, marginTop: 3 }}>{v}</div>
    </div>
  );
}

function TripvicePreview() {
  const days = [
    { d: 'Day 1', t: 'Alfama walk · Pastéis at Manteigaria · Fado night',   c: C  },
    { d: 'Day 2', t: 'Belém · Time Out Market · Sunset at Miradouro',       c: C2 },
    { d: 'Day 3', t: 'Sintra day-trip · Pena Palace · seafood in Cascais',  c: C  },
    { d: 'Day 4', t: 'LX Factory · vintage trams · rooftop bars',           c: C2 },
  ];
  return (
    <div
      className="portfolio-tripvice-preview"
      style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${C}0e, ${C2}0e)`,
        borderLeft: '1px solid rgba(255,255,255,.06)',
        padding: '24px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}
        viewBox="0 0 200 200"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 10} x2="200" y2={i * 10} stroke="#fff" strokeWidth="0.2" />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={'v' + i} x1={i * 10} y1="0" x2={i * 10} y2="200" stroke="#fff" strokeWidth="0.2" />
        ))}
      </svg>

      <div
        style={{
          position: 'relative', width: '100%', maxWidth: 380,
          padding: 18, borderRadius: 12,
          background: 'rgba(6,7,11,.85)',
          border: '1px solid rgba(255,255,255,.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,.45)',
        }}
      >
        <div
          style={{
            position: 'absolute', top: -10, right: 16,
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(6,7,11,.95)',
            border: '1px solid rgba(255,255,255,.1)',
            fontFamily: MONO, fontSize: 9.5,
            color: 'rgba(255,255,255,.7)', letterSpacing: 0.5,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: C, boxShadow: `0 0 5px ${C}` }} />
          live preview
        </div>

        <div
          style={{
            padding: '10px 12px', borderRadius: 7,
            background: 'rgba(255,255,255,.04)',
            border: '1px solid rgba(255,255,255,.06)',
            fontSize: 12, color: 'rgba(255,255,255,.9)',
            fontFamily: MONO,
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ color: C }}>›</span>
          <span style={{ flex: 1 }}>5 days in Lisbon, foodie, mid-range</span>
          <span style={{ width: 7, height: 13, background: C, animation: 'portfolio-blink 1s steps(2) infinite' }} />
        </div>

        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 14, marginBottom: 6,
            fontSize: 11, color: 'rgba(255,255,255,.55)',
          }}
        >
          <span>Itinerary · 4 days shown</span>
          <span style={{ fontFamily: MONO, color: C }}>generating…</span>
        </div>

        {days.map((d, i) => (
          <div
            key={i}
            style={{
              display: 'grid', gridTemplateColumns: '46px 1fr 14px', gap: 10, alignItems: 'center',
              padding: '9px 0',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,.05)',
              animation: `portfolio-fade-up .55s ${300 + i * 140}ms both`,
            }}
          >
            <span
              style={{
                padding: '3px 6px', borderRadius: 4,
                background: `${d.c}15`, color: d.c,
                fontSize: 10, fontWeight: 600,
                fontFamily: MONO, textAlign: 'center',
              }}
            >
              {d.d}
            </span>
            <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.88)', lineHeight: 1.4 }}>{d.t}</span>
            <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 12 }}>›</span>
          </div>
        ))}

        <div
          style={{
            marginTop: 10, paddingTop: 10,
            borderTop: '1px solid rgba(255,255,255,.05)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: 11,
          }}
        >
          <span style={{ color: 'rgba(255,255,255,.5)' }}>Estimated budget</span>
          <span style={{ color: '#fff', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>€820 — €1,140</span>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? 'rgba(255,255,255,.035)' : 'rgba(255,255,255,.022)',
        border: '1px solid ' + (hovered ? `${p.color}40` : 'rgba(255,255,255,.07)'),
        borderRadius: 12,
        padding: '20px 22px',
        transition: 'border-color .15s, transform .15s, background .15s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <Bracket pos="tl" color={p.color} m={5} size={7} />
      <Bracket pos="br" color={p.color} m={5} size={7} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: `${p.color}1a`, border: `1px solid ${p.color}40`,
              color: p.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: MONO, fontSize: 13, fontWeight: 700,
            }}
          >
            {p.name[0]}
          </span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{p.name}</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.5)', fontFamily: MONO, letterSpacing: 0.4, marginTop: 1 }}>
              {p.year} · {p.role} · {p.metrics.status}
            </div>
          </div>
        </div>
        <span
          style={{
            color: hovered ? p.color : 'rgba(255,255,255,.4)',
            fontSize: 18, transition: 'color .15s, transform .15s',
            transform: hovered ? 'translate(2px,-2px)' : 'none',
          }}
        >
          ↗
        </span>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,.68)', lineHeight: 1.55, minHeight: 60 }}>
        {p.summary}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
        {p.stack.map((s) => (
          <span
            key={s}
            style={{
              padding: '3px 8px', borderRadius: 4,
              background: 'rgba(255,255,255,.035)',
              fontFamily: MONO, fontSize: 10,
              color: 'rgba(255,255,255,.7)',
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Experience ───────────────────────────────────────────────────

function Experience() {
  return (
    <section id="experience" style={{ scrollMarginTop: 80 }}>
      <SectionHead
        chip="// 05 · TIMELINE"
        code=" :: experience.log"
        title="From signal timing to streaming UIs"
        accent={C}
        sub="Five years across two disciplines. The throughline: making complex systems legible."
      />

      <Reveal>
        <Panel padding={0} accent={C}>
          <div style={{ padding: '18px 24px' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute', left: 10, top: 12, bottom: 12, width: 1,
                  background: `linear-gradient(180deg, ${C}, rgba(255,255,255,.06))`,
                }}
              />
              {EXPERIENCE.map((e, i) => (
                <div
                  key={i}
                  className="portfolio-experience-row"
                  style={{
                    display: 'grid', gridTemplateColumns: 'var(--experience-cols)',
                    gap: 16, alignItems: 'flex-start',
                    padding: '14px 0',
                    borderBottom: i < EXPERIENCE.length - 1 ? '1px dashed rgba(255,255,255,.05)' : 'none',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={(ev) => (ev.currentTarget.style.background = 'rgba(255,255,255,.015)')}
                  onMouseLeave={(ev) => (ev.currentTarget.style.background = 'transparent')}
                >
                  <div
                    style={{
                      width: 20, position: 'relative',
                      display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 11, height: 11, borderRadius: '50%',
                        background: e.kind === 'edu' ? BG : C,
                        border: `1.5px solid ${e.kind === 'edu' ? C2 : C}`,
                        boxShadow: `0 0 10px ${e.kind === 'edu' ? C2 : C}66`,
                        zIndex: 1,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: MONO, fontSize: 12,
                      color: 'rgba(255,255,255,.5)', paddingTop: 5,
                    }}
                  >
                    {e.year}
                  </span>
                  <div style={{ paddingTop: 2 }}>
                    <div style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>
                      {e.role}{' '}
                      <span style={{ color: 'rgba(255,255,255,.5)', fontWeight: 400 }}>· {e.org}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginTop: 4, lineHeight: 1.5 }}>
                      {e.detail}
                    </div>
                  </div>
                  <span
                    style={{
                      justifySelf: 'end', alignSelf: 'flex-start', marginTop: 4,
                      padding: '3px 10px', borderRadius: 999,
                      background: e.kind === 'edu' ? `${C2}14` : `${C}14`,
                      color: e.kind === 'edu' ? C2 : C,
                      fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
                      fontFamily: MONO, textTransform: 'uppercase',
                    }}
                  >
                    {e.kind === 'edu' ? 'education' : 'work'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </Reveal>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" style={{ scrollMarginTop: 80 }}>
      <SectionHead chip="// 06 · CONTACT" code=" :: handshake" title="Let's build something" accent={C} />

      <Reveal>
        <div
          className="portfolio-contact-card"
          style={{
            position: 'relative',
            padding: '40px 44px',
            background: `linear-gradient(135deg, ${C}10 0%, transparent 50%, ${C2}10 100%)`,
            border: '1px solid rgba(255,255,255,.07)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <Bracket pos="tl" color={C} />
          <Bracket pos="tr" color={C} />
          <Bracket pos="bl" color={C} />
          <Bracket pos="br" color={C} />
          <div
            style={{
              position: 'absolute', top: -100, left: '40%', width: 500, height: 300,
              background: `radial-gradient(ellipse, ${C}22, transparent 70%)`,
              filter: 'blur(30px)', pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid', gridTemplateColumns: 'var(--contact-cols)', gap: 44,
              alignItems: 'center', position: 'relative',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: MONO, fontSize: 11,
                  color: C, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12,
                }}
              >
                <span style={{ color: C }}>$</span> hire bogdan --start asap
              </div>
              <h3
                style={{
                  margin: 0, fontSize: 'var(--contact-title-size)', fontWeight: 600, letterSpacing: -1.2,
                  color: '#fff', lineHeight: 1.05, maxWidth: 500,
                }}
              >
                Got a flow that needs untangling?
              </h3>
              <p
                style={{
                  margin: '14px 0 0', fontSize: 15,
                  color: 'rgba(255,255,255,.7)', maxWidth: 480, lineHeight: 1.55,
                }}
              >
                I take on a handful of freelance projects each quarter — frontend builds,
                design-system work, or anything sitting at the intersection of UI and
                physical systems. Pick a channel below.
              </p>
              <div style={{ display: 'flex', gap: 18, marginTop: 22, fontSize: 12, color: 'rgba(255,255,255,.55)', flexWrap: 'wrap' }}>
                <span><span style={{ color: '#4ade80' }}>●</span> Response within 24h</span>
                <span><span style={{ color: C }}>●</span> Remote-first</span>
                <span><span style={{ color: C2 }}>●</span> EU friendly hours</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <ContactLink k="Email" v={PROFILE.email} href={`mailto:${PROFILE.email}`} primary />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <ContactLink k="GitHub"   v={`@${PROFILE.github}`} href={PROFILE.githubUrl} />
                <ContactLink k="LinkedIn" v="in/bogdan-o"          href={PROFILE.linkedinUrl} />
              </div>
              <ContactLink k="Location" v={`${PROFILE.location} · CET`} isStatic />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ContactLink({
  k, v, href, primary, isStatic,
}: {
  k: string;
  v: string;
  href?: string;
  primary?: boolean;
  isStatic?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const commonStyle: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: primary ? '15px 18px' : '12px 16px', borderRadius: 10,
    background: hover ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.04)',
    border: `1px solid ${hover ? C + '66' : 'rgba(255,255,255,.08)'}`,
    textDecoration: 'none', color: '#fff',
    transition: 'background .12s, border-color .12s, transform .12s',
    transform: hover && !isStatic ? 'translateY(-1px)' : 'none',
    cursor: isStatic ? 'default' : 'pointer',
  };
  const inner = (
    <>
      <div>
        <div
          style={{
            fontSize: 10, color: 'rgba(255,255,255,.5)',
            fontFamily: MONO, letterSpacing: 1, textTransform: 'uppercase',
          }}
        >
          {k}
        </div>
        <div style={{ fontSize: primary ? 16 : 13.5, fontWeight: 500, marginTop: 3 }}>{v}</div>
      </div>
      {!isStatic && <span style={{ color: C, fontSize: primary ? 22 : 16 }}>→</span>}
    </>
  );
  if (isStatic) {
    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={commonStyle}
      >
        {inner}
      </div>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={commonStyle}
    >
      {inner}
    </a>
  );
}

// ─── Footer ───────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 11, color: 'rgba(255,255,255,.4)',
        fontFamily: MONO, letterSpacing: 0.3, flexWrap: 'wrap', gap: 10,
      }}
    >
      <span>© 2026 Bogdan Obradović · Kragujevac, RS</span>
      <span style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <span><span style={{ color: C }}>●</span> all systems operational</span>
        <span>last deploy · <LiveClock /></span>
      </span>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────

export default function Page() {
  const [active, setActive] = useState('overview');

  useEffect(() => {
    const ids = ['overview', 'about', 'skills', 'projects', 'experience', 'contact'];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      style={{
        width: '100%', minHeight: '100vh',
        background: BG,
        color: '#e4e4e7',
        fontFamily: 'var(--font-space-grotesk), Inter, system-ui, sans-serif',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'var(--page-cols)',
      }}
    >
      {/* ambient gradients */}
      <div
        style={{
          position: 'fixed', top: -260, left: '12%', width: 900, height: 700,
          background: `radial-gradient(ellipse, rgba(0,255,209,.35), transparent 60%)`,
          filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed', top: '40%', right: '-10%', width: 720, height: 700,
          background: `radial-gradient(ellipse, rgba(124,92,255,.32), transparent 60%)`,
          filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
        }}
      />
      {/* grid + mask overlay */}
      <div
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 75% 50% at 50% 30%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 50% at 50% 30%, #000 30%, transparent 80%)',
        }}
      />

      <Sidebar active={active} />

      <main style={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
        <TopBar />
        <div
          style={{
            padding: 'var(--main-pad)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--section-gap)',
          }}
        >
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
          <Footer />
        </div>
      </main>
    </div>
  );
}
