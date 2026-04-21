// Two fans of full card rectangles facing each other,
// inspired by the bridge position of a riffle shuffle.

type FanCard = {
  angle: number;
  fill: string;
  stroke: string;
  suit?: string;
  suitColor?: string;
  label?: string;
  labelColor?: string;
};

const LEFT_FAN: FanCard[] = [
  { angle: -32, fill: "#100808", stroke: "rgba(239,68,68,0.12)" },
  { angle: -16, fill: "#0f1525", stroke: "rgba(71,85,105,0.32)" },
  { angle: 0, fill: "#521515", stroke: "rgba(239,68,68,0.58)" },
  { angle: 16, fill: "#1a2538", stroke: "rgba(71,85,105,0.78)" },
  {
    angle: 32,
    fill: "#7f1d1d",
    stroke: "rgba(239,68,68,0.98)",
    suit: "♥",
    suitColor: "#f87171",
    label: "R",
    labelColor: "#fca5a5",
  },
];

const RIGHT_FAN: FanCard[] = [
  { angle: 32, fill: "#060810", stroke: "rgba(71,85,105,0.12)" },
  { angle: 16, fill: "#2d1010", stroke: "rgba(239,68,68,0.32)" },
  { angle: 0, fill: "#162035", stroke: "rgba(71,85,105,0.58)" },
  { angle: -16, fill: "#6a1a1a", stroke: "rgba(239,68,68,0.78)" },
  {
    angle: -32,
    fill: "#1e293b",
    stroke: "rgba(71,85,105,0.98)",
    suit: "♣",
    suitColor: "#64748b",
    label: "N",
    labelColor: "#94a3b8",
  },
];

// 7 interleaving cards that bridge the two inner fan edges
const CENTER_CARDS = Array.from({ length: 7 }, (_, i) => ({
  cx: 212 + i * 18,
  isLeft: i % 2 === 0,
}));

const W = 42;
const H = 58;
const RX = 6;

// A single card face, drawn from y=-H (top) to y=0 (pivot), centered on x=0
function Card({ c }: { c: FanCard }) {
  return (
    <g transform={`rotate(${c.angle})`}>
      <rect
        x={-W / 2}
        y={-H}
        width={W}
        height={H}
        rx={RX}
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth="1.5"
      />
      {c.suit && (
        <>
          <text
            x="0"
            y={-H * 0.58}
            textAnchor="middle"
            fontSize="18"
            fill={c.suitColor}
          >
            {c.suit}
          </text>
          <text
            x="0"
            y={-H * 0.28}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill={c.labelColor}
            letterSpacing="0.06em"
            fontFamily="monospace"
          >
            {c.label}
          </text>
        </>
      )}
    </g>
  );
}

export function RiffleIllustration() {
  return (
    <svg
      role="img"
      aria-label="Illustration d'un riffle shuffle : deux demi-paquets de cartes en éventail s'intercalent au centre pour former le paquet mélangé"
      viewBox="0 0 560 170"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        maxWidth: "540px",
        display: "block",
        margin: "0 auto 1.5rem",
      }}
    >
      {/* ── Labels ── */}
      <text
        x="155"
        y="19"
        textAnchor="middle"
        fontSize="10"
        fill="#4ecdc4"
        letterSpacing="2"
        fontFamily="monospace"
      >
        PAQUET 1
      </text>
      <text
        x="405"
        y="19"
        textAnchor="middle"
        fontSize="10"
        fill="#667eea"
        letterSpacing="2"
        fontFamily="monospace"
      >
        PAQUET 2
      </text>

      {/* ── Left fan — back cards first so front renders on top ── */}
      <g transform="translate(155, 155)">
        {LEFT_FAN.map((c, i) => (
          <Card key={i} c={c} />
        ))}
      </g>

      {/* ── Right fan ── */}
      <g transform="translate(405, 155)">
        {RIGHT_FAN.map((c, i) => (
          <Card key={i} c={c} />
        ))}
      </g>

      {/* ── Centre: interleaved cards from both halves ── */}
      {CENTER_CARDS.map(({ cx, isLeft }, i) => (
        <g
          key={i}
          transform={`translate(${cx}, 155) rotate(${isLeft ? 32 : -32})`}
        >
          <rect
            x={-W / 2}
            y={-H}
            width={W}
            height={H}
            rx={RX}
            fill={isLeft ? "#7f1d1d" : "#1e293b"}
            stroke={isLeft ? "rgba(239,68,68,0.95)" : "rgba(71,85,105,0.95)"}
            strokeWidth="1.5"
          />
        </g>
      ))}
    </svg>
  );
}
