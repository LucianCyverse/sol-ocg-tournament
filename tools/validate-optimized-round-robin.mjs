import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const context = vm.createContext({});
vm.runInContext(await read("data/rendered-matches.js"), context, {
  filename: "data/rendered-matches.js",
});
vm.runInContext(
  `${await read("data/optimized-round-robin.js")}
globalThis.__optimizedRoundRobin = OPTIMIZED_ROUND_ROBIN;
globalThis.__renderedMatches = RENDERED_MATCHES;`,
  context,
  { filename: "data/optimized-round-robin.js" },
);

const rr = context.__optimizedRoundRobin;
const legacyRenderedMatches = context.__renderedMatches;
const expectedRing = [
  "sky-striker",
  "power-patron",
  "chaos-ritual",
  "toon",
  "BYE",
  "branded",
  "elfnote",
  "toon-turbo",
  "dark-magician",
  "kewl-tune",
];
const matches = rr.rounds.flatMap((round) =>
  round.matches.map((match) => ({ ...match, roundNumber: round.number })),
);
const deckIds = new Set(rr.decks.map((deck) => deck.id));

assert(rr.id === "optimized-round-robin", "Unexpected tournament id.");
assert(rr.status === "paused-for-review", "The review pause must remain active.");
assert(
  rr.reviewGate?.status === "awaiting-user-approval",
  "The user-approval gate must remain active.",
);
assert(rr.decks.length === 9 && deckIds.size === 9, "Expected nine unique decks.");
assert(
  JSON.stringify(rr.scheduleRing) === JSON.stringify(expectedRing),
  "The shared circle-method ring changed.",
);
assert(rr.rounds.length === 9, "Expected nine rounds.");
assert(matches.length === 36, "Expected 36 scheduled matches.");
assert(new Set(matches.map((match) => match.id)).size === 36, "Match ids must be unique.");
assert(
  matches.every(
    (match, index) =>
      match.number === index + 1 &&
      match.id.startsWith(
        `orr-r${String(match.roundNumber).padStart(2, "0")}-m${String(match.number).padStart(2, "0")}-`,
      ),
  ),
  "Match numbering/id convention is inconsistent.",
);

const pairs = new Set();
const appearances = new Map(rr.decks.map((deck) => [deck.id, 0]));
for (const round of rr.rounds) {
  const roundDecks = new Set();
  assert(round.matches.length === 4, `Round ${round.number} must have four matches.`);
  for (const match of round.matches) {
    assert(deckIds.has(match.deckA) && deckIds.has(match.deckB), `Unknown deck in ${match.id}.`);
    assert(match.deckA !== match.deckB, `Self-match found in ${match.id}.`);
    assert(!roundDecks.has(match.deckA), `${match.deckA} appears twice in round ${round.number}.`);
    assert(!roundDecks.has(match.deckB), `${match.deckB} appears twice in round ${round.number}.`);
    roundDecks.add(match.deckA);
    roundDecks.add(match.deckB);
    appearances.set(match.deckA, appearances.get(match.deckA) + 1);
    appearances.set(match.deckB, appearances.get(match.deckB) + 1);
    const pair = [match.deckA, match.deckB].sort().join("|");
    assert(!pairs.has(pair), `Duplicate pairing: ${pair}.`);
    pairs.add(pair);
  }
}
assert(pairs.size === 36, "Expected all 36 unique deck pairings.");
assert(
  [...appearances.values()].every((count) => count === 8),
  "Every deck must play exactly eight matches.",
);

const complete = matches.filter((match) => match.status === "complete");
const pending = matches.filter((match) => match.status === "pending");
const first = matches[0];
assert(
  complete.length === rr.checkpoint.completedMatches &&
    pending.length === rr.checkpoint.pendingMatches &&
    complete.length + pending.length === matches.length,
  "Schedule statuses do not match the declared checkpoint.",
);
assert(
  first.id === "orr-r01-m01-sky-striker-kewl-tune" &&
    first.deckA === "sky-striker" &&
    first.deckB === "kewl-tune",
  "Match 1 is not Sky Striker vs. Kewl Tune.",
);
assert(
  first.result?.winner === "sky-striker" &&
    first.result.games["sky-striker"] === 2 &&
    first.result.games["kewl-tune"] === 0,
  "Match 1 must remain a 2-0 Sky Striker win.",
);
const firstPending = pending[0];
assert(
  firstPending?.id === rr.checkpoint.nextMatchId,
  "The first pending match does not match the declared checkpoint.",
);
assert(
  matches.every(
    (match, index) =>
      index < complete.length ? match.status === "complete" : match.status === "pending",
  ),
  "Completed results must advance sequentially through the published schedule.",
);
if (rr.reviewGate.status === "awaiting-user-approval") {
  assert(first.reviewStatus === "awaiting-user-approval", "Match 1 must await user approval.");
  assert(
    firstPending?.id === "orr-r01-m02-power-patron-dark-magician" &&
      firstPending.gateStatus === "blocked-by-match-1-review",
    "Match 2 must remain visibly blocked by the Match 1 review.",
  );
}

assert(
  legacyRenderedMatches.some(
    (match) => match.id === "exhibition-sky-striker-kewl-tune-82feecd6f515",
  ),
  "The original Theater exhibition was changed or removed.",
);
assert(rr.renderedMatch.id === first.id, "The featured rendered match must point to Match 1.");
assert(rr.renderedMatch.games.length === 2, "The full two-game narrative is missing.");
const optimizedActions = rr.renderedMatch.games.flatMap((game) =>
  game.turns.flatMap((turn) => turn.actions),
);
assert(
  optimizedActions.some((action) => action.startsWith("Draw for turn.")),
  'The optimized narrative is missing the "Draw for turn" wording.',
);
assert(
  !optimizedActions.some((action) => /^(Sky Striker|Kewl Tune) draws [^.]+\./.test(action)),
  "A turn-draw card name leaked into the optimized description narrative.",
);
assert(
  rr.renderedMatch.media.sha256 ===
    "90f1004da45eef63232b0ab28561acaeb8141e7befb13b29691b99eddf849e91",
  "The full MP4 SHA-256 changed.",
);

const stem = "optimized-round-robin-match-001-sky-striker-vs-kewl-tune";
const poster = await stat(path.join(root, "media", `${stem}-poster.jpg`));
const captions = await read(path.join("media", `${stem}.vtt`));
assert(poster.size > 0, "The Match 1 poster is empty.");
assert(captions.startsWith("WEBVTT\n\n"), "Captions are not valid WebVTT.");
assert(captions.includes("00:00:00.300 --> 00:00:01.700"), "Expected first caption timing is missing.");
assert(!/\d{2}:\d{2}:\d{2},\d{3} -->/.test(captions), "SRT comma timings remain in the VTT.");

const workflow = await read(".github/workflows/pages.yml");
assert(workflow.includes(`${stem}.mp4`), "Pages workflow does not download the optimized MP4.");
assert(
  workflow.includes("90f1004da45eef63232b0ab28561acaeb8141e7befb13b29691b99eddf849e91"),
  "Pages workflow does not verify the optimized MP4 SHA-256.",
);
assert(
  workflow.includes("sky-striker-vs-kewl-tune-82feecd6f515.mp4"),
  "Pages workflow no longer retains the original exhibition MP4.",
);

const indexHtml = await read("index.html");
const inlineStart = indexHtml.indexOf("<script>\n");
const inlineEnd = indexHtml.lastIndexOf("</script>");
assert(inlineStart >= 0 && inlineEnd > inlineStart, "Could not locate the viewer's inline script.");
new vm.Script(indexHtml.slice(inlineStart + "<script>\n".length, inlineEnd), {
  filename: "index.html:inline-script",
});
assert(
  indexHtml.indexOf('src="data/rendered-matches.js"') <
    indexHtml.indexOf('src="data/optimized-round-robin.js"'),
  "Optimized data must load after the preserved rendered exhibition.",
);
assert(indexHtml.includes('data-view="optimized"'), "Optimized Round Robin navigation is missing.");
new vm.Script(await read("service-worker.js"), { filename: "service-worker.js" });
const manifest = JSON.parse(await read("manifest.webmanifest"));
assert(manifest.start_url === "./" && manifest.scope === "./", "PWA scope must support GitHub Pages.");

console.log(
  [
    "Optimized Round Robin validation passed.",
    `Decks: ${rr.decks.length}`,
    `Rounds: ${rr.rounds.length}`,
    `Matches: ${matches.length} (${complete.length} complete, ${pending.length} pending)`,
    `Unique pairings: ${pairs.size}`,
    firstPending
      ? `Next pending: ${firstPending.id}${firstPending.gateStatus ? " (approval required)" : ""}`
      : "Next pending: none",
    `Poster: ${poster.size} bytes`,
  ].join("\n"),
);
