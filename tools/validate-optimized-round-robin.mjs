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
vm.runInContext(await read("data/optimized-match-002.js"), context, {
  filename: "data/optimized-match-002.js",
});
vm.runInContext(await read("data/optimized-match-003.js"), context, {
  filename: "data/optimized-match-003.js",
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
const second = matches[1];
const third = matches[2];
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
assert(
  first.reviewStatus === "approved",
  "Match 1 must remain approved before Match 2 can be published.",
);
assert(
  second.id === "orr-r01-m02-power-patron-dark-magician" &&
    second.deckA === "power-patron" &&
    second.deckB === "dark-magician",
  "Match 2 is not Power Patron vs. Dark Magician.",
);
assert(
  second.result?.winner === "power-patron" &&
    second.result.games["power-patron"] === 2 &&
    second.result.games["dark-magician"] === 0,
  "Match 2 must remain a 2-0 Power Patron win.",
);
assert(second.reviewStatus === "approved", "Match 2 must be approved before Match 3.");
assert(
  third.id === "orr-r01-m03-chaos-ritual-toon-turbo" &&
    third.deckA === "chaos-ritual" &&
    third.deckB === "toon-turbo",
  "Match 3 is not Chaos Ritual vs. Toon Turbo.",
);
assert(
  third.result?.winner === "chaos-ritual" &&
    third.result.games["chaos-ritual"] === 2 &&
    third.result.games["toon-turbo"] === 0,
  "Match 3 must remain a 2-0 Chaos Ritual win.",
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
  assert(third.reviewStatus === "awaiting-user-approval", "Match 3 must await user approval.");
  assert(
    firstPending?.id === "orr-r01-m04-toon-elfnote" &&
      firstPending.gateStatus === "blocked-by-match-3-review",
    "Match 4 must remain visibly blocked by the Match 3 review.",
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
assert(
  Array.isArray(rr.renderedMatches) &&
    rr.renderedMatches.length === 3 &&
    rr.renderedMatches[0].id === first.id &&
    rr.renderedMatches[1].id === second.id &&
    rr.renderedMatches[2].id === third.id,
  "The three completed matches are not published in schedule order.",
);
const secondRendered = rr.renderedMatches[1];
assert(secondRendered.games.length === 2, "Match 2's full two-game narrative is missing.");
assert(
  secondRendered.games.reduce(
    (count, game) =>
      count + game.turns.reduce((turnCount, turn) => turnCount + turn.actions.length, 0),
    0,
  ) === 65,
  "Match 2 must retain all 65 certified presentation actions.",
);
assert(
  secondRendered.verification?.matchCommitment ===
    "0CC6565FC0E4247B8112440879D17C618526CBDF5798B5E019F9F84A78F03935",
  "Match 2's certified match commitment changed.",
);
assert(
  secondRendered.media?.sha256 ===
      "6392e3714bdedf322d63fa3544ec5ae2da0d2c9e57516c6d98b316f61ec3b157" &&
    secondRendered.media.bytes === 76151374 &&
    secondRendered.media.duration === "12:22.95" &&
    secondRendered.media.narration?.voice === "Matilda" &&
    secondRendered.media.narration?.newlyGeneratedClips === 65,
  "Match 2's verified video or narration binding changed.",
);
const thirdRendered = rr.renderedMatches[2];
assert(thirdRendered.games.length === 2, "Match 3's full two-game narrative is missing.");
assert(
  thirdRendered.games.reduce(
    (count, game) =>
      count + game.turns.reduce((turnCount, turn) => turnCount + turn.actions.length, 0),
    0,
  ) === 36,
  "Match 3 must retain all 36 certified presentation actions.",
);
assert(
  thirdRendered.verification?.matchCommitment ===
      "A00CA92CE9F8A68083E2892D672DD5C598E41471636DCA890018F406DEE4A2BD" &&
    thirdRendered.verification?.certificationCommitment ===
      "A5A5D15A08201FB07382CCF658A0D3EF5DB13A0661A3DEF12F6A5F1477178ED4" &&
    thirdRendered.verification?.pilotDecisions === 467 &&
    thirdRendered.verification?.releaseBlockingCounters === 0 &&
    thirdRendered.verification?.turns === 8,
  "Match 3's certified report binding changed.",
);
assert(
  thirdRendered.media?.sha256 ===
      "e06a1dc19bbc7f7b44a03377043620bb32aced5280a0e3c46bc539581e567d26" &&
    thirdRendered.media?.bytes === 42905488 &&
    thirdRendered.media?.duration === "07:33.72" &&
    thirdRendered.media?.narration?.voice === "Matilda" &&
    thirdRendered.media?.narration?.newlyGeneratedClips === 39 &&
    thirdRendered.media?.narration?.measuredCredits === 3286,
  "Match 3's verified video or narration binding changed.",
);
const optimizedActions = rr.renderedMatches.flatMap((match) =>
  match.games.flatMap((game) =>
  game.turns.flatMap((turn) => turn.actions),
  ),
);
assert(
  optimizedActions.some((action) => action.startsWith("Draw for turn.")),
  'The optimized narrative is missing the "Draw for turn" wording.',
);
assert(
  !optimizedActions.some((action) =>
    /^(Sky Striker|Kewl Tune|Power Patron|Dark Magician|Chaos Ritual|Toon Turbo) draws [^.]+\./.test(action),
  ),
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

const secondStem =
  "optimized-round-robin-match-002-power-patron-vs-dark-magician";
const secondPoster = await stat(
  path.join(root, "media", `${secondStem}-poster.jpg`),
);
const secondCaptions = await read(path.join("media", `${secondStem}.vtt`));
assert(secondPoster.size > 0, "The Match 2 poster is empty.");
assert(secondCaptions.startsWith("WEBVTT\n\n"), "Match 2 captions are not valid WebVTT.");
assert(
  secondCaptions.includes("00:00:00.300 --> 00:00:01.833"),
  "Match 2's first caption timing is missing.",
);
assert(
  !/\d{2}:\d{2}:\d{2},\d{3} -->/.test(secondCaptions),
  "SRT comma timings remain in Match 2's VTT.",
);
const secondMedia = JSON.parse(await read("data/optimized-match-002-media.json"));
assert(
  JSON.stringify(secondMedia) === JSON.stringify(secondRendered.media),
  "The generated Match 2 record drifted from its media source.",
);

const thirdStem =
  "optimized-round-robin-match-003-chaos-ritual-vs-toon-turbo";
const thirdPoster = await stat(
  path.join(root, "media", `${thirdStem}-poster.jpg`),
);
const thirdCaptions = await read(path.join("media", `${thirdStem}.vtt`));
assert(thirdPoster.size > 0, "The Match 3 poster is empty.");
assert(thirdCaptions.startsWith("WEBVTT\n\n"), "Match 3 captions are not valid WebVTT.");
assert(
  !/\d{2}:\d{2}:\d{2},\d{3} -->/.test(thirdCaptions),
  "SRT comma timings remain in Match 3's VTT.",
);
const thirdMedia = JSON.parse(await read("data/optimized-match-003-media.json"));
assert(
  JSON.stringify(thirdMedia) === JSON.stringify(thirdRendered.media),
  "The generated Match 3 record drifted from its media source.",
);

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
assert(
  workflow.includes(`${secondStem}.mp4`) &&
    workflow.includes(
      "6392e3714bdedf322d63fa3544ec5ae2da0d2c9e57516c6d98b316f61ec3b157",
    ),
  "Pages workflow does not download and verify the Match 2 MP4.",
);
assert(
  workflow.includes(`${thirdStem}.mp4`) &&
    workflow.includes(
      "e06a1dc19bbc7f7b44a03377043620bb32aced5280a0e3c46bc539581e567d26",
    ),
  "Pages workflow does not download and verify the Match 3 MP4.",
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
      indexHtml.indexOf('src="data/optimized-match-002.js"') &&
    indexHtml.indexOf('src="data/optimized-match-002.js"') <
      indexHtml.indexOf('src="data/optimized-match-003.js"') &&
    indexHtml.indexOf('src="data/optimized-match-003.js"') <
      indexHtml.indexOf('src="data/optimized-round-robin.js"'),
  "Optimized matches must load between the preserved exhibition and tournament data.",
);
assert(
  indexHtml.includes('src="data/optimized-card-extensions.js"'),
  "The Match 2 clickable-card metadata extension is missing.",
);
const cardExtensionsSource = await read("data/optimized-card-extensions.js");
assert(
  cardExtensionsSource.includes('"Magistus Chorozo"') &&
    cardExtensionsSource.includes('"Master of Chaos"') &&
    cardExtensionsSource.includes('"Rahamu, Envoy of the Sacred Tome"') &&
    cardExtensionsSource.includes('"Toon Dark Magician Girl"') &&
    cardExtensionsSource.includes('"Toon Table of Contents"') &&
    cardExtensionsSource.includes('"Dominus Spark"'),
  "Clickable-card records required by the optimized matches are missing.",
);
assert(indexHtml.includes('data-view="optimized"'), "Optimized Round Robin navigation is missing.");
new vm.Script(await read("service-worker.js"), { filename: "service-worker.js" });
const serviceWorker = await read("service-worker.js");
assert(
  serviceWorker.includes(`${secondStem}-poster.jpg`) &&
    serviceWorker.includes(`${secondStem}.vtt`),
  "The PWA does not cache Match 2's poster and captions.",
);
assert(
  serviceWorker.includes("data/optimized-match-003.js"),
  "The PWA does not cache Match 3's narrative.",
);
assert(
  serviceWorker.includes(`${thirdStem}-poster.jpg`) &&
    serviceWorker.includes(`${thirdStem}.vtt`),
  "The PWA does not cache Match 3's poster and captions.",
);
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
    `Posters: ${poster.size}, ${secondPoster.size}, and ${thirdPoster.size} bytes`,
  ].join("\n"),
);
