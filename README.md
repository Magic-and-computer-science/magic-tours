# Quand la Magie exécute du Code

> Talk présenté à **Devoxx 2026** par **Marjorie Aubert** et **Nicolas Bétheuil**

Application interactive illustrant deux tours de magie mathématiques pour explorer des concepts fondamentaux en cryptographie et algorithmique.

---

## Le concept

La magie repose sur une **asymétrie d'information** : le spectateur perçoit du chaos là où le magicien voit une structure déterministe. Ce projet utilise deux tours de cartes comme métaphore pédagogique pour des mécanismes que l'on retrouve en sécurité informatique.

| Ce que voit le spectateur | Ce que sait le magicien |
|---------------------------|-------------------------|
| Hasard, complexité        | Algorithme, invariant   |
| Entropie maximale         | Entropie nulle          |
| O(n!) pour trouver        | O(1) pour calculer      |

---

## Les deux tours

### 1. Principe de Gilbreath — L'invariant structurel

**Le tour :** Deux jeux de cartes aux couleurs alternées et inversées. Après un mélange riffle quelconque, chaque paire consécutive contient exactement une carte rouge et une carte noire.

**Le principe :** L'invariant `couleur(deck1[i]) ≠ couleur(deck2[i])` est préservé par tout entrelacement des deux piles. L'entropie perçue est maximale ; l'entropie réelle est nulle.

**Dans l'app :**
- Illustration SVG du riffle shuffle en position bridge (deux éventails face à face, cartes entrelacées au centre)
- Animation pas-à-pas de l'intercalement carte par carte, avec contrôles lecture / pause / étape
- Accordéon pour afficher ou masquer la visualisation pendant la démo

**Parallèle crypto :** Clé publique / clé privée — la structure sous-jacente est invisible sans le secret.

---

### 2. Carré Magique — Complexité asymétrique

**Le tour :** Le spectateur choisit un nombre, le magicien construit instantanément un carré 4×4 dont toutes les lignes, colonnes et diagonales somment à ce nombre.

**L'algorithme :** Basé sur le carré de Dürer (1514), somme magique de base = 34. Pour toute cible `S ≥ 34` :

1. `delta = S - 34`
2. Ajouter `delta` aux 4 positions formant un carré latin (une par ligne, une par colonne, une par diagonale)
3. La somme de chaque ligne, colonne et diagonale augmente exactement de `delta`

**Complexité :**
- Spectateur : O(n!) pour reconstituer par force brute
- Magicien : O(1) pour générer

**Parallèle crypto :** Chiffrement RSA — multiplier deux grands nombres premiers est trivial, factoriser le produit est computationnellement impossible.

---

## Stack technique

| Outil | Version |
|-------|---------|
| TypeScript | 5.4 |
| React | 19 |
| Vite | 4.7 |
| Vitest | 2.0 |

---

## Lancer le projet

```bash
npm install
npm run dev
```

## Tests

```bash
npm run test           # suite Vitest
npm run test:coverage  # couverture de code
npm run typecheck      # vérification des types
```

Les tests valident les invariants mathématiques, dont un stress test de 1 000 mélanges aléatoires pour le principe de Gilbreath.

---

## Structure du projet

```
src/
├── gilbreath-principle.ts      # logique du principe de Gilbreath
├── magical-square.ts           # algorithme du carré magique (Dürer)
├── app/
│   ├── gilbreath.tsx           # composant interactif — cartes
│   ├── ShuffleViz.tsx          # animation pas-à-pas du riffle shuffle
│   ├── RiffleIllustration.tsx  # illustration SVG des deux éventails
│   ├── CardShip.tsx            # chip visuel d'une carte (couleur + enseigne)
│   └── magic-square.tsx        # composant interactif — carré
├── main.tsx                    # navigation entre les deux tours
└── index.test.ts               # tests des invariants
```

---

*"La magie, c'est de la cryptographie avec un public."*
