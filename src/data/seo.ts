// Structured data shared by the inner pages.
import { CONTACT, SITE, SIZES } from "./site";

const abs = (path: string) => new URL(path, SITE.url).href;

export interface Crumb {
  name: string;
  path: string;
}

export const breadcrumbs = (items: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
});

const provider = { "@id": `${SITE.url}/#cveca` };
const beograd = { "@type": "City", name: CONTACT.city };

export const businessService = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nedeljna dostava cvetnih aranžmana za firme",
  serviceType: "Cveće za firme",
  description: "Svakog ponedeljka nov, svež aranžman na recepciji; stari se odnosi zajedno sa posudom. Po ugovoru, plaćanje preko računa mesec dana unapred.",
  provider,
  areaServed: beograd,
  url: abs("/cvece-za-firme/"),
  offers: SIZES.map((s) => ({ "@type": "Offer", name: `Veličina ${s.id}`, description: s.space, price: s.price, priceCurrency: "RSD" })),
};

export const giftService = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Poklon aranžmani po narudžbini",
  serviceType: "Poklon cvetni aranžman",
  description: "Unikatni aranžmani od sezonskog cveća, po narudžbini najmanje 48 sati unapred. Preuzimanje u Žarkovu ili dostava po dogovoru.",
  provider,
  areaServed: beograd,
  url: abs("/poklon-aranzmani/"),
};

export const itemList = (name: string, items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path) })),
});
