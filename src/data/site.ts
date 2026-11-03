export const SITE = {
  name: "Cveca",
  url: "https://cveca.rs",
  title: "Cveca · Unikatni cvetni aranžmani | Žarkovo, Beograd",
  description:
    "Unikatni aranžmani od sezonskog cveća iz Žarkova. Svakog ponedeljka sveže cveće za vašu firmu u Beogradu i poklon aranžmani po narudžbini.",
};

export const CONTACT = {
  phone: "065 533 3885",
  phoneHref: "tel:+381655333885",
  phoneIntl: "+381655333885",
  // The same number is on Viber and WhatsApp, and takes SMS.
  viber: "viber://chat?number=%2B381655333885",
  whatsapp: "https://wa.me/381655333885",
  sms: "sms:+381655333885",
  email: "cveca26@gmail.com",
  instagram: "https://www.instagram.com/cveca.rs/",
  instagramHandle: "@cveca.rs",
  // Opens a direct message to the account in the Instagram app (no way to pre-fill the text).
  instagramDm: "https://ig.me/m/cveca.rs",
  // Only the area is public. The exact address (street, map pin) is off the site for now, at Ceca's wish:
  // pickup is arranged by message.
  neighborhood: "Žarkovo",
  municipality: "Čukarica",
  city: "Beograd",
};

export interface Size {
  id: "ljubicica" | "lala" | "suncokret";
  name: string;
  kind: string;
  space: string;
  price: number;
  popular?: boolean;
}

// Ceca's three sizes, named after flowers. One price per arrangement: a weekly delivery for companies
// (delivery included) or a single gift order. Monthly subscriptions are agreed with each client, not listed.
export const SIZES: Size[] = [
  { id: "ljubicica", name: "Ljubičica", kind: "Mali aranžman", space: "Za recepciju, pult ili radni sto", price: 4500 },
  { id: "lala", name: "Lala", kind: "Srednji aranžman", space: "Za čekaonicu, stočić ili veći pult", price: 6500, popular: true },
  { id: "suncokret", name: "Suncokret", kind: "Veliki aranžman", space: "Za ulaz, veliku čekaonicu ili visok pult", price: 8500 },
];

/** 7500 -> "7.500" */
export const din = (n: number) => n.toLocaleString("sr-RS");

/** "Ljubičica 4.500 din, Lala 6.500 din i Suncokret 8.500 din" */
export const priceList = () => {
  const items = SIZES.map((s) => `${s.name} ${din(s.price)} din`);
  return `${items.slice(0, -1).join(", ")} i ${items.at(-1)}`;
};

/** "4.500–8.500 RSD" */
export const priceRange = () => `${din(SIZES[0].price)}–${din(SIZES.at(-1)!.price)} RSD`;

// Gift orders need two days; anyone who needs one sooner is asked to get in touch anyway.
export const SOONER = "Treba vam ranije? Javite se, možda imam nešto za vas.";

/** Serbian plural for "fotografija": 1 fotografija, 2–4 fotografije, 5+ fotografija. */
export function photos(n: number) {
  const ten = n % 10;
  const hundred = n % 100;
  if (ten === 1 && hundred !== 11) return `${n} fotografija`;
  if (ten >= 2 && ten <= 4 && (hundred < 12 || hundred > 14)) return `${n} fotografije`;
  return `${n} fotografija`;
}

// Answers only use what Ceca wrote in her plan; the same list feeds the FAQPage schema.
export const FAQ = [
  {
    q: "Gde se nalazite?",
    a: "U Žarkovu (Bele Vode, opština Čukarica) u Beogradu. Poklon aranžman možete preuzeti lično ili ga dostavljam po dogovoru, a firmama je nedeljna dostava uključena u cenu.",
  },
  {
    q: "Kako izgleda saradnja sa firmama?",
    a: "Svakog ponedeljka donosim nov, svež aranžman na vašu recepciju i odnosim stari zajedno sa posudom. Saradnja je po ugovoru, a plaćanje preko računa, mesec dana unapred.",
  },
  {
    q: "Koliko košta nedeljni aranžman za firmu?",
    a: `Cena je po isporuci i zavisi od veličine: ${priceList()}. Dostava jednom nedeljno je uključena u cenu, a za dva ili više aranžmana nedeljno dogovaramo popust.`,
  },
  {
    q: "Koliko košta poklon aranžman?",
    a: `Zavisi od veličine: ${priceList()}. Uz poklon može ići i kartica sa porukom koju ispisujem rukom.`,
  },
  {
    q: "Koliko ranije treba da naručim poklon aranžman?",
    a: `Najmanje 48 sati unapred, kako bih stigla da izaberem cveće i složim aranžman samo za vas. ${SOONER}`,
  },
  {
    q: "Možete li da napravite aranžman po slici?",
    a: "Ne pravim kopije. Svaki aranžman je unikat, složen od sezonskog cveća po osećaju. Recite mi boje ili povod, ima li cveća, boja ili mirisa koje osoba za koju je aranžman voli ili možda baš ne voli.",
  },
];
