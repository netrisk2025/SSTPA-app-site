import { useEffect, useRef, useState } from "react";
import "./ParticleScene.css";

type Vec3 = readonly [number, number, number];
type Motif = "satellite" | "airliner" | "train" | "architecture" | "orbit" | "shield" | "flow" | "trace" | "document" | "compass" | "target" | "states";
type Mesh = { points: Float32Array; rotation: Vec3; label: string; detail: string };
const TAU = Math.PI * 2;
const PERIOD = 17;
const smooth = (a: number, b: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Authored geometry, sampled once. No model requests, random seeds, or video downloads. */
class PointModel {
  values: number[] = [];
  point(x: number, y: number, z: number) { this.values.push(x, y, z); }
  line(a: Vec3, b: Vec3, spacing = .035) {
    const n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) / spacing));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      this.point(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
    }
  }
  plane(a: Vec3, b: Vec3, c: Vec3, nu = 20, nv = 12) {
    for (let u = 0; u <= nu; u++) for (let v = 0; v <= nv; v++) {
      this.point(a[0] + (b[0] - a[0]) * u / nu + (c[0] - a[0]) * v / nv,
        a[1] + (b[1] - a[1]) * u / nu + (c[1] - a[1]) * v / nv,
        a[2] + (b[2] - a[2]) * u / nu + (c[2] - a[2]) * v / nv);
    }
  }
  triangle(a: Vec3, b: Vec3, c: Vec3, n = 20) {
    for (let u = 0; u <= n; u++) for (let v = 0; v <= n - u; v++) {
      this.point(a[0] + (b[0] - a[0]) * u / n + (c[0] - a[0]) * v / n,
        a[1] + (b[1] - a[1]) * u / n + (c[1] - a[1]) * v / n,
        a[2] + (b[2] - a[2]) * u / n + (c[2] - a[2]) * v / n);
    }
  }
  box(x: number, y: number, z: number, w: number, h: number, d: number, n = 10) {
    const a: Vec3 = [x - w / 2, y - h / 2, z - d / 2];
    const b: Vec3 = [x + w / 2, y - h / 2, z - d / 2];
    const c: Vec3 = [x - w / 2, y + h / 2, z - d / 2];
    this.plane(a, b, c, n, n);
    this.plane([a[0], a[1], z + d / 2], [b[0], b[1], z + d / 2], [c[0], c[1], z + d / 2], n, n);
    this.plane(a, c, [a[0], a[1], z + d / 2], n, n);
    this.plane(b, [b[0], y + h / 2, b[2]], [b[0], b[1], z + d / 2], n, n);
    this.plane(c, [b[0], c[1], c[2]], [c[0], c[1], z + d / 2], n, n);
    this.plane(a, b, [a[0], a[1], z + d / 2], n, n);
  }
  ellipsoid(x: number, y: number, z: number, rx: number, ry: number, rz: number, rows = 22, cols = 36) {
    for (let u = 1; u < rows; u++) {
      const phi = u / rows * Math.PI;
      for (let v = 0; v < cols; v++) {
        const theta = v / cols * TAU;
        this.point(x + rx * Math.cos(phi), y + ry * Math.sin(phi) * Math.cos(theta), z + rz * Math.sin(phi) * Math.sin(theta));
      }
    }
  }
  ring(x: number, y: number, z: number, rx: number, ry: number, tilt = 0, count = 150) {
    for (let i = 0; i < count; i++) {
      const t = i / count * TAU, py = Math.sin(t) * ry;
      this.point(x + Math.cos(t) * rx, y + py * Math.cos(tilt), z + py * Math.sin(tilt));
    }
  }
  finish(count: number) {
    // Coprime traversal decorrelates neighboring parts during the spiral reveal.
    const result = new Float32Array(count * 3);
    const total = this.values.length / 3;
    for (let i = 0; i < count; i++) {
      const index = Math.floor(((i * .618033988749895) % 1) * total) * 3;
      result[i * 3] = this.values[index];
      result[i * 3 + 1] = this.values[index + 1];
      result[i * 3 + 2] = this.values[index + 2];
    }
    return result;
  }
}

function authorMesh(motif: Motif, count: number): Mesh {
  const m = new PointModel();
  let rotation: Vec3 = [.2, -.25, -.08], label = "CONNECTED SYSTEM", detail = "An authored point-cloud study";
  if (motif === "satellite") {
    label = "ORBITAL SYSTEM"; detail = "Satellite · control, communication, consequence";
    rotation = [.32, -.4, -.28];
    m.box(0, 0, 0, .58, .72, .56, 16);
    for (const sign of [-1, 1]) {
      m.line([sign * .27, 0, 0], [sign * 1.78, 0, 0], .025);
      for (let panel = 0; panel < 3; panel++) {
        const x = sign * (.49 + panel * .43);
        m.plane([x, -.4, -.025], [x + sign * .38, -.4, -.025], [x, .4, -.025], 9, 19);
        m.line([x, -.4, -.025], [x, .4, -.025], .022);
        m.line([x, -.4, -.025], [x + sign * .38, -.4, -.025], .022);
        m.line([x, .4, -.025], [x + sign * .38, .4, -.025], .022);
      }
    }
    // Parabolic communications dish, with its feed and support arms.
    for (let r = 1; r <= 11; r++) for (let j = 0; j < r * 9; j++) {
      const a = j / (r * 9) * TAU, radius = r / 11 * .40;
      m.point(Math.cos(a) * radius, .52 + radius * radius * .9, Math.sin(a) * radius);
    }
    m.line([0, .38, 0], [0, 1.04, 0], .022);
    for (const x of [-.28, .28]) m.line([x, .59, 0], [0, 1.04, 0]);
    m.line([.1, -.36, .1], [.1, -.85, .1]);
    m.ring(.1, -.86, .1, .10, .10, Math.PI / 2, 30);
  } else if (motif === "airliner") {
    label = "AVIATION SYSTEM"; detail = "Airliner · people, software, physical systems";
    rotation = [.83, -.2, -.24];
    m.ellipsoid(0, 0, 0, 1.68, .15, .17, 65, 22);
    for (const side of [-1, 1]) {
      m.triangle([-.40, .005, side * .06], [.69, .025, side * 1.40], [.76, .018, side * .11], 32);
      m.line([-.40, .005, side * .06], [.69, .025, side * 1.40], .024);
      m.line([.69, .025, side * 1.40], [.76, .018, side * .11], .028);
      m.line([.69, .025, side * 1.40], [.72, .16, side * 1.44], .025);
      m.triangle([1.05, .055, side * .035], [1.60, .08, side * .60], [1.57, .05, side * .035], 18);
      m.ellipsoid(-.08, -.19, side * .51, .33, .095, .11, 17, 17);
      m.line([-.09, -.13, side * .51], [.18, .02, side * .51], .026);
      // Cabin windows are a separate, closely spaced dotted line.
      for (let x = -.98; x < 1.0; x += .075) m.point(x, .075, side * .145);
    }
    m.triangle([.85, .1, 0], [1.48, .64, 0], [1.6, .06, 0], 22);
    m.line([.85, .1, 0], [1.48, .64, 0], .024);
  } else if (motif === "train") {
    label = "TRANSPORT SYSTEM"; detail = "Rail · infrastructure, coordination, movement";
    rotation = [.31, -.48, -.05];
    for (let car = 0; car < 3; car++) {
      const x = -.81 + car * .96;
      m.box(x, .03, 0, .90, .48, .45, 11);
      m.plane([x - .45, .275, -.18], [x + .45, .275, -.18], [x - .45, .275, .18], 18, 8);
      for (const side of [-1, 1]) {
        for (let win = 0; win < 4; win++) {
          const wx = x - .34 + win * .18;
          m.line([wx, .17, side * .23], [wx + .11, .17, side * .23], .018);
          m.line([wx, .06, side * .23], [wx + .11, .06, side * .23], .018);
          m.line([wx, .06, side * .23], [wx, .17, side * .23], .018);
        }
        for (const wheel of [-.27, .27]) m.ring(x + wheel, -.27, side * .24, .105, .105, 0, 38);
        m.line([x - .45, -.08, side * .234], [x + .45, -.08, side * .234], .025);
      }
    }
    // Sloping cab makes the front unmistakably a high-speed train.
    m.plane([-1.69, -.20, -.225], [-1.69, -.20, .225], [-1.25, .275, -.225], 12, 15);
    m.triangle([-1.69, -.20, -.225], [-1.25, .275, -.225], [-1.25, -.20, -.225], 16);
    m.triangle([-1.69, -.20, .225], [-1.25, .275, .225], [-1.25, -.20, .225], 16);
    for (const side of [-1, 1]) m.line([-1.9, -.385, side * .26], [1.85, -.385, side * .26], .025);
    for (let x = -1.9; x < 1.85; x += .16) m.line([x, -.40, -.39], [x, -.40, .39], .055);
    m.line([.10, .28, 0], [.30, .61, 0]); m.line([.30, .61, 0], [.52, .28, 0]);
    m.line([.12, .61, 0], [.48, .61, 0]);
  } else if (motif === "architecture") {
    label = "SYSTEM ARCHITECTURE"; detail = "Structure · relationships · shared context";
    rotation = [.32, -.35, -.04];
    const nodes: Vec3[] = [[0, .85, 0], [-1.03, -.05, 0], [0, -.05, 0], [1.03, -.05, 0], [-1.03, -.8, .2], [0, -.8, .2], [1.03, -.8, .2]];
    for (const [x, y, z] of nodes) m.box(x, y, z, .42, .36, .3, 8);
    for (let i = 1; i <= 3; i++) {
      m.line([0, .67, 0], [0, .43, 0], .014);
      m.line([0, .43, 0], [nodes[i][0], .43, 0], .014);
      m.line([nodes[i][0], .43, 0], [nodes[i][0], .13, 0], .014);
      m.line([nodes[i][0], -.23, 0], [nodes[i + 3][0], -.62, .2], .014);
    }
  } else if (motif === "shield") {
    label = "SYSTEM CONSTRAINTS"; detail = "Protection through a whole-system view";
    rotation = [.08, -.3, -.03];
    for (let row = 0; row <= 42; row++) {
      const y = 1.0 - row / 42 * 2.12;
      const width = y > .1 ? .91 : .91 * Math.sqrt(Math.max(0, (y + 1.12) / 1.22));
      for (let col = -24; col <= 24; col++) {
        const x = col / 24 * width;
        m.point(x, y + .15 * Math.abs(x), .16 * (1 - x * x));
      }
      m.point(-width, y + .15 * width, .16 * (1 - width * width));
      m.point(width, y + .15 * width, .16 * (1 - width * width));
    }
    m.line([-.48, 0, .24], [-.12, -.34, .24], .012);
    m.line([-.12, -.34, .24], [.53, .46, .24], .012);
  } else if (motif === "document") {
    label = "SYSTEM KNOWLEDGE"; detail = "Evidence · requirements · understanding";
    rotation = [.12, -.32, -.12];
    for (let sheet = 0; sheet < 3; sheet++) {
      const z = -.15 + sheet * .16, offset = sheet * .1;
      m.box(offset, -offset, z, 1.34, 1.76, .012, 10);
      for (let row = 0; row < 8; row++) m.line([-.48 + offset, .57 - row * .16 - offset, z + .025], [.45 + offset - (row % 3) * .11, .57 - row * .16 - offset, z + .025], .025);
    }
  } else if (motif === "flow" || motif === "trace") {
    label = motif === "flow" ? "SYSTEM FLOW" : "SYSTEM TRACEABILITY";
    detail = "Follow the relationships that shape behavior";
    rotation = [.3, -.12, -.08];
    for (let path = 0; path < 4; path++) {
      for (let i = 0; i <= 240; i++) {
        const t = i / 240, a = t * TAU * 1.2 + path * Math.PI / 2;
        const x = -1.45 + t * 2.9, y = Math.sin(a) * .65, z = Math.cos(a) * .38;
        m.point(x, y, z); m.point(x, y + .022, z);
        if (i % 80 === 0) m.ellipsoid(x, y, z, .12, .12, .12, 6, 12);
      }
    }
  } else if (motif === "compass") {
    label = "SYSTEM NAVIGATION"; detail = "Find your place in the whole system";
    rotation = [.17, -.13, -.03];
    for (const r of [.92, 1.02, 1.12]) m.ring(0, 0, 0, r, r, 0, 210);
    for (let i = 0; i < 60; i++) {
      const a = i / 60 * TAU, inner = i % 5 === 0 ? .81 : .87;
      m.line([Math.cos(a) * inner, Math.sin(a) * inner, 0], [Math.cos(a) * .94, Math.sin(a) * .94, 0], .02);
    }
    m.triangle([-.20, -.18, .05], [.2, .18, .05], [.62, .8, .05], 24);
    m.triangle([-.20, -.18, .05], [.2, .18, .05], [-.62, -.8, .05], 24);
    m.ellipsoid(0, 0, .10, .08, .08, .06, 8, 16);
  } else if (motif === "target") {
    label = "SYSTEM CONSEQUENCES"; detail = "Understand exposure. Define the objective.";
    rotation = [.24, -.28, -.02];
    for (const r of [.18, .43, .69, .97]) for (const z of [-.045, 0, .045]) m.ring(0, 0, z, r, r, 0, 170);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      m.line([Math.cos(a) * .83, Math.sin(a) * .83, .07], [Math.cos(a) * 1.25, Math.sin(a) * 1.25, .07], .016);
    }
    m.ellipsoid(0, 0, .05, .11, .11, .11, 10, 22);
  } else if (motif === "states") {
    label = "SYSTEM BEHAVIOR"; detail = "States · transitions · intended operation";
    rotation = [.24, -.24, -.06];
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * TAU + Math.PI / 2, b = (i + 1) / 5 * TAU + Math.PI / 2;
      const x = Math.cos(a) * .95, y = Math.sin(a) * .95;
      m.ellipsoid(x, y, 0, .24, .24, .24, 12, 22);
      m.line([x, y, 0], [Math.cos(b) * .95, Math.sin(b) * .95, 0], .021);
      m.line([x, y, 0], [0, 0, .18], .028);
    }
    m.ellipsoid(0, 0, .18, .2, .2, .2, 12, 22);
  } else {
    label = "SYSTEM CONTEXT"; detail = "Every element exists in relationship";
    rotation = [.25, -.22, -.1];
    m.ellipsoid(0, 0, 0, .48, .48, .48, 24, 36);
    for (let ring = 0; ring < 3; ring++) {
      const tilt = ring / 3 * Math.PI;
      for (const radius of [1.0, 1.025]) m.ring(0, 0, 0, radius, radius, tilt, 240);
      const a = ring * 2.1 + .4;
      m.ellipsoid(Math.cos(a), Math.sin(a) * Math.cos(tilt), Math.sin(a) * Math.sin(tilt), .1, .1, .1, 9, 16);
    }
  }
  return { points: m.finish(count), rotation, label, detail };
}

const TOOL_MOTIFS: Record<string, Motif> = {
  satellite: "satellite", airliner: "airliner", train: "train",
  workspace: "architecture", admin: "architecture", installation: "architecture", administration: "architecture",
  navigator: "compass", requirements: "document", reports: "document", reference: "document",
  state: "states", flow: "flow", assets: "satellite", context: "orbit", trace: "trace",
  loss: "target", goalkeeper: "target", usecase: "states", connection: "flow",
  messagecenter: "orbit", attack: "target", controls: "shield", methodology: "orbit", tools: "architecture",
};

export default function ParticleScene({ kind = "home", compact = false }: { kind?: string; compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const wakeRef = useRef<(() => void) | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sceneLabel, setSceneLabel] = useState("ORBITAL SYSTEM");
  const [sceneNumber, setSceneNumber] = useState(1);
  const home = kind === "home";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;
    const count = compact ? 1900 : 3300;
    const motifs: Motif[] = home ? ["satellite", "airliner", "train"] : [TOOL_MOTIFS[kind] || "orbit"];
    const meshes = motifs.map((motif) => authorMesh(motif, count));
    const positions = new Float32Array(count * 2);
    const next = new Int32Array(count);
    const heads = new Int32Array(12);
    const phases = new Float32Array(count);
    const radii = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      phases[i] = i * 2.399963229728653;
      radii[i] = 1.1 + ((i * 131) % 997) / 997 * 1.15;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reduce.matches;
    let width = 1, height = 1, frame = 0, last = 0, elapsed = 2.0, disposed = false, inView = true, currentMesh = -1;
    let glow: CanvasGradient | null = null;

    const paint = () => {
      const time = reduced ? 6 : elapsed;
      const meshIndex = Math.floor(time / PERIOD) % meshes.length;
      const mesh = meshes[meshIndex];
      if (meshIndex !== currentMesh) {
        currentMesh = meshIndex;
        setSceneLabel(mesh.label); setSceneNumber(meshIndex + 1);
        canvas.setAttribute("aria-label", mesh.detail);
      }
      const local = time % PERIOD;
      const spread = 1 - smooth(.1, 3.1, local) + smooth(12.1, 16.6, local);
      const assembly = 1 - spread;
      const scale = Math.min(width / (compact ? 4.7 : 4.65), height / 3.85);
      const cx = width * .5, cy = height * .47;
      const rx = mesh.rotation[0] + Math.sin(time * .17) * .065;
      const ry = mesh.rotation[1] + Math.sin(time * .12) * .14;
      const rz = mesh.rotation[2] + Math.sin(time * .13) * .025;
      const sx = Math.sin(rx), cosx = Math.cos(rx), sy = Math.sin(ry), cosy = Math.cos(ry), sz = Math.sin(rz), cosz = Math.cos(rz);
      ctx.clearRect(0, 0, width, height);
      if (glow) { ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height); }

      // Sparse, long whiplash curves echo Art Nouveau linework in a digital medium.
      ctx.fillStyle = "#e7e9df";
      for (let ribbon = 0; ribbon < 3; ribbon++) {
        ctx.globalAlpha = .10 + ribbon * .025;
        ctx.beginPath();
        for (let j = 0; j < 95; j++) {
          const t = j / 94, a = -.9 + t * 4.8 + ribbon * 2.0 + time * .025;
          const r = 1.64 + t * .34 + ribbon * .045;
          const x = Math.cos(a) * r, y = Math.sin(a) * r * .57;
          const px = cx + (x * .94 - y * .32) * scale;
          const py = cy + (x * .19 + y * .87) * scale;
          const dot = (j % 13 === 0 ? 1.0 : .48) * Math.min(1, width / 600 + .3);
          ctx.moveTo(px + dot, py); ctx.arc(px, py, dot, 0, TAU);
        }
        ctx.fill();
      }
      heads.fill(-1);
      for (let i = 0; i < count; i++) {
        const p = i * 3;
        const a = phases[i] + time * .17 + spread * (2.6 + (i % 7) * .16);
        const orbitX = Math.cos(a) * radii[i];
        const orbitY = Math.sin(a) * radii[i] * .63;
        const orbitZ = Math.sin(phases[i] * .71 + time * .11) * .64;
        let x = mesh.points[p] * assembly + orbitX * spread;
        let y = mesh.points[p + 1] * assembly + orbitY * spread;
        let z = mesh.points[p + 2] * assembly + orbitZ * spread;
        const x1 = x * cosy + z * sy, z1 = -x * sy + z * cosy;
        const y1 = y * cosx - z1 * sx;
        z = y * sx + z1 * cosx;
        x = x1 * cosz - y1 * sz; y = x1 * sz + y1 * cosz;
        const perspective = 5.5 / (5.5 - z);
        positions[i * 2] = cx + x * scale * perspective;
        positions[i * 2 + 1] = cy - y * scale * perspective;
        const bucket = Math.min(11, Math.max(0, Math.floor((z + 1.6) * 3.3 + ((i * 17) % 5) * .33)));
        next[i] = heads[bucket]; heads[bucket] = i;
      }
      const dotScale = Math.min(1.15, Math.max(.74, width / 800));
      for (let bucket = 0; bucket < 12; bucket++) {
        const radius = (.67 + bucket * .071) * dotScale;
        ctx.globalAlpha = (.17 + bucket * .065) * (1 - spread * .54);
        ctx.beginPath();
        for (let i = heads[bucket]; i !== -1; i = next[i]) {
          const x = positions[i * 2], y = positions[i * 2 + 1];
          ctx.moveTo(x + radius, y); ctx.arc(x, y, radius, 0, TAU);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const canRun = () => !disposed && inView && !document.hidden && !pausedRef.current && !reduced;
    const tick = (now: number) => {
      frame = 0;
      if (!canRun()) { last = 0; return; }
      // Only active playback time advances the choreography. Pausing never changes phase.
      if (last) elapsed += Math.min((now - last) / 1000, .05);
      last = now; paint(); frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0; last = 0;
      if (canRun()) frame = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      glow = ctx.createRadialGradient(width * .50, height * .47, 0, width * .5, height * .47, Math.min(width, height) * .49);
      glow.addColorStop(0, "rgba(202,211,183,.037)"); glow.addColorStop(1, "rgba(202,211,183,0)");
      paint();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; wake(); }, { threshold: .01 });
    intersectionObserver.observe(canvas);
    const motionChange = (event: MediaQueryListEvent) => { reduced = event.matches; setReducedMotion(reduced); paint(); wake(); };
    setReducedMotion(reduced);
    reduce.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", wake);
    resize(); wake();
    return () => {
      disposed = true; cancelAnimationFrame(frame); wakeRef.current = null;
      resizeObserver.disconnect(); intersectionObserver.disconnect();
      reduce.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [kind, compact, home]);

  const toggle = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    wakeRef.current?.();
  };

  return (
    <div className={`particle-scene${compact ? " particle-scene--compact" : ""}`}>
      <canvas ref={canvasRef} className="particle-scene__canvas" role="img" aria-label="A sculptural system made from white points of light" />
      <div className="particle-scene__caption" aria-hidden="true">
        <span className="particle-scene__index">{String(sceneNumber).padStart(2, "0")}<span> / {home ? "03" : "01"}</span></span>
        <span>{sceneLabel}</span>
      </div>
      {reducedMotion ? <span className="particle-scene__still">Still study</span> : (
        <button type="button" className="particle-scene__toggle" onClick={toggle} aria-label={paused ? "Resume system animation" : "Pause system animation"} aria-pressed={paused}>
          <span className={`particle-scene__toggle-icon${paused ? " is-paused" : ""}`} aria-hidden="true" />
          {paused ? "Resume" : "Pause"}
        </button>
      )}
    </div>
  );
}
