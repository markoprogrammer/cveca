// High-resolution landscape crops for the "Pogledajte izbliza" scene, cut straight from the camera
// originals (cveca-slike*/, gitignored). The scene shows them full screen, where the 2200px masters
// from prepare-images would be soft on retina displays.
//
//   node scripts/zoom-crops.mjs
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OUT = "src/assets/zoom";
// centerY: vertical centre of the 16:10 band, as a fraction of the photo's height.
const CROPS = [
  { src: "cveca-slike-2/Buket 6/DSC_7523.jpg", out: "buket-06-ljuljaska.jpg", centerY: 0.42 },
  { src: "cveca-slike-2/Buket 6/DSC_7524.jpg", out: "buket-06-detalj.jpg", centerY: 0.47 },
];

await mkdir(OUT, { recursive: true });
for (const c of CROPS) {
  const img = sharp(c.src).rotate();
  const { width, height } = await img.metadata();
  const h = Math.round((width * 10) / 16);
  const top = Math.max(0, Math.min(height - h, Math.round(c.centerY * height - h / 2)));
  await img.extract({ left: 0, top, width, height: h }).jpeg({ quality: 84, mozjpeg: true }).toFile(`${OUT}/${c.out}`);
  console.log(`${c.out}: ${width}x${h}`);
}
