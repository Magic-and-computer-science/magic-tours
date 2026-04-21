import type { Card } from "../gilbreath-principle";

const SUIT_NAMES: Record<string, string> = {
  "♥": "cœur",
  "♠": "pique",
  "♦": "carreau",
  "♣": "trèfle",
};

export function CardChip({
  card,
  size = "md",
}: {
  card: Card;
  size?: "sm" | "md";
}) {
  const isRed = card.color === "red";
  const w = size === "sm" ? "40px" : "50px";
  const h = size === "sm" ? "54px" : "68px";
  const fSuit = size === "sm" ? "1rem" : "1.25rem";
  const fLabel = size === "sm" ? "0.58rem" : "0.68rem";
  const colorLabel = isRed ? "Rouge" : "Noir";
  const suitLabel = SUIT_NAMES[card.suit] ?? card.suit;

  return (
    <div
      role="img"
      aria-label={`Carte ${colorLabel}, ${suitLabel}`}
      style={{
        width: w,
        height: h,
        borderRadius: "8px",
        background: isRed
          ? "linear-gradient(160deg, #7f1d1d 0%, #3b0808 100%)"
          : "linear-gradient(160deg, #1e293b 0%, #0c1627 100%)",
        border: `2px solid ${isRed ? "rgba(239,68,68,0.65)" : "rgba(71,85,105,0.65)"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1px",
        boxShadow: isRed
          ? "0 0 10px rgba(239,68,68,0.22), inset 0 1px 0 rgba(255,255,255,0.07)"
          : "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        flexShrink: 0,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontSize: fSuit,
          color: isRed ? "#f87171" : "#64748b",
          lineHeight: 1,
        }}
      >
        {card.suit}
      </span>
      <span
        aria-hidden="true"
        style={{
          fontSize: fLabel,
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: isRed ? "#fca5a5" : "#94a3b8",
        }}
      >
        {isRed ? "R" : "N"}
      </span>
    </div>
  );
}
