import { useState, useCallback, useMemo } from "react";
import {
  createInitialDecks,
  riffleShuffle,
  analyzeGilbreath,
  type Card,
  type ShuffleResult,
} from "../gilbreath-principle.js";

function CardChip({ card, size = "md" }: { card: Card; size?: "sm" | "md" }) {
  const isRed = card.color === "red";
  const w = size === "sm" ? "40px" : "50px";
  const h = size === "sm" ? "54px" : "68px";
  const fSuit = size === "sm" ? "1rem" : "1.25rem";
  const fLabel = size === "sm" ? "0.58rem" : "0.68rem";

  return (
    <div
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
        style={{
          fontSize: fSuit,
          color: isRed ? "#f87171" : "#64748b",
          lineHeight: 1,
        }}
      >
        {card.suit}
      </span>
      <span
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

function PairBox({
  result,
  index,
}: {
  result: ShuffleResult["pairs"][number];
  index: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "10px 8px 8px",
        borderRadius: "12px",
        background: "rgba(0,0,0,0.25)",
        border: `1.5px solid ${result.valid ? "rgba(78,205,196,0.45)" : "rgba(239,68,68,0.45)"}`,
        boxShadow: result.valid
          ? "0 0 12px rgba(78,205,196,0.1)"
          : "0 0 12px rgba(239,68,68,0.15)",
      }}
    >
      <span
        style={{
          fontSize: "0.55rem",
          color: "#555",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        P{index + 1}
      </span>
      <div style={{ display: "flex", gap: "5px" }}>
        <CardChip card={result.a} size="sm" />
        <CardChip card={result.b} size="sm" />
      </div>
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: result.valid ? "#4ecdc4" : "#ef4444",
        }}
      >
        {result.valid ? "✓" : "✗"}
      </span>
    </div>
  );
}

export default function Gilbreath() {
  const { deck1, deck2 } = useMemo(() => createInitialDecks(), []);
  const [history, setHistory] = useState<ShuffleResult[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const [animating, setAnimating] = useState(false);

  const latest = history[history.length - 1] ?? null;
  const shuffleCount = history.length;
  const validCount = history.filter((r) => r.invariantHolds).length;

  const handleShuffle = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      const deck = riffleShuffle(deck1, deck2);
      setHistory((prev) => [...prev, analyzeGilbreath(deck)]);
      setAnimating(false);
    }, 280);
  }, [deck1, deck2, animating]);

  return (
    <div
      style={{
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        padding: "2rem",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
        color: "#e0e0e0",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 300,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#fff",
            marginBottom: "0.5rem",
            textShadow: "0 0 30px rgba(100, 200, 255, 0.3)",
          }}
        >
          Principe de Gilbreath
        </h1>
        <p
          style={{ fontSize: "0.85rem", color: "#888", letterSpacing: "0.1em" }}
        >
          Invariant de structure — préservé par tout riffle shuffle
        </p>
      </div>

      {/* Initial decks */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          justifyContent: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "14px",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "#888",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "0.85rem",
              textAlign: "center",
            }}
          >
            Paquet 1 — Rouge·Noir
          </div>
          <div style={{ display: "flex", gap: "7px" }}>
            {deck1.map((card) => (
              <CardChip key={card.id} card={card} />
            ))}
          </div>
        </div>

        <div style={{ fontSize: "1.4rem", color: "#334", userSelect: "none" }}>
          ⇄
        </div>

        <div
          style={{
            padding: "1.25rem 1.5rem",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "14px",
            border: "1px solid rgba(71,85,105,0.25)",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "#888",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "0.85rem",
              textAlign: "center",
            }}
          >
            Paquet 2 — Noir·Rouge (miroir)
          </div>
          <div style={{ display: "flex", gap: "7px" }}>
            {deck2.map((card) => (
              <CardChip key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>

      {/* Shuffle button */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          onClick={handleShuffle}
          disabled={animating}
          style={{
            padding: "1rem 2.8rem",
            fontSize: "0.95rem",
            fontFamily: "inherit",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: animating
              ? "rgba(255,255,255,0.07)"
              : "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)",
            border: "none",
            borderRadius: "30px",
            color: animating ? "#555" : "#fff",
            cursor: animating ? "wait" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: animating ? "none" : "0 4px 20px rgba(78,205,196,0.4)",
          }}
        >
          {animating
            ? "Mélange en cours…"
            : shuffleCount === 0
              ? "Riffle Shuffle"
              : `Mélanger encore (×${shuffleCount})`}
        </button>
      </div>

      {/* Result */}
      {latest && (
        <div
          style={{
            maxWidth: "780px",
            margin: "0 auto 2rem",
            padding: "1.5rem",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              fontSize: "0.68rem",
              color: "#666",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
              textAlign: "center",
            }}
          >
            Résultat — paires après mélange #{shuffleCount}
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {latest.pairs.map((pair, i) => (
              <PairBox key={i} result={pair} index={i} />
            ))}
          </div>

          {/* Invariant status */}
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.85rem 1.25rem",
              background: latest.invariantHolds
                ? "rgba(78,205,196,0.07)"
                : "rgba(239,68,68,0.07)",
              borderRadius: "10px",
              border: `1px solid ${latest.invariantHolds ? "rgba(78,205,196,0.3)" : "rgba(239,68,68,0.3)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                color: "#666",
                letterSpacing: "0.1em",
              }}
            >
              INVARIANT GILBREATH
            </span>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: latest.invariantHolds ? "#4ecdc4" : "#ef4444",
              }}
            >
              {latest.pairs.filter((p) => p.valid).length}/{latest.pairs.length}{" "}
              paires valides
              {"  "}
              {latest.invariantHolds ? "✓" : "✗"}
            </span>
            {shuffleCount > 1 && (
              <span style={{ fontSize: "0.72rem", color: "#555" }}>
                {validCount}/{shuffleCount} mélanges vérifiés
              </span>
            )}
          </div>
        </div>
      )}

      {/* Shannon entropy panel */}
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto 2rem",
          padding: "1.5rem",
          background: "rgba(78,205,196,0.04)",
          borderRadius: "16px",
          border: "1px solid rgba(78,205,196,0.18)",
        }}
      >
        <div
          style={{
            fontSize: "0.68rem",
            color: "#4ecdc4",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Entropie de Shannon
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#888",
                marginBottom: "0.4rem",
              }}
            >
              Entropie perçue
            </div>
            <div
              style={{ fontSize: "1rem", fontWeight: 600, color: "#ff6b6b" }}
            >
              max — aléatoire
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#888",
                marginBottom: "0.4rem",
              }}
            >
              Entropie réelle
            </div>
            <div
              style={{ fontSize: "1rem", fontWeight: 600, color: "#4ecdc4" }}
            >
              nulle — contrôlée
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.72rem",
            color: "#556",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          L'écart entre ces deux entropies est l'essence du tour — et de la
          cryptographie.
        </div>
      </div>

      {/* Secret toggle */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          onClick={() => setShowSecret(!showSecret)}
          style={{
            padding: "0.8rem 2rem",
            fontSize: "0.8rem",
            fontFamily: "inherit",
            letterSpacing: "0.1em",
            background: showSecret
              ? "rgba(255,255,255,0.08)"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "30px",
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: showSecret ? "none" : "0 4px 20px rgba(102,126,234,0.4)",
          }}
        >
          {showSecret ? "Masquer le secret" : "Révéler le secret mathématique"}
        </button>
      </div>

      {/* Secret content */}
      {showSecret && (
        <div
          style={{
            maxWidth: "620px",
            margin: "0 auto 2rem",
            padding: "2rem",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "1.5rem",
              letterSpacing: "0.1em",
            }}
          >
            L'invariant de Gilbreath
          </h3>

          <div style={{ fontSize: "0.85rem", lineHeight: 1.85, color: "#bbb" }}>
            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "#4ecdc4" }}>Préparation :</strong> les
              deux demi-paquets sont des miroirs — chaque carte{" "}
              <code
                style={{
                  background: "rgba(78,205,196,0.15)",
                  padding: "2px 7px",
                  borderRadius: "4px",
                  color: "#4ecdc4",
                }}
              >
                deck1[i]
              </code>{" "}
              est toujours la couleur opposée de{" "}
              <code
                style={{
                  background: "rgba(78,205,196,0.15)",
                  padding: "2px 7px",
                  borderRadius: "4px",
                  color: "#4ecdc4",
                }}
              >
                deck2[i]
              </code>
              .
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "#4ecdc4" }}>Preuve :</strong> lors du
              mélange, on consomme les cartes des deux paquets. À chaque
              instant, les "fronts" des deux paquets restants sont toujours de
              couleurs opposées — l'invariant se propage.
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
              <strong style={{ color: "#4ecdc4" }}>Lien informatique :</strong>{" "}
              c'est un <em>checksum structurel</em>. Comme un CRC32 qui survit à
              la transmission réseau, la propriété résiste à toute
              transformation (coupe, mélange) car elle est encodée dans la
              structure, pas dans la position.
            </p>

            <div
              style={{
                padding: "1rem",
                background: "rgba(102,126,234,0.08)",
                borderRadius: "8px",
                border: "1px solid rgba(102,126,234,0.25)",
                fontFamily: "monospace",
                fontSize: "0.78rem",
                lineHeight: 1.7,
              }}
            >
              <div style={{ color: "#667" }}>{"// L'invariant en code"}</div>
              <div style={{ color: "#667eea" }}>
                {"∀i pair: couleur(deck[i]) ≠ couleur(deck[i+1])"}
                <br />
                {"// vrai avant ET après tout riffle shuffle"}
              </div>
              <div style={{ marginTop: "0.75rem", color: "#667" }}>
                {"// Analogies :"}
              </div>
              <div style={{ color: "#94a3b8" }}>
                {"CRC32      → survit à la transmission réseau"}
                <br />
                {"Signature  → résiste à la sérialisation"}
                <br />
                {"Hash       → invariant par transformation"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: "3rem",
          fontSize: "0.7rem",
          color: "#555",
          letterSpacing: "0.1em",
        }}
      >
        "Quand la Magie exécute du Code" — Devoxx 2026 - Marjorie Aubert et
        Nicolas Bétheuil
      </div>
    </div>
  );
}
