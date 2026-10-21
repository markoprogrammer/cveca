# Cveca

Sajt Cecinih unikatnih cvetnih aranžmana. Astro (statički), Tailwind 4, hostovan na Cloudflare Workers (Static Assets).

## Razvoj

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # statički sajt u dist/
npm run check     # provera tipova
```

## Fotografije

Originali sa aparata (`cveca-slike*/`, oko 10 MB po slici) **nisu u gitu**. Iz njih se prave web verzije:

```bash
npm run images    # cveca-slike*/<folder>/*.jpg -> src/assets/..., 2200 px, bez EXIF/GPS podataka
```

Pri build-u Astro od tih verzija pravi WebP (i AVIF za naslovnu sliku) u više veličina.
Koje fotografije idu u galeriju i kojim redom, određuje `src/data/bouquets.ts` (prva je naslovna).

## Objavljivanje

```bash
npm run deploy    # astro build && wrangler deploy
```
