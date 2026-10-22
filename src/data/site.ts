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
  street: "Kraljevačkih žrtava 3",
  neighborhood: "Žarkovo",
  municipality: "Čukarica",
  city: "Beograd",
  postalCode: "11147",
  // Kraljevačkih žrtava 3, Bele Vode (OpenStreetMap)
  lat: 44.7513624,
  lng: 20.4086178,
  maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Kraljevačkih žrtava 3, 11147 Beograd")}`,
};

export interface Size {
  id: "M" | "L" | "XL";
  space: string;
  price: number;
  popular?: boolean;
}

// Weekly delivery for companies, price per delivery.
export const SIZES: Size[] = [
  { id: "M", space: "Manja recepcija, šalter, sto", price: 5500 },
  { id: "L", space: "Recepcija, hol, veći prostor", price: 7500, popular: true },
  { id: "XL", space: "Veliki prostor, hotel, restoran", price: 10500 },
];

/** 7500 -> "7.500" */
export const din = (n: number) => n.toLocaleString("sr-RS");

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
    a: `U Žarkovu (Bele Vode, opština Čukarica), na adresi ${CONTACT.street}, ${CONTACT.postalCode} Beograd. Aranžman možete preuzeti lično, a dostava je moguća po dogovoru.`,
  },
  {
    q: "Kako izgleda saradnja sa firmama?",
    a: "Svakog ponedeljka donosim nov, svež aranžman na vašu recepciju i odnosim stari zajedno sa posudom. Saradnja je po ugovoru, a plaćanje preko računa, mesec dana unapred.",
  },
  {
    q: "Koliko košta nedeljni aranžman za firmu?",
    a: `Cena je po isporuci i zavisi od veličine: M ${din(5500)} din, L ${din(7500)} din, XL ${din(10500)} din.`,
  },
  {
    q: "Koliko ranije treba da naručim poklon aranžman?",
    a: "Najmanje 48 sati unapred, kako bih stigla da izaberem cveće i složim aranžman samo za vas.",
  },
  {
    q: "Možete li da napravite aranžman po slici?",
    a: "Ne pravim kopije. Svaki aranžman je unikat, složen od sezonskog cveća po osećaju. Recite mi kome je namenjen i kakav je to čovek, a ja ću napraviti nešto samo za njega.",
  },
];
