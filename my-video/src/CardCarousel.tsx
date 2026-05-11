import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

const NUM_CARDS = 12;
const FPC = 90; // frames per cycle
const TRANS_END = 20;
const PREROLL_START = 70;

const GOLD = '#C4A24A';
const DARK = '#1A1A1A';
const WHITE = '#FFFFFF';
const BG = '#F0EDE8';

const CARDS = [
  { icon: 'chart',     title: 'Fintax –\nAnálise Financeira\nTributária' },
  { icon: 'person',    title: 'Previdenciário –\nRevisão da Folha\nde Pagamento' },
  { icon: 'bar-chart', title: 'PRT –\nPlanejamento e\nRevisão Tributária' },
  { icon: 'handshake', title: 'Transação\nTributária' },
  { icon: 'globe',     title: 'Drawback' },
  { icon: 'lightbulb', title: 'Lei do Bem –\nIncentivos Fiscais\nà Inovação' },
  { icon: 'document',  title: 'Mapa Fiscal –\nRegime Tributário' },
  { icon: 'person',    title: 'Consultoria em\nReforma Tributária' },
  { icon: 'scales',    title: 'Teses Judiciais –\nAções Jurídico\nTributárias' },
  { icon: 'box',       title: 'Classificação\nde Produtos' },
  { icon: 'person',    title: 'Consultoria em\nReforma Tributária' },
  { icon: 'document',  title: 'Mapa Fiscal –\nRegime Tributário' },
];

// Position centers (x, y) for 1920×1080
const POS_CENTER = { x: 960,   y: 500 };
const POS_LEFT   = { x: 462,   y: 578 };
const POS_RIGHT  = { x: 1458,  y: 578 };
const POS_ENTER  = { x: -120,  y: 578 };
const POS_EXIT   = { x: 2040,  y: 578 };

// Card dimensions
const CW = 340;
const CH = 400;

// Style snapshots per named position
interface PosStyle { x: number; y: number; scale: number; rotate: number; opacity: number; dark: boolean }

const S_CENTER: PosStyle = { ...POS_CENTER, scale: 1.00, rotate:  0, opacity: 1, dark: false };
const S_LEFT:   PosStyle = { ...POS_LEFT,   scale: 0.82, rotate: -8, opacity: 1, dark: true  };
const S_RIGHT:  PosStyle = { ...POS_RIGHT,  scale: 0.82, rotate:  8, opacity: 1, dark: true  };
const S_ENTER:  PosStyle = { ...POS_ENTER,  scale: 0.82, rotate: -8, opacity: 0, dark: true  };
const S_EXIT:   PosStyle = { ...POS_EXIT,   scale: 0.82, rotate:  8, opacity: 0, dark: true  };

function lerpStyle(a: PosStyle, b: PosStyle, t: number): PosStyle {
  return {
    x:       a.x       + (b.x       - a.x)       * t,
    y:       a.y       + (b.y       - a.y)       * t,
    scale:   a.scale   + (b.scale   - a.scale)   * t,
    rotate:  a.rotate  + (b.rotate  - a.rotate)  * t,
    opacity: a.opacity + (b.opacity - a.opacity) * t,
    dark:    t < 0.5 ? a.dark : b.dark,
  };
}

// SVG icon paths (24×24 viewBox, stroke-based)
const ICON_PATHS: Record<string, React.ReactNode> = {
  'chart': (
    <polyline points="3,17 9,11 13,15 17,8 21,12" strokeWidth="1.8" fill="none" />
  ),
  'person': <>
    <circle cx="12" cy="7" r="4" strokeWidth="1.8" fill="none" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" strokeWidth="1.8" fill="none" />
  </>,
  'bar-chart': <>
    <rect x="4"  y="10" width="4" height="10" strokeWidth="1.8" fill="none" />
    <rect x="10" y="5"  width="4" height="15" strokeWidth="1.8" fill="none" />
    <rect x="16" y="13" width="4" height="7"  strokeWidth="1.8" fill="none" />
  </>,
  'handshake': (
    <path d="M4 12l4-4 4 2 4-2 4 4M4 12l2 6h12l2-6M8 18v-4M16 18v-4" strokeWidth="1.8" fill="none" />
  ),
  'globe': <>
    <circle cx="12" cy="12" r="9" strokeWidth="1.8" fill="none" />
    <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18" strokeWidth="1.8" fill="none" />
  </>,
  'lightbulb': (
    <path d="M9 21h6M10 17H14M12 3a7 7 0 0 1 4.9 11.9 3 3 0 0 1-.9 2.1H8a3 3 0 0 1-.9-2.1A7 7 0 0 1 12 3z" strokeWidth="1.8" fill="none" />
  ),
  'document': <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.8" fill="none" />
    <polyline points="14,2 14,8 20,8" strokeWidth="1.8" fill="none" />
    <line x1="8" y1="13" x2="16" y2="13" strokeWidth="1.8" />
    <line x1="8" y1="17" x2="12" y2="17" strokeWidth="1.8" />
  </>,
  'scales': (
    <path d="M12 3v18M5 8h14M5 8l-2 7a4 4 0 0 0 4 0L5 8zM19 8l2 7a4 4 0 0 1-4 0L19 8z" strokeWidth="1.8" fill="none" />
  ),
  'box': (
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeWidth="1.8" fill="none" />
  ),
};

const Icon: React.FC<{ icon: string; color: string; size?: number }> = ({ icon, color, size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {ICON_PATHS[icon] ?? ICON_PATHS['document']}
  </svg>
);

const Card: React.FC<{ cardIdx: number; style: PosStyle }> = ({ cardIdx, style }) => {
  const card = CARDS[cardIdx];
  const isDark = style.dark;
  const textColor = isDark ? WHITE : DARK;
  const iconColor = GOLD;
  const bg = isDark ? DARK : WHITE;
  const shadow = isDark ? 'none' : '0 24px 80px rgba(0,0,0,0.14), 0 4px 20px rgba(0,0,0,0.08)';

  return (
    <div
      style={{
        position: 'absolute',
        width: CW,
        height: CH,
        left: style.x - CW / 2,
        top: style.y - CH / 2,
        transform: `scale(${style.scale}) rotate(${style.rotate}deg)`,
        transformOrigin: 'center center',
        opacity: style.opacity,
        backgroundColor: bg,
        borderRadius: 32,
        boxShadow: shadow,
        padding: 32,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: `1.5px solid ${GOLD}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon icon={card.icon} color={iconColor} size={28} />
      </div>

      {/* Title */}
      <div
        style={{
          color: textColor,
          fontSize: isDark ? 22 : 26,
          fontWeight: isDark ? 300 : 400,
          lineHeight: 1.35,
          letterSpacing: '-0.01em',
          whiteSpace: 'pre-line',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          paddingTop: 12,
        }}
      >
        {card.title}
      </div>

      {/* Bottom gold line */}
      <div
        style={{
          width: 40,
          height: 1.5,
          backgroundColor: GOLD,
          borderRadius: 1,
          marginBottom: 4,
        }}
      />
    </div>
  );
};

// Background decorative arc circles
const BgArcs: React.FC = () => (
  <svg
    width="1920"
    height="1080"
    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
  >
    {/* Bottom-left large arc */}
    <circle cx="200" cy="1100" r="600" fill="none" stroke="#E0DDD8" strokeWidth="1.5" opacity="0.7" />
    <circle cx="150" cy="1050" r="500" fill="none" stroke="#E0DDD8" strokeWidth="1" opacity="0.5" />
    {/* Bottom-right large arc */}
    <circle cx="1720" cy="1100" r="600" fill="none" stroke="#E0DDD8" strokeWidth="1.5" opacity="0.7" />
    <circle cx="1770" cy="1050" r="500" fill="none" stroke="#E0DDD8" strokeWidth="1" opacity="0.5" />
    {/* Top center subtle arc */}
    <circle cx="960" cy="-80" r="520" fill="none" stroke="#E4E1DC" strokeWidth="1" opacity="0.4" />
    {/* Soft filled blobs */}
    <circle cx="180" cy="920" r="380" fill="#E8E5E0" opacity="0.35" />
    <circle cx="1740" cy="920" r="380" fill="#E8E5E0" opacity="0.35" />
  </svg>
);

// Gold decorative line with spheres
const GoldLine: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const lineY = 650;
  const sphereR = 9;
  const leftX = 58;
  const rightX = 1862;
  return (
    <svg
      width="1920"
      height="1080"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity }}
    >
      <line x1={leftX} y1={lineY} x2={rightX} y2={lineY} stroke={GOLD} strokeWidth="0.8" opacity="0.6" />
      <circle cx={leftX} cy={lineY} r={sphereR} fill={GOLD} opacity="0.85" />
      <circle cx={leftX} cy={lineY} r={sphereR - 3} fill="#D4B05A" opacity="0.6" />
      <circle cx={rightX} cy={lineY} r={sphereR} fill={GOLD} opacity="0.85" />
      <circle cx={rightX} cy={lineY} r={sphereR - 3} fill="#D4B05A" opacity="0.6" />
    </svg>
  );
};

const EASE = Easing.bezier(0.4, 0, 0.2, 1);

export const CardCarousel: React.FC = () => {
  const frame = useCurrentFrame();

  const cycleS = Math.floor(frame / FPC);
  const localF = frame % FPC;

  // Decide which cycle to render and at what transition progress t
  let renderCycle: number;
  let t: number;

  if (localF < PREROLL_START) {
    renderCycle = cycleS;
    t = interpolate(localF, [0, TRANS_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  } else {
    // Pre-roll: render next cycle's transition starting
    renderCycle = cycleS + 1;
    t = interpolate(localF, [PREROLL_START, FPC], [0, 0.28], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  }

  const S = renderCycle;

  // The 4 card indices for cycle S's transition:
  // - Exiting (was right in S-1):      (S - 2 + NUM_CARDS*2) % NUM_CARDS
  // - Center→Right (was center in S-1): (S - 1 + NUM_CARDS) % NUM_CARDS
  // - Left→Center (was left in S-1, = current center): S % NUM_CARDS
  // - Entering (new, becomes left):     (S + 1) % NUM_CARDS
  const idxExit    = ((S - 2) % NUM_CARDS + NUM_CARDS) % NUM_CARDS;
  const idxCtoR    = ((S - 1) % NUM_CARDS + NUM_CARDS) % NUM_CARDS;
  const idxLtoC    = S % NUM_CARDS;
  const idxEnter   = (S + 1) % NUM_CARDS;

  const styleExit  = lerpStyle(S_RIGHT,  S_EXIT,   t);
  const styleCtoR  = lerpStyle(S_CENTER, S_RIGHT,  t);
  const styleLtoC  = lerpStyle(S_LEFT,   S_CENTER, t);
  const styleEnter = lerpStyle(S_ENTER,  S_LEFT,   t);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: BG,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <BgArcs />
      <GoldLine />

      {/* Cards — z-order: exit behind, sides mid, center on top */}
      <Card cardIdx={idxExit}  style={styleExit}  />
      <Card cardIdx={idxEnter} style={styleEnter} />
      <Card cardIdx={idxCtoR}  style={styleCtoR}  />
      <Card cardIdx={idxLtoC}  style={styleLtoC}  />
    </div>
  );
};
