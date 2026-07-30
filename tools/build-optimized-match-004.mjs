import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = path.resolve(siteRoot, "..", "sol-duel-theater");
const reportStem = "ignis-toon-elfnote-2aa4cd3083a9";
const reportRoot = path.join(projectRoot, "sidecar", "reports", "autonomous");

const presentation = JSON.parse(
  await readFile(path.join(reportRoot, `${reportStem}.presentation.json`), "utf8"),
);
const report = JSON.parse(
  await readFile(path.join(reportRoot, `${reportStem}.json`), "utf8"),
);
const mediaPath = path.join(
  siteRoot,
  "data",
  "optimized-match-004-media.json",
);
let media;
try {
  await access(mediaPath);
  media = JSON.parse(await readFile(mediaPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const games = presentation.match.games.map((game) => ({
  title: game.title,
  winner: game.winner,
  firstPlayer: game.firstPlayer,
  openingHands: game.openingHands,
  sideDeck: game.sideDeck,
  turns: game.turns.map((turn) => ({
    title: turn.title,
    lp: turn.lp,
    actions: turn.actions,
  })),
  decidingFactor: game.decidingFactor,
}));
const actions = games.reduce(
  (matchCount, game) =>
    matchCount +
    game.turns.reduce(
      (gameCount, turn) => gameCount + turn.actions.length,
      0,
    ),
  0,
);
const turns = games.reduce(
  (count, game) => count + game.turns.length,
  0,
);

const match = {
  id: "orr-r01-m04-toon-elfnote",
  round: "Optimized Round Robin · Round 1 · Match 4",
  title: "Toon vs. Elfnote",
  players: ["Toon", "Elfnote"],
  score: "Elfnote 2–0",
  status: "complete",
  reviewStatus: "awaiting-user-approval",
  detailLevel: "full",
  context: [
    "This is Match 4 of the separate Optimized Round Robin. Elfnote won 2–0 across 2 completed games and 14 turns.",
    "Both autonomous pilots knew the opponent's registered deck identity and public decklist while remaining restricted to their own private hand, legally revealed knowledge, and public game state.",
    "The referee used independent operating-system randomness for every game. No winner, score, opening hand, or game length was selected in advance.",
    "The full action record uses canonical card names so every indexed card reference remains clickable in the viewer. The spoken render may use an unambiguous shortened suffix only after that card's first full reference in each game.",
  ],
  games,
  analysis: [
    `The certified referee completed ${report.validation.decisions} autonomous decisions with zero referee errors, self-responses, own-turn hand-trap activations, supervised interventions, no-route fallbacks, verification stops, unresolved public locks, or avoidable reactive-material commitments.`,
    "Elfnote won Game 1 by repeatedly rebuilding Tinia pressure through S:P Little Knight and Mind Scan interaction before June Pride forced the final exchange. In Game 2, the Rhapsodia and Welcome Home engine converted Lucina and Tinia into a clean two-attacker finish despite Dimension Shifter and Toon's Maliss opening.",
  ],
  verification: {
    matchCommitment: report.matchCommitment,
    certificationCommitment: report.certification.commitment,
    pilotDecisions: report.validation.decisions,
    releaseBlockingCounters: 0,
    reactiveMaterialsAvoided: report.validation.reactiveMaterialAvoided,
    games: report.validation.completedGames,
    turns,
    actions,
  },
  ...(media ? { media } : {}),
};

const output = `const OPTIMIZED_MATCH_004 = ${JSON.stringify(match, null, 2)};\n`;
await writeFile(
  path.join(siteRoot, "data", "optimized-match-004.js"),
  output,
  "utf8",
);

console.log(
  `Built data/optimized-match-004.js (${games.length} games, ${turns} turns, ${actions} actions).`,
);
