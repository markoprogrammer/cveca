// Turns the full-size camera originals in cveca-slike*/ (gitignored, ~10 MB each)
// into web masters in src/assets/ that are small enough to commit.
// The masters stay JPEG on purpose: Astro encodes WebP/AVIF from them at build time,
// and starting from a WebP master would compress every photo twice.
//
//   npm run images
//
// cveca-slike-2/Buket 6 -> src/assets/buketi/buket-06/dsc_7520.jpg
// cveca-slike-1/Fićko   -> src/assets/ficko/dsc_7593.jpg
import { mkdir, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const OUT = "src/assets";
const MAX_EDGE = 2200;
// Never published: photos with a child in them (no parental consent for a public site/repo yet).
const SKIP = new Set(["dsc_7593.jpg", "dsc_7594.jpg", "dsc_7595.jpg"]);

const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "dj").toLowerCase().replace(/\s+/g, "-");

function outDir(folder) {
  const m = folder.match(/^Buket\s+(\d+)$/i);
  if (m) return join(OUT, "buketi", `buket-${m[1].padStart(2, "0")}`);
  return join(OUT, slug(folder));
}

const roots = (await readdir(".", { withFileTypes: true })).filter((d) => d.isDirectory() && d.name.startsWith("cveca-slike")).map((d) => d.name);
const folders = [];
for (const root of roots.sort()) {
  for (const d of await readdir(root, { withFileTypes: true })) if (d.isDirectory()) folders.push(join(root, d.name));
}

let made = 0;
let skipped = 0;
for (const folder of folders) {
  const dest = outDir(folder.split("/").pop());
  await mkdir(dest, { recursive: true });
  const files = (await readdir(folder)).filter((f) => /\.jpe?g$/i.test(f) && !SKIP.has(f.toLowerCase())).sort();
  for (const file of files) {
    const target = join(dest, file.toLowerCase());
    const exists = await stat(target).catch(() => null);
    if (exists) { skipped++; continue; }
    // rotate() applies the EXIF orientation; sharp drops all metadata (GPS, camera) by default.
    await sharp(join(folder, file))
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(target);
    made++;
    if (made % 10 === 0) console.log(`${made} napravljeno…`);
  }
}
console.log(`\nGotovo: ${made} novih, ${skipped} već postoji.`);
