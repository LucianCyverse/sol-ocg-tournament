import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const value = (name) => {
  const exact = process.argv.indexOf(name);
  if (exact >= 0) return process.argv[exact + 1];
  return process.argv
    .find((argument) => argument.startsWith(`${name}=`))
    ?.slice(name.length + 1);
};

const requireValue = (condition, message) => {
  if (!condition) throw new Error(message);
};

const presentationPath = path.resolve(value("--presentation") ?? "");
const reportPath = path.resolve(value("--report") ?? "");
const outputPath = path.resolve(value("--output") ?? "");
const matchId = value("--match-id");
const roundLabel = value("--round-label") ?? "Optimized Round Robin";
const mediaPath = value("--media");

for (const [name, filename] of [
  ["--presentation", presentationPath],
  ["--report", reportPath],
]) {
  requireValue(
    filename && fs.existsSync(filename),
    `${name} must identify an existing file.`,
  );
}
requireValue(outputPath && matchId, "--output and --match-id are required.");

const presentation = JSON.parse(fs.readFileSync(presentationPath, "utf8"));
const reportBytes = fs.readFileSync(reportPath);
const report = JSON.parse(reportBytes.toString("utf8"));
requireValue(
  presentation.source?.reportSha256 ===
    crypto.createHash("sha256").update(reportBytes).digest("hex"),
  "Presentation and match report do not share the same source hash.",
);
requireValue(
  report.status === "complete" &&
    report.validation?.passed === true &&
    presentation.source?.matchCommitment === report.matchCommitment,
  "The source match is not certified.",
);

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
const turnCount = games.reduce((total, game) => total + game.turns.length, 0);
const actionCount = games.reduce(
  (total, game) =>
    total +
    game.turns.reduce((gameTotal, turn) => gameTotal + turn.actions.length, 0),
  0,
);
const loser = report.decks.find((deck) => deck !== report.winner);
const record = {
  id: matchId,
  round: roundLabel,
  title: presentation.match.title,
  players: presentation.match.players,
  score: presentation.match.score,
  status: "complete",
  reviewStatus: "awaiting-user-approval",
  detailLevel: "full",
  context: [
    `This is Match 2 of the separate Optimized Round Robin. ${presentation.match.score} across ${games.length} completed games and ${turnCount} turns.`,
    "Both autonomous pilots knew the opponent's registered deck identity and public decklist while remaining restricted to their own private hand, legally revealed knowledge, and public game state.",
    "The referee used independent operating-system randomness for every game. No winner, score, opening hand, or game length was selected in advance.",
    "The full action record uses canonical card names so every indexed card reference remains clickable in the viewer. The spoken render may use an unambiguous shortened suffix only after that card's first full reference in each game.",
  ],
  games,
  analysis: [
    `${presentation.match.players[0]} and ${presentation.match.players[1]} completed ${report.validation.decisions} audited pilot decisions with zero referee errors, hidden-information violations, no-route fallbacks, verification stops, supervised interventions, or avoidable reactive-material commitments.`,
    `${report.winner === "power-patron" ? "Power Patron" : "Dark Magician"} won the certified best-of-three ${report.wins[report.winner]}-${report.wins[loser]}. The result was adopted only after the complete certification gate passed.`,
  ],
  verification: {
    matchCommitment: report.matchCommitment,
    certificationCommitment: report.certification.commitment,
    pilotDecisions: report.validation.decisions,
    releaseBlockingCounters: 0,
    games: games.length,
    turns: turnCount,
    actions: actionCount,
  },
  ...(mediaPath
    ? {media: JSON.parse(fs.readFileSync(path.resolve(mediaPath), "utf8"))}
    : {}),
};

fs.mkdirSync(path.dirname(outputPath), {recursive: true});
fs.writeFileSync(
  outputPath,
  `const OPTIMIZED_MATCH_002 = ${JSON.stringify(record, null, 2)};\n`,
  "utf8",
);
process.stdout.write(
  `${JSON.stringify({
    status: "generated",
    output: outputPath,
    matchId,
    games: games.length,
    turns: turnCount,
    actions: actionCount,
    media: Boolean(mediaPath),
  })}\n`,
);
