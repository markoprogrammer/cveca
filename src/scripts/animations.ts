// Every scroll-driven and on-view animation on the page. Motion's scroll() uses native
// scroll timelines where the browser has them and a rAF fallback elsewhere, so this runs everywhere.
import { animate, inView, scroll } from "motion";

const ease = [0.16, 1, 0.3, 1] as const;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Progress of p between a and b, clamped to 0..1. */
const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Ease-in-out for scrubbed values, so motion settles instead of stopping dead. */
const smooth = (t: number) => t * t * (3 - 2 * t);

// ── Deferred images (LazyImg): fetch only when they can no longer slow down the first paint. ──
function fill(img: HTMLImageElement) {
  if (!img.dataset.src) return;
  img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
  img.srcset = img.dataset.srcset ?? "";
  img.src = img.dataset.src;
  delete img.dataset.src;
}
// Nothing deferred starts before the window load event, so the hero photo and the font get the whole connection.
const deferred = [...document.querySelectorAll<HTMLImageElement>("img[data-defer]")];
const afterLoad = () => {
  deferred.filter((img) => img.dataset.defer === "load").forEach(fill);
  for (const img of deferred.filter((i) => i.dataset.defer === "view")) {
    // The pinned scene's layers sit inside a 100vh stage; watch the scene itself so all three arrive together.
    const watch = img.closest<HTMLElement>("[data-closer]") ?? img;
    inView(watch, () => fill(img), { margin: "100% 0px 100% 0px" });
  }
};
if (document.readyState === "complete") afterLoad();
else addEventListener("load", afterLoad, { once: true });

// ── Reveals: [data-reveal] fades up the first time it enters; siblings inside [data-stagger] cascade. ──
inView(
  "[data-reveal]",
  (el) => {
    const group = el.closest("[data-stagger]");
    const index = group ? [...group.querySelectorAll(":scope > [data-reveal], :scope > * > [data-reveal]")].indexOf(el) : 0;
    if (reduce) {
      (el as HTMLElement).style.opacity = "1";
      return;
    }
    // Opacity and transform only: both stay on the compositor, so reveals never stutter on phones.
    animate(el, { opacity: [0, 1], y: [40, 0] }, { duration: 1.1, delay: Math.max(0, index) * 0.09, ease });
  },
  { amount: 0.15 },
);

// ── Hand-drawn underlines draw themselves once the word is well inside the screen. ──
inView("[data-scribble]", (el) => el.classList.add("is-drawn"), { amount: 1, margin: "0px 0px -15% 0px" });

if (!reduce) {
  // ── Hero: the lockup lifts away and the lineup drifts sideways as the page starts to move. ──
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const copy = document.querySelector<HTMLElement>("[data-hero-copy]");
  const row = document.querySelector<HTMLElement>("[data-lineup]");
  if (hero && copy && row) {
    // Start with the middle of the row under the middle of the screen, then drift left.
    const start = () => (innerWidth - row.scrollWidth) / 2;
    const drift = () => Math.min(row.scrollWidth * 0.22, 420);
    scroll(
      (p: number) => {
        row.style.transform = `translate3d(${start() - p * drift()}px,0,0)`;
        copy.style.opacity = String(1 - seg(p, 0.05, 0.55));
        copy.style.transform = `translate3d(0,${-p * 80}px,0) scale(${1 - p * 0.06})`;
      },
      { target: hero, offset: ["start start", "end start"] },
    );
  }

  // ── "Pogledajte izbliza": a card opens to full screen, then the camera walks in to the petals. ──
  const scene = document.querySelector<HTMLElement>("[data-closer]");
  if (scene) {
    const frame = scene.querySelector<HTMLElement>("[data-closer-frame]")!;
    const title = scene.querySelector<HTMLElement>("[data-closer-title]")!;
    const scrim = scene.querySelector<HTMLElement>("[data-closer-scrim]")!;
    const layers = [...scene.querySelectorAll<HTMLElement>(".closer-layer")];
    const caps = [...scene.querySelectorAll<HTMLElement>("[data-closer-cap]")];
    // [fade in from, fully in, start out, gone]; the last caption stays.
    const capTimes = [
      [0.3, 0.36, 0.48, 0.54],
      [0.56, 0.62, 0.74, 0.8],
      [0.82, 0.88, 2, 2],
    ];

    scroll(
      (p: number) => {
        const vw = innerWidth;
        const vh = innerHeight;
        const open = smooth(seg(p, 0.08, 0.4));
        const cardH = Math.min(vh * 0.6, 620);
        const cardW = Math.min(vw * 0.84, cardH * (2 / 3));
        frame.style.width = `${lerp(cardW, vw, open)}px`;
        frame.style.height = `${lerp(cardH, vh, open)}px`;
        frame.style.borderRadius = `${lerp(28, 0, open)}px`;
        frame.style.transform = `translate(-50%, calc(-50% + ${lerp(vh * 0.09, 0, open)}px))`;
        scrim.style.opacity = String(open);

        const t = seg(p, 0.06, 0.22);
        title.style.opacity = String(1 - t);
        title.style.transform = `translateY(${-t * 60}px)`;

        layers[0].style.transform = `scale(${lerp(1, 1.08, seg(p, 0.1, 0.56))})`;
        layers[1].style.opacity = String(seg(p, 0.46, 0.56));
        layers[1].style.transform = `scale(${lerp(1.1, 1, seg(p, 0.46, 0.82))})`;
        layers[2].style.opacity = String(seg(p, 0.72, 0.82));
        layers[2].style.transform = `scale(${lerp(1.14, 1, seg(p, 0.72, 1))})`;

        caps.forEach((cap, i) => {
          const [a, b, c, d] = capTimes[i];
          const inn = seg(p, a, b);
          const out = seg(p, c, d);
          cap.style.opacity = String(inn * (1 - out));
          cap.style.transform = `translateY(${(1 - inn) * 30 - out * 30}px)`;
        });
      },
      { target: scene, offset: ["start start", "end end"] },
    );
  }

  // ── Story: words go from grey to ink as they are read, a stem grows beside them,
  //    and the flower opens on the last sentence ("Ispalo je sjajno."). ──
  for (const story of document.querySelectorAll<HTMLElement>("[data-story]")) {
    const words = [...story.querySelectorAll("[data-words] > span")];
    const stem = [...story.querySelectorAll<SVGPathElement>(".stem path")];
    const bloom = story.querySelector("[data-bloom]");
    scroll(
      (p: number) => {
        const lit = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle("on", i < lit));
        // Main stem follows the reading; each leaf unfurls once the stem has passed it.
        stem.forEach((path, i) => {
          const at = i === 0 ? p : seg(p, i * 0.25, i * 0.25 + 0.15);
          path.style.strokeDashoffset = String(1 - at);
        });
        bloom?.classList.toggle("is-open", p > 0.97);
      },
      { target: story, offset: ["start 0.8", "end 0.5"] },
    );
  }

  // ── Parallax: photos marked [data-parallax] glide inside their rounded frames. ──
  for (const img of document.querySelectorAll<HTMLElement>("[data-parallax]")) {
    scroll(animate(img, { y: ["-6%", "6%"] }, { ease: "linear" }), { target: img.parentElement!, offset: ["start end", "end start"] });
  }
} else {
  document.querySelectorAll("[data-words] > span, [data-bloom]").forEach((w) => w.classList.add("on", "is-open"));
  document.querySelectorAll<HTMLElement>(".closer-layer, [data-closer-cap]").forEach((el) => (el.style.opacity = "1"));
}
