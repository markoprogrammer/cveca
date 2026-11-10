// /llms.txt: the site in plain Markdown for AI assistants and their crawlers (ChatGPT, Claude, Perplexity…), which
// read a short summary more reliably than a designed page. Built from the same data as the pages (site.ts, seo.ts,
// bouquets.ts), so prices, answers and the gallery can never drift from what the site shows.
import type { APIRoute } from "astro";
import { CONTACT, FAQ, SITE, SIZES, din } from "../data/site";
import { businessService, giftService, restaurantService } from "../data/seo";
import { bouquets } from "../data/bouquets";

const abs = (path: string) => new URL(path, SITE.url).href;

export const GET: APIRoute = () => {
  const body = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "Svaki aranžman je unikat, složen ručno od sezonskog cveća. Fotografije na sajtu su primeri ranijih aranžmana.",
    "",
    "## Kontakt",
    `- Telefon, Viber, WhatsApp i SMS: ${CONTACT.phone} (${CONTACT.phoneIntl})`,
    `- Mejl: ${CONTACT.email}`,
    `- Instagram: ${CONTACT.instagram} (${CONTACT.instagramHandle})`,
    `- Mesto: ${CONTACT.neighborhood}, opština ${CONTACT.municipality}, ${CONTACT.city}`,
    "",
    "## Usluge",
    ...[businessService, restaurantService, giftService].map((s) => `- [${s.name}](${s.url}): ${s.description}`),
    "",
    "## Veličine i cene",
    "Cena je po aranžmanu, za firme i za poklone. Firmama je nedeljna dostava uključena u cenu. Za restorane i kafiće cena se dogovara prema količini: što više stolova, to je povoljnije.",
    ...SIZES.map((s) => `- ${s.name} (${s.kind.toLowerCase()}, ${s.space.charAt(0).toLowerCase()}${s.space.slice(1)}): ${din(s.price)} RSD`),
    "",
    "## Česta pitanja",
    ...FAQ.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Unikati",
    `- [Galerija svih unikata](${abs("/unikati/")})`,
    ...[...bouquets].sort((a, b) => a.n - b.n).map((b) => `- [${b.title}](${abs(`/unikati/${b.slug}/`)}): ${b.vessel.toLowerCase()}; ${b.flowers.toLowerCase()}.`),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
