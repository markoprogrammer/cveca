// Raster copies of public/favicon.svg, for Google Search: it shows favicons only from BMP, GIF, ICO,
// PNG, JPEG, PPM or TIFF files (not SVG), ideally larger than 48 px and in multiples of 48.
// Browsers keep using the SVG; apple-touch-icon.png (ivory tile, 180 px) is made separately.
//
//   npm run favicons
//
// public/favicon.svg -> public/favicon.ico (16, 32, 48 px) and public/favicon-96x96.png
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile("public/favicon.svg");

// The SVG is 24 units wide; render it large and scale down, so small sizes stay crisp.
const png = (size) => sharp(svg, { density: 72 * (size / 24) * 4 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

await writeFile("public/favicon-96x96.png", await png(96));

// ICO with PNG-compressed images inside (supported everywhere since Windows Vista):
// a 6-byte header, one 16-byte entry per image, then the PNG data.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(size, e); // width (0 would mean 256)
  header.writeUInt8(size, e + 1); // height
  header.writeUInt8(0, e + 2); // no palette
  header.writeUInt8(0, e + 3); // reserved
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
await writeFile("public/favicon.ico", Buffer.concat([header, ...images]));

console.log(`favicon.ico (${sizes.join(", ")} px) and favicon-96x96.png written to public/`);
