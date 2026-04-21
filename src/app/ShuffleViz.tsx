import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { type Card } from "../gilbreath-principle.js";
import { CardChip } from "./CardShip.js";
import { RiffleIllustration } from "./RiffleIllustration.js";

const srOnly: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

export function ShuffleViz({ deck1, deck2 }: { deck1: Card[]; deck2: Card[] }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const n = deck1.length;
  const total = n * 2;

  const sequence = useMemo(() => {
    const seq: Array<{ card: Card; fromDeck: 1 | 2; deckIndex: number }> = [];
    for (let i = 0; i < n; i++) {
      seq.push({ card: deck1[i], fromDeck: 1, deckIndex: i });
      seq.push({ card: deck2[i], fromDeck: 2, deckIndex: i });
    }
    return seq;
  }, [deck1, deck2, n]);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const cardTransition = prefersReducedMotion
    ? "none"
    : "opacity 0.3s, transform 0.3s, filter 0.3s";
  const resultTransition = prefersReducedMotion ? "none" : "transform 0.25s";

  useEffect(() => {
    if (!playing) return;
    if (step >= total) {
      setPlaying(false);
      return;
    }
    const delay = prefersReducedMotion ? 0 : 650;
    const timer = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(timer);
  }, [playing, step, total, prefersReducedMotion]);

  const handlePlayPause = () => {
    if (step >= total) {
      setStep(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  const handlePrev = () => {
    setPlaying(false);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleNext = () => {
    setPlaying(false);
    setStep((s) => Math.min(total, s + 1));
  };

  const nextItem = step < total ? sequence[step] : null;

  const playLabel = playing
    ? "Mettre en pause"
    : step >= total
      ? "Rejouer depuis le début"
      : "Animer le mélange";

  const onBtnFocus = (e: { currentTarget: { style: CSSStyleDeclaration } }) => {
    e.currentTarget.style.outline = "2px solid #4ecdc4";
    e.currentTarget.style.outlineOffset = "2px";
  };
  const onBtnBlur = (e: { currentTarget: { style: CSSStyleDeclaration } }) => {
    e.currentTarget.style.outline = "";
    e.currentTarget.style.outlineOffset = "";
  };

  return (
    <section
      aria-label="Visualisation du riffle shuffle"
      style={{ padding: "1.5rem 1.5rem 1.25rem" }}
    >
      <div
        style={{
          fontSize: "0.68rem",
          color: "#666",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        Déroulement du riffle shuffle — intercalement carte par carte
      </div>

      <RiffleIllustration />

      {/* Deck 1 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "1.25rem",
        }}
      >
        <span
          style={{
            fontSize: "0.62rem",
            color: "#4ecdc4",
            letterSpacing: "0.1em",
            width: "62px",
            flexShrink: 0,
            textAlign: "right",
          }}
        >
          PAQUET 1
        </span>
        <div style={{ display: "flex", gap: "7px" }}>
          {deck1.map((card, i) => {
            const seqPos = i * 2;
            const isActive = step === seqPos;
            const isPlaced = step > seqPos;
            return (
              <div
                key={card.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    opacity: isPlaced ? 0.18 : 1,
                    transform:
                      isActive && !prefersReducedMotion
                        ? "translateY(-7px)"
                        : "translateY(0)",
                    transition: cardTransition,
                    filter: isActive
                      ? "drop-shadow(0 0 10px rgba(78,205,196,0.9))"
                      : "none",
                  }}
                >
                  <CardChip card={card} size="sm" />
                </div>
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: "0.58rem",
                    color: isActive ? "#4ecdc4" : isPlaced ? "#555" : "#666",
                    fontWeight: isActive ? 700 : 400,
                    transition: cardTransition,
                  }}
                >
                  {seqPos + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deck 2 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "1.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.62rem",
            color: "#667eea",
            letterSpacing: "0.1em",
            width: "62px",
            flexShrink: 0,
            textAlign: "right",
          }}
        >
          PAQUET 2
        </span>
        <div style={{ display: "flex", gap: "7px" }}>
          {deck2.map((card, i) => {
            const seqPos = i * 2 + 1;
            const isActive = step === seqPos;
            const isPlaced = step > seqPos;
            return (
              <div
                key={card.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    opacity: isPlaced ? 0.18 : 1,
                    transform:
                      isActive && !prefersReducedMotion
                        ? "translateY(-7px)"
                        : "translateY(0)",
                    transition: cardTransition,
                    filter: isActive
                      ? "drop-shadow(0 0 10px rgba(102,126,234,0.9))"
                      : "none",
                  }}
                >
                  <CardChip card={card} size="sm" />
                </div>
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: "0.58rem",
                    color: isActive ? "#667eea" : isPlaced ? "#555" : "#666",
                    fontWeight: isActive ? 700 : 400,
                    transition: cardTransition,
                  }}
                >
                  {seqPos + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "1.25rem",
        }}
      >
        <span
          style={{
            fontSize: "0.62rem",
            color: "#888",
            letterSpacing: "0.1em",
            width: "62px",
            flexShrink: 0,
            textAlign: "right",
          }}
        >
          RÉSULTAT
        </span>
        <div
          style={{
            display: "flex",
            gap: "7px",
            minHeight: "62px",
            alignItems: "center",
          }}
        >
          {sequence.slice(0, step).map((item, i) => (
            <div
              key={i}
              style={{
                transform:
                  i === step - 1 && !prefersReducedMotion
                    ? "scale(1.12)"
                    : "scale(1)",
                transition: resultTransition,
                filter:
                  i === step - 1
                    ? item.fromDeck === 1
                      ? "drop-shadow(0 0 8px rgba(78,205,196,0.6))"
                      : "drop-shadow(0 0 8px rgba(102,126,234,0.6))"
                    : "none",
              }}
            >
              <CardChip card={item.card} size="sm" />
            </div>
          ))}
          {step < total && (
            <div
              aria-hidden="true"
              style={{
                width: "40px",
                height: "54px",
                borderRadius: "8px",
                border: "1.5px dashed rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "0.65rem", color: "#252535" }}>?</span>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          minHeight: "30px",
          marginBottom: "1rem",
          padding: "0.45rem 1rem",
          borderRadius: "8px",
          background: "rgba(0,0,0,0.15)",
          fontSize: "0.75rem",
          color: "#888",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {step === total ? (
          <span style={{ color: "#4ecdc4" }}>
            Mélange terminé — chaque paire consécutive contient une carte de
            chaque paquet
          </span>
        ) : nextItem ? (
          <span>
            Prochaine :{" "}
            <span
              style={{
                color: nextItem.fromDeck === 1 ? "#4ecdc4" : "#667eea",
                fontWeight: 700,
              }}
            >
              carte {nextItem.deckIndex + 1} du Paquet {nextItem.fromDeck}
            </span>{" "}
            → position {step + 1}
          </span>
        ) : (
          <span style={{ color: "#666" }}>
            Utilise les boutons ci-dessous pour voir le mélange s'animer
          </span>
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={step === 0}
          aria-label="Étape précédente"
          onFocus={onBtnFocus}
          onBlur={onBtnBlur}
          style={{
            padding: "0.45rem 1rem",
            fontSize: "0.85rem",
            fontFamily: "inherit",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            color: step === 0 ? "#2a2a3a" : "#999",
            cursor: step === 0 ? "default" : "pointer",
          }}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <button
          onClick={handlePlayPause}
          aria-label={playLabel}
          onFocus={onBtnFocus}
          onBlur={onBtnBlur}
          style={{
            padding: "0.45rem 1.5rem",
            fontSize: "0.8rem",
            fontFamily: "inherit",
            letterSpacing: "0.08em",
            background: playing
              ? "rgba(255,255,255,0.08)"
              : "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)",
            border: "none",
            borderRadius: "20px",
            color: "#fff",
            cursor: "pointer",
            minWidth: "110px",
            transition: prefersReducedMotion ? "none" : "background 0.3s",
          }}
        >
          <span aria-hidden="true">
            {playing ? "⏸ Pause" : step >= total ? "↺ Rejouer" : "▶ Animer"}
          </span>
          <span style={srOnly}>{playLabel}</span>
        </button>
        <button
          onClick={handleNext}
          disabled={step >= total}
          aria-label="Étape suivante"
          onFocus={onBtnFocus}
          onBlur={onBtnBlur}
          style={{
            padding: "0.45rem 1rem",
            fontSize: "0.85rem",
            fontFamily: "inherit",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            color: step >= total ? "#2a2a3a" : "#999",
            cursor: step >= total ? "default" : "pointer",
          }}
        >
          <span aria-hidden="true">›</span>
        </button>
        <span
          aria-live="polite"
          aria-atomic="true"
          style={{ fontSize: "0.62rem", color: "#777", minWidth: "32px" }}
        >
          {step}/{total}
        </span>
      </div>
    </section>
  );
}
