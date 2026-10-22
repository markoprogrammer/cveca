// Ways to write to Ceca, always in this order: Viber, SMS, WhatsApp, email.
// Viber and WhatsApp marks come from Simple Icons (CC0) in their brand colours;
// SMS and email are Material Icons (Apache 2.0) in the site's violet.
import { siInstagram, siViber, siWhatsapp } from "simple-icons";
import { CONTACT } from "./site";

export interface Channel {
  id: "viber" | "sms" | "whatsapp" | "mail";
  label: string;
  href: string;
  color: string;
  path: string;
  external?: boolean;
}

export const CHANNELS: Channel[] = [
  { id: "viber", label: "Viber", href: CONTACT.viber, color: `#${siViber.hex}`, path: siViber.path },
  {
    id: "sms",
    label: "SMS",
    href: CONTACT.sms,
    color: "var(--color-sage)",
    path: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z",
  },
  { id: "whatsapp", label: "WhatsApp", href: CONTACT.whatsapp, color: `#${siWhatsapp.hex}`, path: siWhatsapp.path, external: true },
  {
    id: "mail",
    label: "Mejl",
    href: `mailto:${CONTACT.email}?subject=${encodeURIComponent("Upit sa sajta")}`,
    color: "var(--color-sage)",
    path: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z",
  },
];

// Instagram direct message, after the four. It cannot take a pre-filled text, so the inquiry script copies
// the composed message first and the visitor pastes it.
export const INSTAGRAM = { href: CONTACT.instagramDm, label: CONTACT.instagramHandle, color: `#${siInstagram.hex}`, path: siInstagram.path };
