import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

const GOLD = "#C9A84C";
const CARD_W = 340;
const CARD_H = 420;
const CARD_RADIUS = 32;
const STEP_FRAMES = 90;
const TRANS_FRAMES = 20;
const N_CARDS = 12;

const cards = [
  { title: "Fintax –\nAnálise Financeira\nTributária", icon: "finance" },
  { title: "Previdenciário –\nRevisão da Folha\nde Pagamento", icon: "person" },
  { title: "PRT –\nPlanejamento e\nRevisão Tributária", icon: "document" },
  { title: "Transação\nTributária", icon: "handshake" },
  { title: "Drawback", icon: "arrow" },
  { title: "Lei do Bem –\nIncentivos Fiscais\nà Inovação", icon: "lightbulb" },
  { title: "Mapa Fiscal –\nRegime Tributário", icon: "map" },
  { title: "Consultoria em\nReforma Tributária", icon: "consult" },
  { title: "Teses Judiciais –\nAções Jurídico\nTributárias", icon: "scales" },
  { title: "Classificação\nde Produtos", icon: "grid" },
  { title: "Consultoria em\nReforma Tributária", icon: "consult" },
  { title: "Mapa Fiscal –\nRegime Tributário", icon: "map" },
];

type Pos = { x: number; y: number; rot: number; scale: number; darkness: number };

const POS_OFF_LEFT: Pos  = { x: -920, y:  60, rot: -8, scale: 0.82, darkness: 1 };
const POS_LEFT: Pos      = { x: -430, y:  60, rot: -8, scale: 0.82, darkness: 1 };
const POS_CENTER: Pos    = { x:    0, y: -20, rot:  0, scale: 1.00, darkness: 0 };
const POS_RIGHT: Pos     = { x:  430, y:  60, rot:  8, scale: 0.82, darkness: 1 };
const POS_OFF_RIGHT: Pos = { x:  920, y:  60, rot:  8, scale: 0.82, darkness: 1 };

function lerpPos(a: Pos, b: Pos, t: number): Pos {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    rot: a.rot + (b.rot - a.rot) * t,
    scale: a.scale + (b.scale - a.scale) * t,
    darkness: a.darkness + (b.darkness - a.darkness) * t,
  };
}

function darknessToColors(d: number) {
  const bgV   = Math.round(255 - 229 * d);
  const txtV  = Math.round(26  + 229 * d);
  return {
    bg:   `rgb(${bgV},${bgV},${bgV})`,
    text: `rgb(${txtV},${txtV},${txtV})`,
  };
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const FinanceIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="7" stroke={GOLD} strokeWidth="1.5" />
    <line x1="12" y1="12" x2="12" y2="7"  stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="12" x2="16" y2="14" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1" fill={GOLD} />
  </svg>
);

const PersonIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4" stroke={GOLD} strokeWidth="1.5" />
    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke={GOLD} strokeWidth="1.5" />
    <line x1="8" y1="8"  x2="16" y2="8"  stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="8" y1="12" x2="16" y2="12" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="8" y1="16" x2="13" y2="16" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const HandshakeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M2 12h3l3-4 4 2 4-2 3 4h3" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12v4a2 2 0 002 2h10a2 2 0 002-2v-4" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M4 12a8 8 0 108-8" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
    <polyline points="4,8 4,12 8,12" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M9 21h6M10 17h4M12 2a7 7 0 00-4 12.74V17h8v-2.26A7 7 0 0012 2z" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MapIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="9" y1="3" x2="9" y2="18" stroke={GOLD} strokeWidth="1.2" />
    <line x1="15" y1="6" x2="15" y2="21" stroke={GOLD} strokeWidth="1.2" />
  </svg>
);

const ConsultIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="3.5" stroke={GOLD} strokeWidth="1.5" />
    <path d="M2 20c0-3.9 3.1-7 7-7" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="18" cy="17" r="3" stroke={GOLD} strokeWidth="1.5" />
    <line x1="18" y1="13" x2="18" y2="14" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="18" y1="20" x2="18" y2="21" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14" y1="17" x2="15" y2="17" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="21" y1="17" x2="22" y2="17" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ScalesIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="2"  x2="12" y2="22" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="3"  y1="7"  x2="21" y2="7"  stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 7L1 13c0 1.7 2 2.5 2 2.5S5 14.7 5 13L3 7z"  stroke={GOLD} strokeWidth="1.3" fill="none" />
    <path d="M21 7l-2 6c0 1.7 2 2.5 2 2.5s2-.8 2-2.5L21 7z" stroke={GOLD} strokeWidth="1.3" fill="none" />
    <line x1="9" y1="22" x2="15" y2="22" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GridIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect x="3"  y="3"  width="7" height="7" rx="1" stroke={GOLD} strokeWidth="1.5" />
    <rect x="14" y="3"  width="7" height="7" rx="1" stroke={GOLD} strokeWidth="1.5" />
    <rect x="3"  y="14" width="7" height="7" rx="1" stroke={GOLD} strokeWidth="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1" stroke={GOLD} strokeWidth="1.5" />
  </svg>
);

const ICONS: Record<string, React.FC> = {
  finance: FinanceIcon,
  person: PersonIcon,
  document: DocumentIcon,
  handshake: HandshakeIcon,
  arrow: ArrowIcon,
  lightbulb: LightbulbIcon,
  map: MapIcon,
  consult: ConsultIcon,
  scales: ScalesIcon,
  grid: GridIcon,
};

// ─── Card ─────────────────────────────────────────────────────────────────────

const CardItem: React.FC<{ title: string; icon: string; pos: Pos; zIndex: number }> = ({
  title, icon, pos, zIndex,
}) => {
  const { bg, text } = darknessToColors(pos.darkness);
  const Icon = ICONS[icon];
  const shadow = pos.darkness < 0.5
    ? `0 24px 64px rgba(0,0,0,${0.22 * (1 - pos.darkness)})`
    : "none";

  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: CARD_W,
      height: CARD_H,
      transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${pos.rot}deg) scale(${pos.scale})`,
      transformOrigin: "center center",
      backgroundColor: bg,
      borderRadius: CARD_RADIUS,
      zIndex,
      boxShadow: shadow,
      padding: "30px 28px 28px",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    }}>
      {/* Gold icon circle */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: `1.5px solid ${GOLD}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {Icon && <Icon />}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Title */}
      <div style={{
        color: text,
        fontSize: 22,
        fontWeight: 500,
        lineHeight: 1.4,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        whiteSpace: "pre-line",
        letterSpacing: "-0.01em",
        marginBottom: 20,
      }}>
        {title}
      </div>

      {/* Short gold accent line */}
      <div style={{ width: 44, height: 2, backgroundColor: GOLD, borderRadius: 1 }} />
    </div>
  );
};

// ─── Background ───────────────────────────────────────────────────────────────

const Background: React.FC = () => (
  <AbsoluteFill>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Large platform circle — creates the curved table surface */}
      <circle cx="960" cy="1260" r="980" fill="white" fillOpacity="0.62" />
      {/* Upper-left ambient arc */}
      <circle cx="160" cy="300" r="680" fill="white" fillOpacity="0.28" />
      {/* Subtle inner glow behind cards */}
      <ellipse cx="960" cy="600" rx="560" ry="280" fill="white" fillOpacity="0.18" />
      {/* Decorative gold orbs — bottom-left */}
      <circle cx="88"  cy="928" r="20" fill={GOLD} fillOpacity="0.88" />
      <circle cx="122" cy="966" r="12" fill={GOLD} fillOpacity="0.65" />
      <circle cx="62"  cy="968" r="7"  fill={GOLD} fillOpacity="0.45" />
    </svg>
  </AbsoluteFill>
);

// ─── Connecting lines ─────────────────────────────────────────────────────────

const ConnectingLines: React.FC<{ lp: Pos; cp: Pos; rp: Pos }> = ({ lp, cp, rp }) => {
  const W = 1920, H = 1080;
  const ox = W / 2, oy = H / 2;
  const DOT = 4.5;

  // Approximate right edge of left card and left edge of center card
  const lRx = ox + lp.x + (CARD_W / 2) * lp.scale;
  const lRy = oy + lp.y;
  const cLx = ox + cp.x - (CARD_W / 2) * cp.scale;
  const cLy = oy + cp.y;

  // Right edge of center card and left edge of right card
  const cRx = ox + cp.x + (CARD_W / 2) * cp.scale;
  const cRy = oy + cp.y;
  const rLx = ox + rp.x - (CARD_W / 2) * rp.scale;
  const rLy = oy + rp.y;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <line x1={lRx} y1={lRy} x2={cLx} y2={cLy} stroke={GOLD} strokeWidth="1" strokeOpacity="0.55" />
        <circle cx={lRx} cy={lRy} r={DOT} fill={GOLD} fillOpacity="0.75" />
        <circle cx={cLx} cy={cLy} r={DOT} fill={GOLD} fillOpacity="0.75" />

        <line x1={cRx} y1={cRy} x2={rLx} y2={rLy} stroke={GOLD} strokeWidth="1" strokeOpacity="0.55" />
        <circle cx={cRx} cy={cRy} r={DOT} fill={GOLD} fillOpacity="0.75" />
        <circle cx={rLx} cy={rLy} r={DOT} fill={GOLD} fillOpacity="0.75" />
      </svg>
    </AbsoluteFill>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────

export const CardCarousel: React.FC = () => {
  const frame = useCurrentFrame();

  const step = Math.floor(frame / STEP_FRAMES);
  const frameInStep = frame % STEP_FRAMES;

  // t: 0→1 during first TRANS_FRAMES of each step, then clamped at 1
  const t = interpolate(frameInStep, [0, TRANS_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // At step S hold: left=cards[S+1], center=cards[S], right=cards[S-1]
  // Transition S-1→S: entering(S+1) offLeft→left, leftCard(S) left→center,
  //                   centerCard(S-1) center→right, exiting(S-2) right→offRight
  const enteringIdx = (step + 1)          % N_CARDS;
  const leftIdx     =  step               % N_CARDS;
  const centerIdx   = (step - 1 + N_CARDS) % N_CARDS;
  const exitingIdx  = (step - 2 + N_CARDS) % N_CARDS;

  const enteringPos = lerpPos(POS_OFF_LEFT,  POS_LEFT,      t);
  const leftPos     = lerpPos(POS_LEFT,      POS_CENTER,    t);
  const centerPos   = lerpPos(POS_CENTER,    POS_RIGHT,     t);
  const exitingPos  = lerpPos(POS_RIGHT,     POS_OFF_RIGHT, t);

  const zOf = (p: Pos) => Math.round((1 - p.darkness) * 10);

  return (
    <AbsoluteFill style={{ backgroundColor: "#F0EDE8", overflow: "hidden" }}>
      <Background />
      {/* Lines connect the 3 "settled" positions after the transition */}
      <ConnectingLines lp={enteringPos} cp={leftPos} rp={centerPos} />
      {/* Render back-to-front so center card is always on top */}
      <CardItem title={cards[exitingIdx].title}  icon={cards[exitingIdx].icon}  pos={exitingPos}  zIndex={zOf(exitingPos)}  />
      <CardItem title={cards[enteringIdx].title} icon={cards[enteringIdx].icon} pos={enteringPos} zIndex={zOf(enteringPos)} />
      <CardItem title={cards[centerIdx].title}   icon={cards[centerIdx].icon}   pos={centerPos}   zIndex={zOf(centerPos)}   />
      <CardItem title={cards[leftIdx].title}     icon={cards[leftIdx].icon}     pos={leftPos}     zIndex={zOf(leftPos)}     />
    </AbsoluteFill>
  );
};
