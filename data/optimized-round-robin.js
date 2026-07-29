const OPTIMIZED_ROUND_ROBIN = {
  schemaVersion: "1.0.0",
  id: "optimized-round-robin",
  label: "Optimized Round Robin",
  status: "paused-for-review",
  reviewGate: {
    status: "awaiting-user-approval",
    message:
      "Match 3 is complete and its full narrative is published. Match 4 will remain paused until the user approves continuation.",
  },
  checkpoint: {
    completedMatches: 3,
    pendingMatches: 33,
    nextMatchId: "orr-r01-m04-toon-elfnote",
  },
  format: {
    match: "Best of 3",
    rounds: 9,
    scheduledMatches: 36,
    matchesPerDeck: 8,
    policy:
      "Optimize each deck and its general play patterns; do not hard-code pilots around every individual opponent.",
  },
  decks: [
    { id: "sky-striker", name: "Sky Striker" },
    { id: "power-patron", name: "Power Patron" },
    { id: "chaos-ritual", name: "Chaos Ritual (RoLaD)" },
    { id: "toon", name: "Toon" },
    { id: "branded", name: "Branded" },
    { id: "elfnote", name: "Elfnote" },
    { id: "toon-turbo", name: "Toon Turbo" },
    { id: "dark-magician", name: "Dark Magician" },
    { id: "kewl-tune", name: "Kewl Tune" },
  ],
  scheduleRing: [
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
  ],
  rounds: [
    {
      number: 1,
      matches: [
        {
          id: "orr-r01-m01-sky-striker-kewl-tune",
          number: 1,
          table: 1,
          deckA: "sky-striker",
          deckB: "kewl-tune",
          status: "complete",
          reviewStatus: "approved",
          result: {
            winner: "sky-striker",
            games: { "sky-striker": 2, "kewl-tune": 0 },
          },
        },
        {
          id: "orr-r01-m02-power-patron-dark-magician",
          number: 2,
          table: 2,
          deckA: "power-patron",
          deckB: "dark-magician",
          status: "complete",
          reviewStatus: "approved",
          result: {
            winner: "power-patron",
            games: { "power-patron": 2, "dark-magician": 0 },
          },
        },
        {
          id: "orr-r01-m03-chaos-ritual-toon-turbo",
          number: 3,
          table: 3,
          deckA: "chaos-ritual",
          deckB: "toon-turbo",
          status: "complete",
          reviewStatus: "awaiting-user-approval",
          result: {
            winner: "chaos-ritual",
            games: { "chaos-ritual": 2, "toon-turbo": 0 },
          },
        },
        {
          id: "orr-r01-m04-toon-elfnote",
          number: 4,
          table: 4,
          deckA: "toon",
          deckB: "elfnote",
          status: "pending",
          gateStatus: "blocked-by-match-3-review",
        },
      ],
    },
    {
      number: 2,
      matches: [
        {
          id: "orr-r02-m05-sky-striker-dark-magician",
          number: 5,
          table: 1,
          deckA: "sky-striker",
          deckB: "dark-magician",
          status: "pending",
        },
        {
          id: "orr-r02-m06-kewl-tune-toon-turbo",
          number: 6,
          table: 2,
          deckA: "kewl-tune",
          deckB: "toon-turbo",
          status: "pending",
        },
        {
          id: "orr-r02-m07-power-patron-elfnote",
          number: 7,
          table: 3,
          deckA: "power-patron",
          deckB: "elfnote",
          status: "pending",
        },
        {
          id: "orr-r02-m08-chaos-ritual-branded",
          number: 8,
          table: 4,
          deckA: "chaos-ritual",
          deckB: "branded",
          status: "pending",
        },
      ],
    },
    {
      number: 3,
      matches: [
        {
          id: "orr-r03-m09-sky-striker-toon-turbo",
          number: 9,
          table: 1,
          deckA: "sky-striker",
          deckB: "toon-turbo",
          status: "pending",
        },
        {
          id: "orr-r03-m10-dark-magician-elfnote",
          number: 10,
          table: 2,
          deckA: "dark-magician",
          deckB: "elfnote",
          status: "pending",
        },
        {
          id: "orr-r03-m11-kewl-tune-branded",
          number: 11,
          table: 3,
          deckA: "kewl-tune",
          deckB: "branded",
          status: "pending",
        },
        {
          id: "orr-r03-m12-chaos-ritual-toon",
          number: 12,
          table: 4,
          deckA: "chaos-ritual",
          deckB: "toon",
          status: "pending",
        },
      ],
    },
    {
      number: 4,
      matches: [
        {
          id: "orr-r04-m13-sky-striker-elfnote",
          number: 13,
          table: 1,
          deckA: "sky-striker",
          deckB: "elfnote",
          status: "pending",
        },
        {
          id: "orr-r04-m14-toon-turbo-branded",
          number: 14,
          table: 2,
          deckA: "toon-turbo",
          deckB: "branded",
          status: "pending",
        },
        {
          id: "orr-r04-m15-kewl-tune-toon",
          number: 15,
          table: 3,
          deckA: "kewl-tune",
          deckB: "toon",
          status: "pending",
        },
        {
          id: "orr-r04-m16-power-patron-chaos-ritual",
          number: 16,
          table: 4,
          deckA: "power-patron",
          deckB: "chaos-ritual",
          status: "pending",
        },
      ],
    },
    {
      number: 5,
      matches: [
        {
          id: "orr-r05-m17-sky-striker-branded",
          number: 17,
          table: 1,
          deckA: "sky-striker",
          deckB: "branded",
          status: "pending",
        },
        {
          id: "orr-r05-m18-toon-turbo-toon",
          number: 18,
          table: 2,
          deckA: "toon-turbo",
          deckB: "toon",
          status: "pending",
        },
        {
          id: "orr-r05-m19-dark-magician-chaos-ritual",
          number: 19,
          table: 3,
          deckA: "dark-magician",
          deckB: "chaos-ritual",
          status: "pending",
        },
        {
          id: "orr-r05-m20-kewl-tune-power-patron",
          number: 20,
          table: 4,
          deckA: "kewl-tune",
          deckB: "power-patron",
          status: "pending",
        },
      ],
    },
    {
      number: 6,
      matches: [
        {
          id: "orr-r06-m21-branded-toon",
          number: 21,
          table: 1,
          deckA: "branded",
          deckB: "toon",
          status: "pending",
        },
        {
          id: "orr-r06-m22-elfnote-chaos-ritual",
          number: 22,
          table: 2,
          deckA: "elfnote",
          deckB: "chaos-ritual",
          status: "pending",
        },
        {
          id: "orr-r06-m23-toon-turbo-power-patron",
          number: 23,
          table: 3,
          deckA: "toon-turbo",
          deckB: "power-patron",
          status: "pending",
        },
        {
          id: "orr-r06-m24-dark-magician-kewl-tune",
          number: 24,
          table: 4,
          deckA: "dark-magician",
          deckB: "kewl-tune",
          status: "pending",
        },
      ],
    },
    {
      number: 7,
      matches: [
        {
          id: "orr-r07-m25-sky-striker-toon",
          number: 25,
          table: 1,
          deckA: "sky-striker",
          deckB: "toon",
          status: "pending",
        },
        {
          id: "orr-r07-m26-branded-power-patron",
          number: 26,
          table: 2,
          deckA: "branded",
          deckB: "power-patron",
          status: "pending",
        },
        {
          id: "orr-r07-m27-elfnote-kewl-tune",
          number: 27,
          table: 3,
          deckA: "elfnote",
          deckB: "kewl-tune",
          status: "pending",
        },
        {
          id: "orr-r07-m28-toon-turbo-dark-magician",
          number: 28,
          table: 4,
          deckA: "toon-turbo",
          deckB: "dark-magician",
          status: "pending",
        },
      ],
    },
    {
      number: 8,
      matches: [
        {
          id: "orr-r08-m29-sky-striker-chaos-ritual",
          number: 29,
          table: 1,
          deckA: "sky-striker",
          deckB: "chaos-ritual",
          status: "pending",
        },
        {
          id: "orr-r08-m30-toon-power-patron",
          number: 30,
          table: 2,
          deckA: "toon",
          deckB: "power-patron",
          status: "pending",
        },
        {
          id: "orr-r08-m31-branded-dark-magician",
          number: 31,
          table: 3,
          deckA: "branded",
          deckB: "dark-magician",
          status: "pending",
        },
        {
          id: "orr-r08-m32-elfnote-toon-turbo",
          number: 32,
          table: 4,
          deckA: "elfnote",
          deckB: "toon-turbo",
          status: "pending",
        },
      ],
    },
    {
      number: 9,
      matches: [
        {
          id: "orr-r09-m33-sky-striker-power-patron",
          number: 33,
          table: 1,
          deckA: "sky-striker",
          deckB: "power-patron",
          status: "pending",
        },
        {
          id: "orr-r09-m34-chaos-ritual-kewl-tune",
          number: 34,
          table: 2,
          deckA: "chaos-ritual",
          deckB: "kewl-tune",
          status: "pending",
        },
        {
          id: "orr-r09-m35-toon-dark-magician",
          number: 35,
          table: 3,
          deckA: "toon",
          deckB: "dark-magician",
          status: "pending",
        },
        {
          id: "orr-r09-m36-branded-elfnote",
          number: 36,
          table: 4,
          deckA: "branded",
          deckB: "elfnote",
          status: "pending",
        },
      ],
    },
  ],
};

const optimizedSourceMatch = RENDERED_MATCHES.find(
  (match) => match.id === "exhibition-sky-striker-kewl-tune-82feecd6f515",
);

if (!optimizedSourceMatch) {
  throw new Error("The source Sky Striker vs. Kewl Tune narrative is missing.");
}

const optimizedNarrativeGames = optimizedSourceMatch.games.map((game) => ({
  ...game,
  turns: game.turns.map((turn) => ({
    ...turn,
    actions: turn.actions.map((action, actionIndex) =>
      actionIndex === 0
        ? action.replace(/^(Sky Striker|Kewl Tune) draws [^.]+\./, "Draw for turn.")
        : action,
    ),
  })),
}));

OPTIMIZED_ROUND_ROBIN.renderedMatch = {
  ...optimizedSourceMatch,
  id: "orr-r01-m01-sky-striker-kewl-tune",
  round: "Optimized Round Robin · Round 1 · Match 1",
  score: "Sky Striker 2–0",
  status: "complete",
  reviewStatus: "awaiting-user-approval",
  context: [
    "This is the first match in the separate Optimized Round Robin. It does not alter the locked July 2026 standings or the earlier autonomous exhibition.",
    "The simulation uses the optimized pilots and the improved full-match narration, including natural shortened card references after each card's first full introduction.",
    "The tournament is paused after this match for user review. The remaining 35 matchups are scheduled but have not started.",
    ...(optimizedSourceMatch.context || []).slice(1),
  ],
  games: optimizedNarrativeGames,
  media: {
    videoUrl:
      "https://luciancyverse.github.io/sol-ocg-tournament/media/optimized-round-robin-match-001-sky-striker-vs-kewl-tune.mp4",
    downloadUrl:
      "https://github.com/LucianCyverse/sol-ocg-tournament/releases/download/optimized-rr-m1-sky-kewl-82feecd6f515/optimized-round-robin-match-001-sky-striker-vs-kewl-tune.mp4",
    posterUrl:
      "media/optimized-round-robin-match-001-sky-striker-vs-kewl-tune-poster.jpg",
    captionsUrl:
      "media/optimized-round-robin-match-001-sky-striker-vs-kewl-tune.vtt",
    duration: "12:41.92",
    format: "1280 × 720 H.264/AAC · 30 FPS",
    bytes: 77243304,
    sha256:
      "90f1004da45eef63232b0ab28561acaeb8141e7befb13b29691b99eddf849e91",
    narration: {
      voice: "Matilda",
      newlyGeneratedClips: 72,
      sourceCharacters: 8742,
    },
  },
};

OPTIMIZED_ROUND_ROBIN.renderedMatches = [
  OPTIMIZED_ROUND_ROBIN.renderedMatch,
  OPTIMIZED_MATCH_002,
  OPTIMIZED_MATCH_003,
];
