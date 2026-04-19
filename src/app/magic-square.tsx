import { useState, useCallback, useMemo } from "react";

/**
 * Carré Magique
 * Le secret : on part du carré de Dürer (1514) et on modifie
 * 4 cellules stratégiques formant un "carré latin" :
 * (0,0), (1,2), (2,3), (3,1)
 *
 * Complexité : O(1) pour le magicien, O(n!) pour le spectateur
 */

// Les 4 positions magiques qui forment un carré latin
const MODIFIED_POSITIONS: [number, number][] = [
  [0, 0],
  [1, 2],
  [2, 3],
  [3, 1],
];

// Vérifie si une position est modifiée
const isModified = (row: number, col: number): boolean =>
  MODIFIED_POSITIONS.some(([r, c]) => r === row && c === col);

// Génère le carré magique pour une somme cible
const generateMagicSquare = (targetSum: number): number[][] => {
  const delta = targetSum - 34;
  return [
    [16 + delta, 3, 2, 13],
    [5, 10, 11 + delta, 8],
    [9, 6, 7, 12 + delta],
    [4, 15 + delta, 14, 1],
  ];
};

// Analyse du carré
const analyzeSquare = (square: number[][], targetSum: number) => {
  const rows = square.map((row) => row.reduce((a, b) => a + b, 0));
  const columns = [0, 1, 2, 3].map((col) =>
    square.reduce((sum, row) => sum + row[col], 0),
  );
  const diagonals = [
    square[0][0] + square[1][1] + square[2][2] + square[3][3],
    square[0][3] + square[1][2] + square[2][1] + square[3][0],
  ];
  const corners = square[0][0] + square[0][3] + square[3][0] + square[3][3];
  const center = square[1][1] + square[1][2] + square[2][1] + square[2][2];

  const allValid =
    rows.every((s) => s === targetSum) &&
    columns.every((s) => s === targetSum) &&
    diagonals.every((s) => s === targetSum);

  return { rows, columns, diagonals, corners, center, allValid };
};

// Composant principal
export default function CarreMagique() {
  const [targetSum, setTargetSum] = useState(57);
  const [showSecret, setShowSecret] = useState(false);
  const [showLatinSquare, setShowLatinSquare] = useState(true);
  const [highlightMode, setHighlightMode] = useState<
    "modified" | "row" | "col" | "diag" | null
  >("modified");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const square = useMemo(() => generateMagicSquare(targetSum), [targetSum]);
  const analysis = useMemo(
    () => analyzeSquare(square, targetSum),
    [square, targetSum],
  );

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTargetSum(
        Math.max(34, Math.min(9999, parseInt(e.target.value) || 34)),
      );
    },
    [],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value) || 34;
      setTargetSum(Math.max(34, Math.min(9999, value)));
    },
    [],
  );

  // Détermine si une cellule doit être mise en évidence
  const shouldHighlight = (row: number, col: number): boolean => {
    if (highlightMode === "modified")
      return showLatinSquare && isModified(row, col);
    if (highlightMode === "row") return row === highlightIndex;
    if (highlightMode === "col") return col === highlightIndex;
    if (highlightMode === "diag") {
      if (highlightIndex === 0) return row === col;
      return row + col === 3;
    }
    return false;
  };

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
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
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
          Carré Magique
        </h1>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#888",
            letterSpacing: "0.1em",
          }}
        >
          Algorithme O(1) — Carré de Dürer modifié
        </p>
      </div>

      {/* Contrôles */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <label
          style={{
            fontSize: "0.8rem",
            color: "#aaa",
            letterSpacing: "0.05em",
          }}
        >
          SOMME CIBLE
        </label>
        <input
          type="range"
          min="34"
          max="200"
          value={Math.min(targetSum, 200)}
          onChange={handleSliderChange}
          style={{
            width: "200px",
            accentColor: "#4ecdc4",
          }}
        />
        <input
          type="number"
          min="34"
          max="9999"
          value={targetSum}
          onChange={handleInputChange}
          style={{
            width: "100px",
            padding: "0.75rem 1rem",
            fontSize: "1.5rem",
            fontWeight: 600,
            fontFamily: "inherit",
            textAlign: "center",
            background: "rgba(255,255,255,0.05)",
            border: "2px solid #4ecdc4",
            borderRadius: "8px",
            color: "#4ecdc4",
            outline: "none",
          }}
        />
      </div>

      {/* Grille du carré avec sommes autour */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr) 56px",
          gap: "8px",
          maxWidth: "480px",
          margin: "0 auto 2rem",
          padding: "1.5rem",
          background: "rgba(0,0,0,0.3)",
          borderRadius: "16px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {square.flatMap((row, rowIndex) => [
          ...row.map((value, colIndex) => {
            const modified = isModified(rowIndex, colIndex) && showLatinSquare;
            const highlighted = shouldHighlight(rowIndex, colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: value > 99 ? "1.2rem" : "1.5rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  background: highlighted
                    ? modified
                      ? "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "rgba(255,255,255,0.03)",
                  color: highlighted ? "#fff" : modified ? "#4ecdc4" : "#999",
                  border:
                    modified && !highlighted
                      ? "2px solid rgba(78, 205, 196, 0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: highlighted
                    ? "0 4px 20px rgba(78, 205, 196, 0.4)"
                    : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "default",
                }}
              >
                {value}
              </div>
            );
          }),
          // Somme de la ligne
          <div
            key={`row-sum-${rowIndex}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              fontWeight: 700,
              color:
                analysis.rows[rowIndex] === targetSum ? "#4ecdc4" : "#ff6b6b",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              paddingLeft: "4px",
            }}
          >
            {analysis.rows[rowIndex]}
          </div>,
        ])}
        {/* Sommes des colonnes */}
        {analysis.columns.map((sum, i) => (
          <div
            key={`col-sum-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "4px",
              fontSize: "1rem",
              fontWeight: 700,
              color: sum === targetSum ? "#4ecdc4" : "#ff6b6b",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {sum}
          </div>
        ))}
        {/* Coin bas-droit vide */}
        <div />
      </div>

      {/* Boutons de vérification */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { mode: "modified" as const, label: "Cellules modifiées" },
          { mode: "row" as const, label: "Lignes" },
          { mode: "col" as const, label: "Colonnes" },
          { mode: "diag" as const, label: "Diagonales" },
        ].map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => {
              setHighlightMode(mode);
              setHighlightIndex(0);
            }}
            style={{
              padding: "0.6rem 1.2rem",
              fontSize: "0.75rem",
              fontFamily: "inherit",
              letterSpacing: "0.05em",
              background:
                highlightMode === mode
                  ? "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)"
                  : "rgba(255,255,255,0.05)",
              border: "none",
              borderRadius: "20px",
              color: highlightMode === mode ? "#fff" : "#888",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Toggle carré latin */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => {
            const next = !showLatinSquare;
            setShowLatinSquare(next);
            if (!next && highlightMode === "modified") setHighlightMode(null);
          }}
          style={{
            padding: "0.5rem 1.2rem",
            fontSize: "0.75rem",
            fontFamily: "inherit",
            letterSpacing: "0.05em",
            background: showLatinSquare
              ? "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)"
              : "rgba(255,255,255,0.05)",
            border: "none",
            borderRadius: "20px",
            color: showLatinSquare ? "#fff" : "#555",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>{showLatinSquare ? "◉" : "○"}</span>
          Carré latin
        </button>
      </div>

      {/* Navigation pour lignes/colonnes/diagonales */}
      {(highlightMode === "row" ||
        highlightMode === "col" ||
        highlightMode === "diag") && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          {(highlightMode === "diag" ? [0, 1] : [0, 1, 2, 3]).map((i) => (
            <button
              key={i}
              onClick={() => setHighlightIndex(i)}
              style={{
                width: "40px",
                height: "40px",
                fontSize: "0.9rem",
                fontFamily: "inherit",
                background:
                  highlightIndex === i
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "rgba(255,255,255,0.05)",
                border: "none",
                borderRadius: "50%",
                color: highlightIndex === i ? "#fff" : "#666",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {highlightMode === "diag" ? (i === 0 ? "↘" : "↙") : i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Résultats de vérification */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          maxWidth: "600px",
          margin: "0 auto 2rem",
        }}
      >
        {[
          { label: "Diagonales", values: analysis.diagonals },
          { label: "Coins", values: [analysis.corners] },
          { label: "Centre 2×2", values: [analysis.center] },
        ].map(({ label, values }) => {
          const allMatch = values.every((v) => v === targetSum);
          return (
            <div
              key={label}
              style={{
                padding: "1rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                textAlign: "center",
                border: `1px solid ${allMatch ? "rgba(78, 205, 196, 0.3)" : "rgba(255,255,255,0.05)"}`,
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#666",
                  letterSpacing: "0.1em",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: allMatch ? "#4ecdc4" : "#ff6b6b",
                }}
              >
                {allMatch ? `✓ ${targetSum}` : values.join(", ")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Asymétrie d'information */}
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto 2rem",
          padding: "1.5rem",
          background: "rgba(78, 205, 196, 0.05)",
          borderRadius: "16px",
          border: "1px solid rgba(78, 205, 196, 0.2)",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            color: "#4ecdc4",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Asymétrie d'information
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
                fontSize: "0.75rem",
                color: "#888",
                marginBottom: "0.5rem",
              }}
            >
              Pour le spectateur
            </div>
            <div
              style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ff6b6b" }}
            >
              O(n!) — impossible
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#888",
                marginBottom: "0.5rem",
              }}
            >
              Pour le magicien
            </div>
            <div
              style={{ fontSize: "1.1rem", fontWeight: 600, color: "#4ecdc4" }}
            >
              O(1) — immédiat
            </div>
          </div>
        </div>
      </div>

      {/* Bouton secret */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          onClick={() => setShowSecret(!showSecret)}
          style={{
            padding: "0.8rem 2rem",
            fontSize: "0.8rem",
            fontFamily: "inherit",
            letterSpacing: "0.1em",
            background: showSecret
              ? "rgba(255,255,255,0.1)"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "30px",
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: showSecret
              ? "none"
              : "0 4px 20px rgba(102, 126, 234, 0.4)",
          }}
        >
          {showSecret ? "Masquer le secret" : "Révéler le secret mathématique"}
        </button>
      </div>

      {/* Explication du secret */}
      {showSecret && (
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
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
            Le secret : le carré latin
          </h3>

          <div
            style={{
              fontSize: "0.85rem",
              lineHeight: 1.8,
              color: "#bbb",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "#4ecdc4" }}>1.</strong> On part du carré
              de Dürer (1514) qui a pour somme magique{" "}
              <strong style={{ color: "#fff" }}>34</strong>.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "#4ecdc4" }}>2.</strong> Les 4 cellules
              modifiées forment un <em>carré latin</em> : exactement{" "}
              <strong style={{ color: "#fff" }}>1 par ligne</strong>,{" "}
              <strong style={{ color: "#fff" }}>1 par colonne</strong>,{" "}
              <strong style={{ color: "#fff" }}>1 par diagonale</strong>.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "#4ecdc4" }}>3.</strong> Pour une somme
              cible S, on calcule{" "}
              <code
                style={{
                  background: "rgba(78,205,196,0.2)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  color: "#4ecdc4",
                }}
              >
                delta = S - 34
              </code>
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
              <strong style={{ color: "#4ecdc4" }}>4.</strong> On ajoute{" "}
              <code
                style={{
                  background: "rgba(78,205,196,0.2)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  color: "#4ecdc4",
                }}
              >
                delta
              </code>{" "}
              aux 4 cellules. Chaque ligne/colonne/diagonale gagne exactement{" "}
              <code
                style={{
                  background: "rgba(78,205,196,0.2)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  color: "#4ecdc4",
                }}
              >
                delta
              </code>
              .
            </p>

            <div
              style={{
                padding: "1rem",
                background: "rgba(102, 126, 234, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(102, 126, 234, 0.3)",
                fontFamily: "monospace",
                fontSize: "0.8rem",
              }}
            >
              <div style={{ color: "#888", marginBottom: "0.5rem" }}>
                // Le code complet
              </div>
              <div style={{ color: "#667eea" }}>
                const delta = targetSum - 34;
                <br />
                return [<br />
                &nbsp;&nbsp;[16 + delta, 3, 2, 13],
                <br />
                &nbsp;&nbsp;[5, 10, 11 + delta, 8],
                <br />
                &nbsp;&nbsp;[9, 6, 7, 12 + delta],
                <br />
                &nbsp;&nbsp;[4, 15 + delta, 14, 1]
                <br />
                ];
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
          color: "#fff",
          letterSpacing: "0.1em",
        }}
      >
        "Quand la Magie exécute du Code" — Devoxx 2026 - Marjorie Aubert et
        Nicolas Bétheuil
      </div>
    </div>
  );
}
