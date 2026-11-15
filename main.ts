// STRIKE PROTOCOL — make.fun threejs-fps-02 entrypoint.
//
// Node 22, standard library only. The grader runs this file twice in a
// sandbox with no network: the repository arrives read-only at /bot and the
// only writable directory is /output. This program copies the playable game
// and its screenshots into /output, then writes /output/dossier.json — the
// summary the judge reads — with the vendored make.fun dossier library.
//
// Play it locally first:
//   node serve.ts            (serves game/ at http://localhost:8080)
// Hand it in locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync as copyDir, existsSync as pathExists, mkdirSync as makeDir, writeFileSync as writeText } from 'node:fs';
import { join as joinPath } from 'node:path';
import { fileURLToPath as urlToPath } from 'node:url';
import { buildDossier as buildGameDossier } from './vendor/makefun-threejs.ts';

// The repository root is the directory this file lives in.
const strikeRoot = urlToPath(new URL('.', import.meta.url));
const strikeOut = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The playable game: static ES modules plus the vendored three.js build.
makeDir(joinPath(strikeOut, 'game'), { recursive: true });
copyDir(joinPath(strikeRoot, 'game'), joinPath(strikeOut, 'game'), { recursive: true });

// The screenshots: the first by name is the entry's cover image.
makeDir(joinPath(strikeOut, 'screenshots'), { recursive: true });
const strikeShots = joinPath(strikeRoot, 'screenshots');
if (pathExists(strikeShots)) copyDir(strikeShots, joinPath(strikeOut, 'screenshots'), { recursive: true });

// The gate's own caps (the kit's reference/gate.json): at most four shots of
// 256 KiB, game/ at most 993 entries and 48 MiB, dossier text at most 160 KiB.
const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
};
const strikeDossier = buildGameDossier(strikeOut, dossierCaps);
writeText(joinPath(strikeOut, 'dossier.json'), strikeDossier);
