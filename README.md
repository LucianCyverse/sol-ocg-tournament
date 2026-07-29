# SOL OCG Tournament Viewer

The public iPhone viewer is published at:

`https://luciancyverse.github.io/sol-ocg-tournament/`

## Active data

- `index.html`: locked tournament history, standings, Deck Lab, and viewer code
- `data/rendered-matches.js`: rendered exhibitions shown in the Theater tab
- `data/optimized-round-robin.js`: separate nine-deck optimized tournament,
  deterministic schedule, live standings source, and review gate
- `data/cards.json`: legacy card data retained for compatibility
- `media/`: poster images and WebVTT captions

Rendered exhibitions are deliberately separate from the locked tournament
standings. The canonical MP4 is stored as a GitHub Release asset. The Pages
workflow verifies its SHA-256, adds it to the published site, and then deploys
the iPhone-playable copy without committing the large video to Git history.

## Optimized Round Robin

The Optimized Round Robin is a separate classifier from the locked July 2026
tournament and the earlier autonomous exhibition. It contains nine decks,
nine rounds, and 36 unique best-of-three pairings. Match 1 is Sky Striker
2–0 Kewl Tune. The tournament is intentionally paused at its review gate; the
remaining 35 matchups are scheduled but have not started.

The improved Match 1 Release convention is:

- Tag: `optimized-rr-m1-sky-kewl-82feecd6f515`
- Asset: `optimized-round-robin-match-001-sky-striker-vs-kewl-tune.mp4`
- SHA-256:
  `90f1004da45eef63232b0ab28561acaeb8141e7befb13b29691b99eddf849e91`

## Local test
Use a local web server; do not double-click `index.html`.

Node:

```bash
node tools/preview-server.mjs
```

Then open `http://127.0.0.1:4173`.

Python:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

Validate the optimized schedule and media references with:

```bash
node tools/validate-optimized-round-robin.mjs
```

## Publishing

`.github/workflows/pages.yml` publishes the site after a push to `main`.
GitHub Pages must use the GitHub Actions publishing source.
The workflow downloads and verifies both the original exhibition MP4 and the
separate Optimized Round Robin Match 1 MP4.

## Report completeness
- Elfnote vs. Kewl Tune: full structured report from the available transcript.
- Power Patron vs. Sky Striker: detailed condensed archive; exact original transcript was unavailable during migration.
- Toon Turbo vs. Dark Magician: detailed condensed archive; exact original transcript was unavailable during migration.
- Toon vs. Branded: awaiting audited replay.
