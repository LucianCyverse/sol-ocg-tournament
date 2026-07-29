import fs from "node:fs";
import path from "node:path";

const [presentationPath, captionsPath, siteRoot = process.cwd()] =
  process.argv.slice(2);

if (!presentationPath || !captionsPath) {
  throw new Error(
    "Usage: node tools/build-rendered-exhibition.mjs <presentation.json> <captions.srt> [site-root]",
  );
}

const presentation = JSON.parse(
  fs.readFileSync(path.resolve(presentationPath), "utf8"),
);
const sourceMatch = presentation.match;

if (sourceMatch?.id !== "ignis-sky-striker-kewl-tune-82feecd6f515") {
  throw new Error(`Unexpected source match: ${sourceMatch?.id ?? "missing"}`);
}

const games = sourceMatch.games.map((game) => ({
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

const renderedMatches = [
  {
    id: "exhibition-sky-striker-kewl-tune-82feecd6f515",
    round: "Autonomous Exhibition · Rendered Match",
    title: sourceMatch.title,
    players: sourceMatch.players,
    score: sourceMatch.score,
    status: "complete",
    detailLevel: "full",
    context: [
      "This commitment-bound autonomous exhibition is separate from the locked SOL July 2026 round-robin standings.",
      "Sky Striker won 2–0 across two completed games and 14 turns. The full record preserves all 82 source-bound grouped actions used by the rendered narration.",
    ],
    games,
    analysis: [
      "Sky Striker broke Kewl Tune's Synchro boards by chaining Linkage, converting opposing bodies with Widow Anchor, and recycling Engage.",
      "Game 1 ended through the borrowed Zalen plus Zero; Game 2 used Forbidden Droplet and The Fallen & The Virtuous before the Link follow-up closed the duel.",
      "The Project Ignis report independently verifies 995 pilot decisions with every release-blocking counter at zero.",
    ],
    verification: {
      matchCommitment: sourceMatch.sourceCommitment,
      pilotDecisions: 995,
      releaseBlockingCounters: 0,
    },
    media: {
      videoUrl:
        "https://luciancyverse.github.io/sol-ocg-tournament/media/sky-striker-vs-kewl-tune-82feecd6f515.mp4",
      downloadUrl:
        "https://github.com/LucianCyverse/sol-ocg-tournament/releases/download/sky-kewl-82feecd6f515/sky-striker-vs-kewl-tune-82feecd6f515.mp4",
      posterUrl: "media/sky-striker-vs-kewl-tune-82feecd6f515-poster.jpg",
      captionsUrl: "media/sky-striker-vs-kewl-tune-82feecd6f515.vtt",
      duration: "17:17.93",
      format: "1280 × 720 H.264/AAC",
      sha256:
        "80F44C5DAB4C86C7FD330F1A112905E4980153AA806E39D8BCAA21D560FF30F9",
    },
  },
];

const dataPath = path.join(siteRoot, "data", "rendered-matches.js");
fs.writeFileSync(
  dataPath,
  `const RENDERED_MATCHES=${JSON.stringify(renderedMatches, null, 2)};\n`,
  "utf8",
);

const srt = fs
  .readFileSync(path.resolve(captionsPath), "utf8")
  .replace(/\r\n/g, "\n");
const vtt = `WEBVTT\n\n${srt.replace(
  /^(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})$/gm,
  "$1.$2 --> $3.$4",
)}`;
const vttPath = path.join(
  siteRoot,
  "media",
  "sky-striker-vs-kewl-tune-82feecd6f515.vtt",
);
fs.writeFileSync(vttPath, vtt, "utf8");

console.log(
  JSON.stringify(
    {
      dataPath,
      vttPath,
      games: games.length,
      turns: games.reduce((sum, game) => sum + game.turns.length, 0),
      actions: games.reduce(
        (sum, game) =>
          sum +
          game.turns.reduce(
            (turnSum, turn) => turnSum + turn.actions.length,
            0,
          ),
        0,
      ),
    },
    null,
    2,
  ),
);
