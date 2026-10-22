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

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof scroll>[1]>["offset"]>;
/** Runs render(p) for a scroll range, trailing the scroll position by a few frames so notched mouse wheels glide instead of jumping. */
function smoothed(target: Element, offset: ScrollOffset, render: (p: number) => void) {
  let goal = 0;
  let shown = 0;
  let frameId = 0;
  const step = () => {
    shown += (goal - shown) * 0.14;
    if (Math.abs(goal - shown) < 0.0005) shown = goal;
    render(shown);
    frameId = shown === goal ? 0 : requestAnimationFrame(step);
  };
  scroll(
    (p: number) => {
      goal = p;
      if (!frameId) frameId = requestAnimationFrame(step);
    },
    { target, offset },
  );
}

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

// ── Signature underlines grow once the word is well inside the screen. ──
inView("[data-scribble]", (el) => el.classList.add("is-drawn"), { amount: 1, margin: "0px 0px -15% 0px" });

// ── Reveals: only headings and photographs move; body copy, cards and buttons stay still. ──
// Headings settle in from a few pixels below; photos settle into their frames, as if placed there.
inView(
  "[data-reveal]",
  (el) => {
    const node = el as HTMLElement;
    if (reduce) {
      node.style.opacity = "1";
      return;
    }
    if (node.dataset.reveal === "photo") {
      animate(node, { opacity: [0, 1], scale: [0.97, 1], y: [28, 0] }, { duration: 1.4, ease });
    } else {
      animate(node, { opacity: [0, 1], y: [14, 0] }, { duration: 1, ease });
    }
  },
  { amount: 0.25 },
);


if (!reduce) {
  // ── Hero row: as the page moves down, the row drifts left by itself and brings the next bouquets in.
  //    It moves the real scroll position, so it adds up with swiping and the arrow buttons. ──
  const hero = document.querySelector<HTMLElement>("#top");
  const heroRow = document.querySelector<HTMLElement>("[data-track-row]");
  if (hero && heroRow) {
    let applied = 0;
    // Full drift is reached when the hero is half scrolled away: roughly one bouquet per two or three wheel notches.
    smoothed(hero, ["start start", "center start"], (p) => {
      const drift = p * Math.min(900, heroRow.clientWidth * 0.62 + 120);
      heroRow.scrollLeft += drift - applied;
      applied = drift;
    });
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
      [0.26, 0.32, 0.44, 0.5],
      [0.52, 0.58, 0.68, 0.74],
      [0.78, 0.84, 2, 2],
    ];

    const render = (p: number) => {
      const vw = innerWidth;
      const vh = innerHeight;
      const open = smooth(seg(p, 0.04, 0.34));
      const cardH = Math.min(vh * 0.6, 620);
      const cardW = Math.min(vw * 0.84, cardH * (2 / 3));
      frame.style.width = `${lerp(cardW, vw, open)}px`;
      frame.style.height = `${lerp(cardH, vh, open)}px`;
      frame.style.borderRadius = `${lerp(28, 0, open)}px`;
      frame.style.transform = `translate(-50%, calc(-50% + ${lerp(vh * 0.09, 0, open)}px)) rotate(${lerp(-2.5, 0, open)}deg)`;
      scrim.style.opacity = String(open);

      const t = seg(p, 0.03, 0.16);
      title.style.opacity = String(1 - t);
      title.style.transform = `translateY(${-t * 60}px)`;

      layers[0].style.transform = `scale(${lerp(1, 1.08, seg(p, 0.06, 0.5))})`;
      layers[1].style.opacity = String(seg(p, 0.42, 0.52));
      layers[1].style.transform = `scale(${lerp(1.1, 1, seg(p, 0.42, 0.78))})`;
      layers[2].style.opacity = String(seg(p, 0.68, 0.78));
      layers[2].style.transform = `scale(${lerp(1.14, 1, seg(p, 0.68, 1))})`;

      caps.forEach((cap, i) => {
        const [a, b, c, d] = capTimes[i];
        const inn = seg(p, a, b);
        const out = seg(p, c, d);
        cap.style.opacity = String(inn * (1 - out));
        cap.style.transform = `translateY(${(1 - inn) * 30 - out * 30}px)`;
      });
    };

    smoothed(scene, ["start start", "end end"], render);
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

  // ── The small gift photo floats a little faster than the big one behind it. ──
  for (const card of document.querySelectorAll<HTMLElement>(".drift-card")) {
    scroll(animate(card, { y: [48, -36] }, { ease: "linear" }), { target: card.parentElement!, offset: ["start end", "end start"] });
  }

  // ── Parallax: photos marked [data-parallax] glide inside their rounded frames. ──
  for (const img of document.querySelectorAll<HTMLElement>("[data-parallax]")) {
    scroll(animate(img, { y: ["-4%", "4%"] }, { ease: "linear" }), { target: img.parentElement!, offset: ["start end", "end start"] });
  }
} else {
  document.querySelectorAll("[data-words] > span, [data-bloom]").forEach((w) => w.classList.add("on", "is-open"));
  document.querySelectorAll<HTMLElement>(".closer-layer, [data-closer-cap]").forEach((el) => (el.style.opacity = "1"));
}
