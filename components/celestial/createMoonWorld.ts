import * as THREE from "three";
import { sampleCamera } from "./cameraPath";

export type WorldInput = { travel: number; turn: number; tilt: number; light: number; paused: boolean; reduced: boolean };
type Options = { input: { current: WorldInput }; onReady: () => void; onFailure: () => void };

const clamp = THREE.MathUtils.clamp;
const smooth = (x: number) => x * x * (3 - 2 * x);

export function createMoonWorld(host: HTMLDivElement, { input, onReady, onFailure }: Options) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.35 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .025, 100);
  const world = new THREE.Group();
  scene.add(world);
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  let disposed = false;
  let ready = false;
  let dirty = true;
  let frame = 0;
  let previous = 0;
  let rotation = 0;
  let displayedTurn = input.current.turn;
  let displayedTilt = input.current.tilt;
  let displayedLight = input.current.light;
  let lastSignature = "";
  let drag: { x: number; y: number; turn: number; tilt: number; id: number } | null = null;

  const moonGeometry = new THREE.SphereGeometry(1.4, 112, 80);
  geometries.push(moonGeometry);
  const moonMaterial = new THREE.MeshStandardMaterial({ color: "#e0e8ed", roughness: 1, metalness: 0, emissive: "#6b8aa5", emissiveIntensity: .07 });
  materials.push(moonMaterial);
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.rotation.set(.08, -Math.PI * .47, -.12);
  world.add(moon);

  const ambient = new THREE.AmbientLight("#a7c6e4", .32);
  scene.add(ambient);
  const key = new THREE.DirectionalLight("#ecf7ff", 2.35);
  key.position.set(-3, 3, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight("#6a9dcd", .8);
  rim.position.set(3, -.5, -2);
  scene.add(rim);

  // A thin view-dependent halo, not a postprocessing bloom pass.
  const haloGeometry = new THREE.SphereGeometry(1.407, 96, 64);
  const haloMaterial = new THREE.ShaderMaterial({
    vertexShader: "varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}",
    fragmentShader: "varying vec3 n; varying vec3 v; void main(){float f=pow(1.-abs(dot(normalize(n),normalize(v))),4.5);gl_FragColor=vec4(.39,.67,.94,f*.16);}",
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  geometries.push(haloGeometry); materials.push(haloMaterial);
  world.add(new THREE.Mesh(haloGeometry, haloMaterial));

  const rings = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const radius = 1.85 + i * .19;
    const points = Array.from({ length: 193 }, (_, j) => {
      const a = j / 192 * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: i === 1 ? "#c9bea0" : "#89abc9", transparent: true, opacity: i === 1 ? .18 : .1 });
    geometries.push(geometry); materials.push(material);
    const ring = new THREE.LineLoop(geometry, material);
    ring.rotation.set(i === 1 ? .18 : 1.07, .2 + i * .38, -.3 + i * .24);
    rings.add(ring);
  }
  world.add(rings);

  // Seeded points keep the authored sky stable across reloads.
  let seed = 816;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const positions = new Float32Array(950 * 3);
  const colors = new Float32Array(950 * 3);
  for (let i = 0; i < 950; i++) {
    positions.set([(random() - .5) * 60, (random() - .5) * 40, -6 - random() * 35], i * 3);
    const light = .25 + random() * .65;
    colors.set([light * .79, light * .89, light], i * 3);
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const starsMaterial = new THREE.PointsMaterial({ vertexColors: true, size: .029, sizeAttenuation: true, transparent: true, opacity: .9, depthWrite: false });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  geometries.push(starsGeometry); materials.push(starsMaterial); scene.add(stars);

  const loader = new THREE.TextureLoader();
  loader.load("/moon-color.jpg", map => {
    if (disposed) { map.dispose(); return; }
    textures.push(map); map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    moonMaterial.map = map; moonMaterial.emissiveMap = map; moonMaterial.needsUpdate = true;
    ready = true; dirty = true; onReady();
  }, undefined, onFailure);
  loader.load("/moon-height.jpg", map => {
    if (disposed) { map.dispose(); return; }
    textures.push(map); moonMaterial.bumpMap = map; moonMaterial.bumpScale = .018;
    moonMaterial.displacementMap = map; moonMaterial.displacementScale = .004; moonMaterial.displacementBias = -.002;
    moonMaterial.needsUpdate = true; dirty = true;
  });

  const resize = () => {
    const width = host.clientWidth, height = host.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 800 ? 1.35 : 1.75));
    renderer.setSize(width, height);
    camera.aspect = width / Math.max(height, 1);
    camera.fov = width < 800 ? 52 : 38;
    camera.updateProjectionMatrix(); dirty = true;
  };
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  const target = new THREE.Vector3();
  const position = new THREE.Vector3();
  const sampledPosition = [0, 0, 0], sampledTarget = [0, 0, 0];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hit = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(moon).length > 0;
  };
  const down = (event: PointerEvent) => {
    if (!ready || event.button !== 0 || !hit(event)) return;
    drag = { x: event.clientX, y: event.clientY, turn: input.current.turn, tilt: input.current.tilt, id: event.pointerId };
    host.setPointerCapture(event.pointerId); host.dataset.dragging = "true";
  };
  const move = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    input.current.turn = drag.turn + (event.clientX - drag.x) * .006;
    input.current.tilt = clamp(drag.tilt + (event.clientY - drag.y) * .003, -.55, .55);
    dirty = true;
  };
  const up = () => {
    if (drag && host.hasPointerCapture(drag.id)) host.releasePointerCapture(drag.id);
    drag = null; host.dataset.dragging = "false";
  };
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("lostpointercapture", up);
  const lost = (event: Event) => { event.preventDefault(); ready = false; onFailure(); };
  renderer.domElement.addEventListener("webglcontextlost", lost);

  const draw = (now: number) => {
    if (disposed) return;
    frame = requestAnimationFrame(draw);
    if (document.hidden) { previous = now; return; }
    if (!ready) { previous = now; return; }
    const state = input.current;
    const delta = Math.min((now - previous) / 1000, .04); previous = now;
    const signature = [state.travel, state.turn, state.tilt, state.light, state.paused, state.reduced].join(",");
    const animate = !state.paused && !state.reduced;
    const settling = Math.abs(displayedTurn-state.turn) + Math.abs(displayedTilt-state.tilt) + Math.abs(displayedLight-state.light) > .0001;
    if (!animate && !dirty && !settling && signature === lastSignature) return;
    lastSignature = signature; dirty = false;
    if (animate && !drag) rotation += delta * .006;
    const response = state.reduced ? 1 : 1 - Math.exp(-delta * (drag ? 22 : 10));
    displayedTurn += (state.turn-displayedTurn) * response;
    displayedTilt += (state.tilt-displayedTilt) * response;
    displayedLight += (state.light-displayedLight) * response;
    const travel = state.reduced ? 0 : clamp(state.travel, 0, 4.4);
    sampleCamera(travel, sampledPosition, sampledTarget);
    position.fromArray(sampledPosition); target.fromArray(sampledTarget);
    if (host.clientWidth < 800) { position.z += .65; target.x *= .3; }
    camera.position.copy(position); camera.lookAt(target);
    moon.rotation.y = -Math.PI * .47 + rotation + displayedTurn;
    moon.rotation.x = .08 + displayedTilt;
    rings.rotation.y = displayedTurn * .12 + travel * .06;
    const ringPresence = smooth(clamp(travel / .9, 0, 1)) * (1-smooth(clamp((travel-2.6)/.8,0,1)));
    rings.children.forEach((ring, i) => { ((ring as THREE.LineLoop).material as THREE.LineBasicMaterial).opacity = ringPresence * (i === 1 ? .13 : .07); });
    rings.visible = ringPresence > .001;
    const horizon = smooth(clamp((travel - 3.3) / .8, 0, 1));
    key.position.set(-6 + displayedLight * 7, 3.5 - horizon, THREE.MathUtils.lerp(2 + displayedLight * 4, -4, horizon));
    ambient.intensity = THREE.MathUtils.lerp(.32, .14, horizon);
    moonMaterial.emissiveIntensity = THREE.MathUtils.lerp(.07, .035, horizon);
    renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(draw);

  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect();
    host.removeEventListener("pointerdown", down); host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerup", up); host.removeEventListener("pointercancel", up); host.removeEventListener("lostpointercapture", up);
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
    renderer.dispose(); renderer.domElement.remove();
  };
}
