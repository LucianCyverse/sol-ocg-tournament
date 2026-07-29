# SOL OCG Tournament Viewer

The public iPhone viewer is published at:

`https://luciancyverse.github.io/sol-ocg-tournament/`

## Active data

- `index.html`: locked tournament history, standings, Deck Lab, and viewer code
- `data/rendered-matches.js`: rendered exhibitions shown in the Theater tab
- `data/cards.json`: legacy card data retained for compatibility
- `media/`: poster images and WebVTT captions

Rendered exhibitions are deliberately separate from the locked tournament
standings. The canonical MP4 is stored as a GitHub Release asset. The Pages
workflow verifies its SHA-256, adds it to the published site, and then deploys
the iPhone-playable copy without committing the large video to Git history.

## Local test
Use a local web server; do not double-click `index.html`.

Python:
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

## Publishing

`.github/workflows/pages.yml` publishes the site after a push to `main`.
GitHub Pages must use the GitHub Actions publishing source.

## Report completeness
- Elfnote vs. Kewl Tune: full structured report from the available transcript.
- Power Patron vs. Sky Striker: detailed condensed archive; exact original transcript was unavailable during migration.
- Toon Turbo vs. Dark Magician: detailed condensed archive; exact original transcript was unavailable during migration.
- Toon vs. Branded: awaiting audited replay.
