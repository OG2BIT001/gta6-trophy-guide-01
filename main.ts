// Leonida Platinum — entry program for gta6-trophy-guide-01 (Node 22, standard library only).
//
// The guide itself is the static web app in app/ (open app/index.html in a browser; it works
// offline and saves progress in the browser). This program is the hand-in: it copies app/ and
// screenshots/ from this repository into the output directory and writes dossier.json there
// using buildDossier from vendor/makefun-frontend.ts, the kit's library, left unchanged —
// the scorer rebuilds the dossier with its own copy and compares the two byte for byte.
//
// Run it with:  MAKEFUN_OUTPUT_DIR=out node main.ts      (outside the grader, MAKEFUN_OUTPUT_DIR
// stands in for /output). Try the guide itself with:  node serve.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
const shotsDir = join(repoRoot, 'screenshots');
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
}

// The caps are the scorer's own (the kit's gate limits): dossier text at most 163,840 bytes,
// at most 4 screenshots of at most 262,144 bytes each, app/ at most 993 files and directories
// and 48 MiB. buildDossier refuses anything past them, as the scorer would.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
