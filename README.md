# SOL OCG Tournament Viewer — Final Architecture

## Files you update
- `data/tournament-data.json`: matches, standings, version, updated date
- `data/cards.json`: known card names and permanent translation overrides

The application files normally remain unchanged.

## Local test
Use a local web server; do not double-click `index.html`.

Python:
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

## Netlify
This folder is deployable as-is. `netlify.toml` sets the publish directory and prevents stale tournament-data caching.

## Report completeness
- Elfnote vs. Kewl Tune: full structured report from the available transcript.
- Power Patron vs. Sky Striker: detailed condensed archive; exact original transcript was unavailable during migration.
- Toon Turbo vs. Dark Magician: detailed condensed archive; exact original transcript was unavailable during migration.
- Toon vs. Branded: awaiting audited replay.
