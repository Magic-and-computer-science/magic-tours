/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CARRÉ MAGIQUE — Tour de mentalisme
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Le principe : quelle que soit la somme choisie par le spectateur (≥ 34),
 * on construit instantanément un carré 4×4 où lignes, colonnes et
 * diagonales donnent cette somme.
 *
 * Pour le spectateur : magie pure — comment deviner à l'avance ?
 * Pour nous : algorithme O(1) avec le carré de Dürer modifié
 *
 * Lien avec Gilbreath :
 * - Entrée apparemment libre (le spectateur "choisit" un nombre)
 * - Invariant mathématique caché (le template avec offset)
 * - Sortie "impossible" (tout s'additionne parfaitement)
 *
 * Lien avec la cryptographie :
 * - Entropie réelle = 0 (le résultat est déterministe)
 * - Entropie perçue = maximale (le spectateur croit à l'aléatoire)
 * - Asymétrie d'information = pouvoir
 */

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

type MagicSquare = number[][];

interface SquareAnalysis {
  targetSum: number;
  rows: number[];
  columns: number[];
  diagonals: number[];
  corners: number;
  centerSquare: number;
  allValid: boolean;
}

// ════════════════════════════════════════════════════════════════════════════
// LE SECRET : L'ALGORITHME
// ════════════════════════════════════════════════════════════════════════════

/**
 * Le carré de Dürer (1514) — somme magique = 34
 *
 * ┌────┬────┬────┬────┐
 * │ 16 │  3 │  2 │ 13 │
 * ├────┼────┼────┼────┤
 * │  5 │ 10 │ 11 │  8 │
 * ├────┼────┼────┼────┤
 * │  9 │  6 │  7 │ 12 │
 * ├────┼────┼────┼────┤
 * │  4 │ 15 │ 14 │  1 │
 * └────┴────┴────┴────┘
 *
 * Pour adapter à une somme S quelconque, on modifie 4 cellules stratégiques :
 * (0,0), (1,2), (2,3), (3,1)
 *
 * Ces 4 positions forment un "carré latin" : une seule par ligne, une seule
 * par colonne, ET une seule sur chaque diagonale.
 *
 * Donc en ajoutant (S - 34) à chacune de ces 4 cellules :
 * - Chaque ligne gagne exactement (S - 34)
 * - Chaque colonne gagne exactement (S - 34)
 * - Chaque diagonale gagne exactement (S - 34)
 */

function generateMagicSquare(targetSum: number): MagicSquare {
  if (targetSum < 34) {
    throw new Error(
      "La somme doit être au moins 34 (pour éviter les nombres négatifs/doublons)",
    );
  }

  const delta = targetSum - 34;

  return [
    [16 + delta, 3, 2, 13],
    [5, 10, 11 + delta, 8],
    [9, 6, 7, 12 + delta],
    [4, 15 + delta, 14, 1],
  ];
}

// ════════════════════════════════════════════════════════════════════════════
// VARIANTE : ANNÉE DE NAISSANCE EN HAUT À GAUCHE
// ════════════════════════════════════════════════════════════════════════════

/**
 * Variante spectaculaire : le nombre choisi apparaît directement
 * dans le coin supérieur gauche (plus visuel pour le spectateur)
 *
 * La somme magique sera alors : nombre + 18
 */
function generateWithTopLeftNumber(topLeftNumber: number): MagicSquare {
  const targetSum = topLeftNumber + 18;
  const delta = targetSum - 34;

  return [
    [16 + delta, 3, 2, 13],
    [5, 10, 11 + delta, 8],
    [9, 6, 7, 12 + delta],
    [4, 15 + delta, 14, 1],
  ];
}

// ════════════════════════════════════════════════════════════════════════════
// VÉRIFICATION
// ════════════════════════════════════════════════════════════════════════════

function analyzeSquare(square: MagicSquare, targetSum: number): SquareAnalysis {
  const rows = square.map((row) => row.reduce((a, b) => a + b, 0));

  const columns = [0, 1, 2, 3].map((col) =>
    square.reduce((sum, row) => sum + row[col], 0),
  );

  const diagonals = [
    square[0][0] + square[1][1] + square[2][2] + square[3][3], // Principale
    square[0][3] + square[1][2] + square[2][1] + square[3][0], // Anti-diagonale
  ];

  const corners = square[0][0] + square[0][3] + square[3][0] + square[3][3];
  const centerSquare =
    square[1][1] + square[1][2] + square[2][1] + square[2][2];

  const allValid =
    rows.every((s) => s === targetSum) &&
    columns.every((s) => s === targetSum) &&
    diagonals.every((s) => s === targetSum);

  return {
    targetSum,
    rows,
    columns,
    diagonals,
    corners,
    centerSquare,
    allValid,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// AFFICHAGE
// ════════════════════════════════════════════════════════════════════════════

function formatSquare(square: MagicSquare): string {
  const maxWidth = Math.max(...square.flat()).toString().length;
  const cellWidth = maxWidth + 2;
  const horizontalLine = "─".repeat(cellWidth);
  const separator = `├${horizontalLine}┼${horizontalLine}┼${horizontalLine}┼${horizontalLine}┤`;
  const top = `┌${horizontalLine}┬${horizontalLine}┬${horizontalLine}┬${horizontalLine}┐`;
  const bottom = `└${horizontalLine}┴${horizontalLine}┴${horizontalLine}┴${horizontalLine}┘`;

  const formatRow = (row: number[]) =>
    "│" +
    row.map((n) => ` ${n.toString().padStart(maxWidth)} `).join("│") +
    "│";

  const lines = [
    top,
    formatRow(square[0]),
    separator,
    formatRow(square[1]),
    separator,
    formatRow(square[2]),
    separator,
    formatRow(square[3]),
    bottom,
  ];

  return lines.join("\n");
}

function displayFullAnalysis(targetSum: number): void {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`   🎩 CARRÉ MAGIQUE — Somme cible : ${targetSum}`);
  console.log(`${"═".repeat(60)}\n`);

  const square = generateMagicSquare(targetSum);
  console.log(formatSquare(square));

  const analysis = analyzeSquare(square, targetSum);

  console.log(`\n${"─".repeat(60)}`);
  console.log("VÉRIFICATION :");
  console.log(
    `  Lignes        : ${analysis.rows.map((n) => n.toString().padStart(4)).join(", ")}`,
  );
  console.log(
    `  Colonnes      : ${analysis.columns.map((n) => n.toString().padStart(4)).join(", ")}`,
  );
  console.log(
    `  Diagonales    : ${analysis.diagonals.map((n) => n.toString().padStart(4)).join(", ")}`,
  );
  console.log(`  4 coins       : ${analysis.corners}`);
  console.log(`  Centre 2×2    : ${analysis.centerSquare}`);
  console.log(
    `\n  ${analysis.allValid ? "✅ CARRÉ MAGIQUE VALIDE" : "❌ ERREUR"}`,
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DÉMONSTRATION
// ════════════════════════════════════════════════════════════════════════════

console.log("\n");
console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║           CARRÉ MAGIQUE — DÉMONSTRATION                      ║");
console.log("║                                                              ║");
console.log('║   "Pour le spectateur : O(52!)                               ║');
console.log('║    Pour le magicien : O(1)"                                  ║');
console.log("╚══════════════════════════════════════════════════════════════╝");

// Démonstration avec plusieurs sommes
[34, 57, 100, 2024].forEach((sum) => {
  displayFullAnalysis(sum);
});

// Résumé de validation
console.log("\n\n" + "═".repeat(60));
console.log(
  "VALIDATION RAPIDE — L'algorithme fonctionne pour toute somme ≥ 34",
);
console.log("═".repeat(60) + "\n");

const testSums = [34, 35, 36, 37, 42, 50, 99, 100, 2024];
testSums.forEach((sum) => {
  const sq = generateMagicSquare(sum);
  const valid = analyzeSquare(sq, sum).allValid;
  const status = valid ? "✅" : "❌";
  console.log(`  Somme ${sum.toString().padStart(4)} : ${status}`);
});

// ════════════════════════════════════════════════════════════════════════════
// PARALLÈLE AVEC LA CRYPTOGRAPHIE (pour la conférence)
// ════════════════════════════════════════════════════════════════════════════

console.log("\n\n" + "═".repeat(60));
console.log("PARALLÈLE AVEC RSA — Pour la conférence");
console.log("═".repeat(60) + "\n");

console.log(`
┌────────────────────────────────────────────────────────────┐
│                    CARRÉ MAGIQUE                           │
├────────────────────────────────────────────────────────────┤
│ PUBLIC     │ Le carré final (16 nombres visibles)         │
│ SECRET     │ Le template de Dürer + positions d'offset    │
│ ATTAQUE    │ Deviner le mécanisme : exponentiel           │
│ MAGICIEN   │ Calculer le résultat : O(1)                  │
├────────────────────────────────────────────────────────────┤
│                         RSA                                │
├────────────────────────────────────────────────────────────┤
│ PUBLIC     │ n = p × q (le produit)                       │
│ SECRET     │ Les facteurs p et q                          │
│ ATTAQUE    │ Factoriser n : exponentiel                   │
│ DÉTENTEUR  │ Déchiffrer : O(1) avec la clé privée         │
└────────────────────────────────────────────────────────────┘

Dans les deux cas : ASYMÉTRIE D'INFORMATION = POUVOIR
`);

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════

export {
  generateMagicSquare,
  generateWithTopLeftNumber,
  analyzeSquare,
  formatSquare,
  displayFullAnalysis,
  MagicSquare,
  SquareAnalysis,
};
