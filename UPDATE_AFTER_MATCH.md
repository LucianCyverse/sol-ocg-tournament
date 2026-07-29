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

## Optimized Round Robin

The Optimized Round Robin is maintained in
`data/optimized-round-robin.js`. It is separate from both locked tournament
history and the Theater exhibition archive.

After the user approves the current review gate:

1. Run only the next pending scheduled matchup in SOL Duel Theater.
2. Verify the match report, commitment, optimized-pilot audit, narration,
   captions, final MP4, and encoded playback.
3. Mark that one scheduled record complete and add its result. Do not manually
   edit the derived standings.
4. Add the full rendered-match narrative and its media metadata.
5. Add the poster and WebVTT captions under `media/`.
6. Upload the MP4 as a versioned Release asset and add its exact URL and
   SHA-256 to `.github/workflows/pages.yml`.
7. Run `node tools/validate-optimized-round-robin.mjs`.
8. Publish only after the local review gate and media checks pass.

Never start a later matchup merely because its schedule entry exists. A pending
entry is preparation, not authorization to simulate or render it.
