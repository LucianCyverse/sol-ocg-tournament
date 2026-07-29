import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = path.resolve(siteRoot, "..", "sol-duel-theater");
const reportStem = "ignis-chaos-ritual-toon-turbo-a00ca92ce9f8";
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
  "optimized-match-003-media.json",
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

const publicDeckName = (value) =>
  typeof value === "string"
    ? value.replaceAll("Chaos Ritual (RoLaD)", "Chaos Ritual")
    : value;

const normalizeDeckNames = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeDeckNames);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        publicDeckName(key),
        normalizeDeckNames(nested),
      ]),
    );
  }
  return publicDeckName(value);
};

const games = normalizeDeckNames(presentation.match.games).map((game) => ({
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
  id: "orr-r01-m03-chaos-ritual-toon-turbo",
  round: "Optimized Round Robin · Round 1 · Match 3",
  title: "Chaos Ritual vs. Toon Turbo",
  players: ["Chaos Ritual", "Toon Turbo"],
  score: "Chaos Ritual 2–0",
  status: "complete",
  reviewStatus: "awaiting-user-approval",
  detailLevel: "full",
  context: [
    "This is Match 3 of the separate Optimized Round Robin. Chaos Ritual won 2–0 across 2 completed games and 8 turns.",
    "Both autonomous pilots knew the opponent's registered deck identity and public decklist while remaining restricted to their own private hand, legally revealed knowledge, and public game state.",
    "The referee used independent operating-system randomness for every game. No winner, score, opening hand, or game length was selected in advance.",
    "The full action record uses canonical card names so every indexed card reference remains clickable in the viewer. The spoken render may use an unambiguous shortened suffix only after that card's first full reference in each game.",
  ],
  games,
  analysis: [
    `The certified referee completed ${report.validation.decisions} autonomous decisions with zero referee errors, self-responses, own-turn hand-trap activations, supervised interventions, no-route fallbacks, verification stops, unresolved public locks, or avoidable reactive-material commitments.`,
    "Chaos Ritual won both games on turn 4. Its ritual engine played through Toon Turbo's layered hand traps and back-row interaction, then converted its surviving resources into decisive multi-monster battle phases.",
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

const output = `const OPTIMIZED_MATCH_003 = ${JSON.stringify(match, null, 2)};\n`;
await writeFile(
  path.join(siteRoot, "data", "optimized-match-003.js"),
  output,
  "utf8",
);

console.log(
  `Built data/optimized-match-003.js (${games.length} games, ${turns} turns, ${actions} actions).`,
);
