import type { ImageMetadata } from "astro";

const files = import.meta.glob<{ default: ImageMetadata }>("../assets/buketi/*/*.jpg", { eager: true });

function photo(folder: string, shot: string): ImageMetadata {
  const file = files[`../assets/buketi/${folder}/dsc_${shot}.jpg`];
  if (!file) throw new Error(`Nema fotografije ${folder}/dsc_${shot}.jpg — pokreni "npm run images".`);
  return file.default;
}

export interface Bouquet {
  id: string;
  title: string;
  vessel: string;
  flowers: string;
  /** Near-duplicate shots are left out on purpose. */
  photos: ImageMetadata[];
}

function bouquet(n: number, vessel: string, flowers: string, shots: string[]): Bouquet {
  const folder = `buket-${String(n).padStart(2, "0")}`;
  return { id: folder, title: `Unikat Nº ${n}`, vessel, flowers, photos: shots.map((s) => photo(folder, s)) };
}

// Flower names are identified from the photos; Ceca should confirm them.
// photos[0] is the studio shot (white linen, wooden stump), photos[1] the close-up used as the gallery cover.
export const bouquets: Bouquet[] = [
  bouquet(5, "U beloj vazi", "Eustoma, astre, suncokret, zeleni karanfil, sedum", ["7487", "7486", "7495", "7490", "7492", "7494"]),
  bouquet(7, "U drvenoj posudi", "Suncokret, eustoma, gladiole, zevalice, voštani cvet", ["7546", "7532", "7536", "7547", "7543", "7544", "7548", "7549"]),
  bouquet(6, "U keramičkoj vazi", "Zevalice, eustoma, karanfili, hrizanteme, sedum", ["7528", "7523", "7520", "7524", "7525", "7527", "7529", "7530", "7531"]),
  bouquet(11, "U šolji za kafu", "Alstremerije, eustoma, ukrasni luk, protea, eukaliptus", ["7579", "7586", "7588", "7576", "7577", "7582", "7583", "7587", "7591", "7597"]),
  bouquet(3, "U kutiji od kore drveta", "Eustoma, ukrasni luk, skabioza, voštani cvet, sedum", ["7462", "7466", "7467", "7469", "7472", "7473", "7474"]),
  bouquet(2, "U pletenoj činiji", "Protea, voštani cvet, eukaliptus, divlje trave", ["7456", "7460", "7614", "7610", "7459", "7461"]),
  bouquet(8, "U zelenoj vazi", "Protea, skabioza, eustoma, gladiole, sedum", ["7550", "7553", "7552", "7554", "7555", "7556", "7557", "7451"]),
  bouquet(1, "U crvenoj saksiji", "Suncokret, eustoma, zevalice, alstremerije, asparagus", ["7448", "7453", "7454", "7442", "7444", "7455"]),
  bouquet(9, "U korpi od jute", "Protea, eustoma, skabioza, karanfili, zeleni karanfil", ["7541", "7533", "7535", "7537", "7538"]),
  bouquet(10, "U keramičkoj saksiji", "Ukrasni luk, suncokret, eustoma, skabioza, kamilica", ["7562", "7564", "7558", "7559", "7563", "7565"]),
  bouquet(4, "U korpi od jute", "Eustoma, skabioza, voštani cvet, sedum", ["7478", "7479", "7476", "7480", "7481", "7484"]),
];
