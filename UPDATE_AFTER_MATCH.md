# Updating after a new tournament or rendered match

## Locked tournament history

The current tournament database is embedded in `index.html`. Update it only
from the canonical audited tournament source, and keep the locked standings
and unique-pairing assertions intact.

## Rendered exhibitions

1. Generate and verify the match report, presentation JSON, narration, captions,
   and final MP4 in SOL Duel Theater.
2. Add the exhibition record to `data/rendered-matches.js`.
3. Add a poster and WebVTT captions under `media/`.
4. Upload the canonical MP4 to a versioned GitHub Release.
5. Add the versioned asset URL and SHA-256 to
   `.github/workflows/pages.yml`.
6. Push the viewer update to `main`.
7. Confirm the Pages workflow passes, then verify the Theater tab, native video
   controls, captions, and full narrative on the public viewer.

Rendered exhibitions must remain separate from tournament standings unless the
canonical tournament itself is deliberately revised.
