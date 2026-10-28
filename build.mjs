/**
 * Build step for a site that has nothing to compile.
 *
 * Netlify runs `npm run build`, so rather than leave that command failing on a
 * missing package.json, this stages the runtime files into dist/ - the folder
 * Netlify publishes. Anything not listed here (git config, the local dev
 * server, the SMTP example file) stays out of the deploy.
 */
import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';

const OUT = 'dist';
const ENTRIES = ['index.html', 'style.css', 'script.js', 'images'];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const entry of ENTRIES) {
    cpSync(entry, `${OUT}/${entry}`, { recursive: true });
}

console.log(`Staged into ${OUT}/: ${readdirSync(OUT).join(', ')}`);
