import './style.css'
import * as THREE from 'three'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { initCursor } from './cursor.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

let fboMouse = new THREE.Vector3(0, 0, 0)
let pointerScreen = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2)

const projects = [
  { image: '/image.jpg',   url: '#' },
  { image: '/image2.jpg',  url: '#' },
]

const app = document.querySelector('#app')

// [FEATURE ADDED]: Injected Lightbox CSS and DOM structure directly into the template
app.innerHTML = `
<style>
  .lightbox {
    position: fixed; inset: 0; z-index: 99999;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none; visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  .lightbox.is-active { opacity: 1; pointer-events: auto; visibility: visible; }
  .lightbox__backdrop {
    position: absolute; inset: 0; background: rgba(2, 6, 23, 0.95); 
    backdrop-filter: blur(10px); cursor: pointer;
  }
  .lightbox__content { position: relative; z-index: 1; max-width: 90vw; max-height: 90vh; }
  .lightbox__image {
    max-width: 100%; max-height: 85vh; object-fit: contain;
    border-radius: 8px; box-shadow: 0 24px 48px rgba(0,0,0,0.5);
  }
  .lightbox__close {
    position: absolute; top: -40px; right: 0; background: transparent; 
    border: none; color: #fff; font-size: 2rem; cursor: pointer; padding: 0.5rem; line-height: 1;
  }
</style>

<div class="preloader">
  <div class="preloader__count">0%</div>
  <div class="preloader__bar"></div>
</div>

<header class="site-header">
  <div class="site-header__inner">
    <a href="#top" class="site-header__logo">PS</a>
    <nav class="site-header__nav" aria-label="Primary navigation">
      <button class="site-header__link" type="button" data-scroll-target="#about">About</button>
      <button class="site-header__link" type="button" data-scroll-target="#skills">Skills</button>
      <button class="site-header__link" type="button" data-scroll-target="#projects">Projects</button>
      <button class="site-header__link" type="button" data-scroll-target="#contact">Contact</button>
    </nav>
  </div>
</header>

<main class="page" id="top">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__content">
      <p class="hero__eyebrow">Computer Science Student</p>
      <h1 id="hero-title" class="hero__title">Pidugu Shivaram, building the web.</h1>
      <p class="hero__subtitle">
        Motivated B.Tech CSE student with a strong foundation in C, HTML, CSS, and SQL. Eager to contribute to web development and software projects while growing fast.
      </p>
    </div>
  </section>

  <section class="about" id="about" aria-labelledby="about-title">
    <h2 id="about-title" class="section-label">About</h2>
    <div class="about__content">
      <h3 class="about__headline">Motivated problem-solver seeking to apply technical skills in real-world projects.</h3>
      <p class="about__body">
        I'm a 2nd-year B.Tech Computer Science Engineering student at Ku College of Engineering and Technology, Peddapalli, Telangana. I have a strong foundation in C programming, web technologies (HTML & CSS), and SQL databases. I'm eager to grow, learn fast, and deliver meaningful contributions in web development or software-related roles.
      </p>
    </div>
  </section>

  <section class="skills" id="skills" aria-labelledby="skills-title">
    <h2 id="skills-title" class="section-label">Skills</h2>
    <div class="skills__grid">
      <article class="skills__card"><h3 class="skills__title">Programming Languages</h3><p class="skills__meta">C</p></article>
      <article class="skills__card"><h3 class="skills__title">Web Technologies</h3><p class="skills__meta">HTML · CSS</p></article>
      <article class="skills__card"><h3 class="skills__title">Database</h3><p class="skills__meta">SQL</p></article>
      <article class="skills__card"><h3 class="skills__title">Tools & Platforms</h3><p class="skills__meta">VS Code · Git · GitHub · Microsoft Excel</p></article>
    </div>
  </section>

  <section class="experience" aria-labelledby="experience-title">
    <h2 id="experience-title" class="section-label">Education</h2>
    <ul class="experience__list">
      <li class="experience__item">
        <span class="experience__label">B.Tech in Computer Science Engineering</span>
        <span class="experience__meta">Ku College of Engineering & Technology · Currently 2nd Year · 2023–2027</span>
      </li>
    </ul>
  </section>

  <section class="projects" id="projects" aria-labelledby="projects-title">
    <header class="projects__header">
      <h2 id="projects-title" class="section-label">Selected projects</h2>
      <p class="projects__subtitle">A selection of recent work spanning AI products, creative engineering, and full-stack platforms.</p>
    </header>
    <div class="projects__grid">
      ${projects.map(p => `
        <div class="project-card" data-url="${p.url}" style="cursor: pointer;">
          <div class="image-placeholder" data-image="${p.image}"></div>
        </div>
      `).join('')}
    </div>
  </section>

  <section class="contact" id="contact" aria-labelledby="contact-title">
    <div class="contact__inner">
      <div class="contact__copy">
        <h2 id="contact-title" class="section-label">Contact</h2>
        <p class="contact__headline">Let's collaborate on something meaningful.</p>
        <p class="contact__body">Whether you're exploring an idea, looking for an internship opportunity, or curious about my work — feel free to reach out. Based in Peddapalli, Telangana · +91 9515546704</p>
      </div>
      <div class="contact__actions">
        <a class="contact__email" href="mailto:pidugushivaram@gmail.com">pidugushivaram@gmail.com</a>
        <div class="contact__buttons">
          <a href="/resume.pdf" download class="button button--primary">Download Resume</a>
          <div class="contact__links">
            <a href="https://www.linkedin.com/in/shivarampidugu" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer">
      <p class="footer__text">© ${new Date().getFullYear()} Pidugu Shivaram. All rights reserved.</p>
    </footer>
  </section>
</main>

<div class="lightbox" id="lightbox">
  <div class="lightbox__backdrop" id="lightbox-close-bg"></div>
  <div class="lightbox__content">
    <button class="lightbox__close" id="lightbox-close-btn" aria-label="Close">✕</button>
    <img class="lightbox__image" id="lightbox-img" src="" alt="Project Expanded View" />
  </div>
</div>
`

gsap.registerPlugin(ScrollTrigger)

function splitWords(selector) {
  const element = document.querySelector(selector);
  if (!element) return;

  const words = element.innerText.split(' ');
  element.innerHTML = ''; 

  words.forEach(word => {
    const wrapper = document.createElement('span');
    // [BUG FIX]: Added 'vertical-align: top' and 'line-height: normal' to stop mobile word collision when viewport scales
    wrapper.style.cssText = 'overflow: hidden; display: inline-flex; padding-bottom: 0.1em; margin-right: 0.25em; vertical-align: top; line-height: normal;';

    const inner = document.createElement('span');
    inner.style.cssText = 'display: inline-block; transform: translateY(110%);'; 
    inner.className = 'reveal-word';
    inner.innerText = word;

    wrapper.appendChild(inner);
    element.appendChild(wrapper);
    
    const space = document.createTextNode(' ');
    element.appendChild(space);
  });
}

splitWords('.hero__title');
splitWords('.hero__subtitle');

const heroTimeline = gsap.timeline({ paused: true });

heroTimeline.from('.hero__eyebrow', { opacity: 0, duration: 1, ease: 'power3.inOut' });
heroTimeline.to('.hero__title .reveal-word', { y: '0%', duration: 1.2, stagger: 0.04, ease: 'power4.out' }, '-=0.5');
heroTimeline.to('.hero__subtitle .reveal-word', { y: '0%', duration: 1.0, stagger: 0.02, ease: 'power4.out' }, '-=0.9');

let loadProgress = { val: 0 };
gsap.to(loadProgress, {
  val: 100, duration: 2.2, roundProps: "val",
  onUpdate: () => {
    const countEl = document.querySelector('.preloader__count');
    const barEl = document.querySelector('.preloader__bar');
    if(countEl) countEl.innerText = loadProgress.val + '%';
    if(barEl) barEl.style.width = loadProgress.val + '%';
  },
  onComplete: () => {
    gsap.to('.preloader', {
      yPercent: -100, duration: 1.2, ease: 'power4.inOut',
      onComplete: () => {
        const p = document.querySelector('.preloader');
        if (p) p.remove();
        heroTimeline.play(); 
      }
    });
  }
});

document.querySelectorAll('.about, .skills, .experience, .projects').forEach((section) => {
  gsap.from(section, {
    y: 50, opacity: 0, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
  })
})

const backgroundCanvas = document.createElement('canvas')
backgroundCanvas.className = 'scene-canvas'
document.body.appendChild(backgroundCanvas)

const scene = new THREE.Scene()

const vertexShader = `
uniform float uVelocity; uniform float uHoverStrength; varying vec2 vUv;
void main() {
  vUv = uv; vec3 transformed = position;
  float strength = clamp(abs(uVelocity) * 0.6, 0.0, 1.0);
  float edge = vUv.y - 0.5; float curveProfile = edge * abs(edge); 
  float bendY = -sign(uVelocity) * strength * curveProfile * 50.0;
  float bendZ = strength * curveProfile * 140.0; bendZ += uHoverStrength * 20.0;
  transformed.y += bendY; transformed.z += bendZ;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`

const fragmentShader = `
uniform sampler2D uTexture; uniform vec2 uImageSize; uniform vec2 uPlaneSize; uniform vec2 uMouse; uniform float uHoverStrength; varying vec2 vUv;
void main() {
  float imageAspect = uImageSize.x / max(uImageSize.y, 0.001);
  float planeAspect = uPlaneSize.x / max(uPlaneSize.y, 0.001);
  vec2 uv = vUv;
  if (imageAspect > planeAspect) {
    float scale = planeAspect / imageAspect; uv.x = (uv.x - 0.5) * scale + 0.5;
  } else {
    float scale = imageAspect / planeAspect; uv.y = (uv.y - 0.5) * scale + 0.5;
  }
  float distToMouse = distance(uv, uMouse);
  float radius = 0.35;
  float hoverMask = smoothstep(radius, 0.0, distToMouse) * uHoverStrength;
  vec2 direction = normalize(uv - uMouse);
  direction = mix(direction, vec2(0.0, 0.0), 1.0 - hoverMask);
  vec2 shift = direction * 0.025 * hoverMask;
  vec4 colorR = texture2D(uTexture, uv + shift * 0.7);
  vec4 colorG = texture2D(uTexture, uv);
  vec4 colorB = texture2D(uTexture, uv - shift * 0.7);
  gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, colorG.a);
}
`

const sizes = { width: window.innerWidth, height: window.innerHeight }

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);
let isMobile = window.innerWidth < 768 || isTouchDevice;

// [BUG FIX]: Ensuring Orthographic camera bounds exactly match screen pixel coordinates to prevent mesh drift.
const camera = new THREE.OrthographicCamera(0, sizes.width, sizes.height, 0, -1000, 1000)
camera.position.z = 10

const renderer = new THREE.WebGLRenderer({ canvas: backgroundCanvas, antialias: true, alpha: true });
const maxPixelRatio = isMobile ? 1.5 : 2;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
renderer.setSize(sizes.width, sizes.height);

const BLOOM_LAYER = 1;
const bloomComposer = new EffectComposer(renderer);
const finalComposer = new EffectComposer(renderer);
const renderScene = new RenderPass(scene, camera);

const bloomResX = isMobile ? sizes.width / 2 : sizes.width;
const bloomResY = isMobile ? sizes.height / 2 : sizes.height;

const bloomPass = new UnrealBloomPass(new THREE.Vector2(bloomResX, bloomResY), 0.85, 0.95, 0.6);
bloomComposer.renderToScreen = false
bloomComposer.addPass(renderScene)
bloomComposer.addPass(bloomPass)

const finalPass = new ShaderPass(
  {
    uniforms: { baseTexture: { value: null }, bloomTexture: { value: null } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv; void main() { vec4 base = texture2D(baseTexture, vUv); vec4 bloom = texture2D(bloomTexture, vUv); gl_FragColor = base + bloom; }`,
  },
  'baseTexture',
)
finalPass.needsSwap = true
finalComposer.addPass(renderScene)
finalComposer.addPass(finalPass)

let COMPUTE_SIZE = isMobile ? 128 : 256;
let gpuCompute = null, positionVariable = null, velocityVariable = null, particles = null, pointsMaterial = null

function fillPositionTexture(texture) {
  const data = texture.image.data
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = Math.random() * window.innerWidth; data[i + 1] = Math.random() * window.innerHeight
    data[i + 2] = (Math.random() - 0.5) * 100.0; data[i + 3] = 1.0
  }
}
function fillVelocityTexture(texture) {
  const data = texture.image.data
  for (let i = 0; i < data.length; i += 4) { data[i] = 0; data[i+1] = 0; data[i+2] = 0; data[i+3] = 1; }
}

function initGpuCompute() {
  try {
    gpuCompute = new GPUComputationRenderer(COMPUTE_SIZE, COMPUTE_SIZE, renderer)
    const positionTexture = gpuCompute.createTexture()
    const velocityTexture = gpuCompute.createTexture()
    fillPositionTexture(positionTexture); fillVelocityTexture(velocityTexture)

    const posShader = `uniform vec3 uBounds; uniform float uDelta; uniform float uTime; void main() { vec2 uv = gl_FragCoord.xy / resolution.xy; vec4 pos = texture2D(texturePosition, uv); vec4 vel = texture2D(textureVelocity, uv); vec3 nextPos = pos.xyz + vel.xyz; vec3 center = vec3(uBounds.x * 0.5, uBounds.y * 0.5, 0.0); vec3 span = vec3(uBounds.x, uBounds.y, uBounds.z); float h = fract(sin(dot(uv + uTime * 0.01, vec2(12.9898, 78.233))) * 43758.5453); float h2 = fract(sin(dot(uv + vec2(4.123, 9.456) + uTime * 0.02, vec2(39.346, 11.135))) * 24634.6345); bool outX = abs(nextPos.x - center.x) > span.x * 1.25; bool outY = abs(nextPos.y - center.y) > span.y * 1.25; bool outZ = abs(nextPos.z) > span.z * 1.25; if (outX || outY || outZ) { nextPos = center + vec3((h - 0.5) * uBounds.x * 0.15, (h2 - 0.5) * uBounds.y * 0.15, (h - 0.5) * uBounds.z * 0.15); } gl_FragColor = vec4(nextPos, 1.0); }`
    
    const velShader = `uniform vec3 uMouse; uniform vec3 uBounds; uniform float uDelta; uniform float uTime; vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; } vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; } vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); } vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; } float snoise(vec3 v) { const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0); vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx); vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy); vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy; i = mod289(i); vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0)); float n_ = 1.0/7.0; vec3 ns = n_ * D.wyz - D.xzx; vec4 j = p - 49.0 * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_); vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y); vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw); vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0)); vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww; vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w); vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3))); p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w; vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m; return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3))); } vec3 curlNoise(vec3 p) { const float e = 0.1; vec3 dx = vec3(e, 0.0, 0.0); vec3 dy = vec3(0.0, e, 0.0); vec3 dz = vec3(0.0, 0.0, e); vec3 p_x0 = vec3(snoise(p - dx), snoise(p - dx + vec3(12.3)), snoise(p - dx + vec3(24.6))); vec3 p_x1 = vec3(snoise(p + dx), snoise(p + dx + vec3(12.3)), snoise(p + dx + vec3(24.6))); vec3 p_y0 = vec3(snoise(p - dy), snoise(p - dy + vec3(12.3)), snoise(p - dy + vec3(24.6))); vec3 p_y1 = vec3(snoise(p + dy), snoise(p + dy + vec3(12.3)), snoise(p + dy + vec3(24.6))); vec3 p_z0 = vec3(snoise(p - dz), snoise(p - dz + vec3(12.3)), snoise(p - dz + vec3(24.6))); vec3 p_z1 = vec3(snoise(p + dz), snoise(p + dz + vec3(12.3)), snoise(p + dz + vec3(24.6))); float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y; float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z; float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x; return normalize(vec3(x, y, z) / (2.0 * e)); } void main() { vec2 uv = gl_FragCoord.xy / resolution.xy; vec3 pos = texture2D(texturePosition, uv).xyz; vec3 vel = texture2D(textureVelocity, uv).xyz; vec3 targetVel = curlNoise(pos * 0.002 + uTime * 0.2) * 2.0; vel += (targetVel - vel) * 0.05; float dist = distance(pos.xy, uMouse.xy); float maxDistance = 100.0; if (dist < maxDistance) { vec2 dir = pos.xy - uMouse.xy; float force = (maxDistance - dist) / maxDistance; vel.xy += normalize(dir + 0.0001) * force * 20.0; } vel *= 0.95; gl_FragColor = vec4(vel, 1.0); }`

    positionVariable = gpuCompute.addVariable('texturePosition', posShader, positionTexture)
    velocityVariable = gpuCompute.addVariable('textureVelocity', velShader, velocityTexture)
    gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable])
    gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable])

    positionVariable.material.uniforms.uBounds = { value: new THREE.Vector3(sizes.width, sizes.height, 100) }
    positionVariable.material.uniforms.uTime = { value: 0.0 }; positionVariable.material.uniforms.uDelta = { value: 0.016 }
    velocityVariable.material.uniforms.uBounds = { value: new THREE.Vector3(sizes.width, sizes.height, 100) };
    velocityVariable.material.uniforms.uDelta = { value: 0.016 }; velocityVariable.material.uniforms.uTime = { value: 0.0 };
    velocityVariable.material.uniforms.uMouse = { value: fboMouse };

    const initError = gpuCompute.init()
    if (initError) { gpuCompute = null; positionVariable = null; velocityVariable = null; }
  } catch { gpuCompute = null; positionVariable = null; velocityVariable = null; }
}
initGpuCompute()

function initParticles() {
  if (!gpuCompute || !positionVariable) return
  const size = COMPUTE_SIZE, particlesCount = size * size
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particlesCount * 3), references = new Float32Array(particlesCount * 2)

  for (let i = 0; i < particlesCount; i++) {
    references[i * 2] = ((i % size) + 0.5) / size; references[i * 2 + 1] = (Math.floor(i / size) + 0.5) / size
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('reference', new THREE.BufferAttribute(references, 2))

  pointsMaterial = new THREE.ShaderMaterial({
    uniforms: { uPositionTexture: { value: null }, uAlpha: { value: 0.85 } },
    vertexShader: `uniform sampler2D uPositionTexture; attribute vec2 reference; varying vec3 vPos; void main() { vec3 pos = texture2D(uPositionTexture, reference).xyz; vPos = pos; vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); gl_Position = projectionMatrix * mvPosition; gl_PointSize = 2.0; }`,
    fragmentShader: `uniform float uAlpha; varying vec3 vPos; void main() { vec2 c = gl_PointCoord - 0.5; float d = length(c); float mask = smoothstep(0.5, 0.35, d); vec3 color1 = vec3(0.22, 0.74, 0.97); vec3 color2 = vec3(0.39, 0.40, 0.95); float mixFactor = (vPos.x * 0.001) + (vPos.y * 0.001) + 0.5; vec3 finalColor = mix(color1, color2, clamp(mixFactor, 0.0, 1.0)); gl_FragColor = vec4(finalColor, uAlpha * mask); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  })

  particles = new THREE.Points(geometry, pointsMaterial)
  particles.frustumCulled = false; particles.position.z = -300; particles.layers.set(BLOOM_LAYER) 
  scene.add(particles)
}
initParticles()

const placeholderMeshes = []
const textureLoader = new THREE.TextureLoader()

// [BUG FIX]: The massive image scaling bug was caused by passing DOM rect dimensions into the base geometry.
// This enforces a strict 1x1 unit base, which we multiply strictly by CSS size in the loop later.
const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32) 

function createPlaceholderMeshes() {
  document.querySelectorAll('.image-placeholder').forEach((element) => {
    const rect = element.getBoundingClientRect()
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null }, uVelocity: { value: 0 }, uHoverStrength: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uImageSize: { value: new THREE.Vector2(1, 1) },
        uPlaneSize: { value: new THREE.Vector2(Math.max(rect.width, 1), Math.max(rect.height, 1)) },
      },
      vertexShader, fragmentShader, transparent: true,
    })
    
    const mesh = new THREE.Mesh(planeGeometry, material)
    const imageUrl = element.dataset.image
    
    if (imageUrl) {
      material.uniforms.uImageSize.value.set(rect.width, rect.height)
      textureLoader.load(imageUrl, (texture) => {
        if (texture.image) material.uniforms.uImageSize.value.set(texture.image.width, texture.image.height)
        material.uniforms.uTexture.value = texture
        material.needsUpdate = true
      })
    }
    scene.add(mesh)
    placeholderMeshes.push({ element, mesh })
  })
}

const raycaster = new THREE.Raycaster()
const pointerNDC = new THREE.Vector2(2, 2)

function handleInput(event) {
  if (event.pointerType === 'touch') {
    const cursorEl = document.querySelector('.tech-cursor'); if (cursorEl) cursorEl.style.opacity = '0';
  } else {
    const cursorEl = document.querySelector('.tech-cursor'); if (cursorEl) cursorEl.style.opacity = '1';
  }

  pointerNDC.x = (event.clientX / sizes.width) * 2 - 1
  pointerNDC.y = -(event.clientY / sizes.height) * 2 + 1
  pointerScreen.x = event.clientX; pointerScreen.y = event.clientY;

  if (typeof fboMouse !== 'undefined') {
    fboMouse.x = event.clientX; fboMouse.y = sizes.height - event.clientY; fboMouse.z = 0;
  }
}

window.addEventListener('pointermove', handleInput);
window.addEventListener('pointerdown', handleInput);

function updatePlaceholderMeshTransforms(scrollY = 0) {
  placeholderMeshes.forEach(({ element, mesh }) => {
    const rect = element.getBoundingClientRect()
    // [BUG FIX]: Scale safely calculates from the 1x1 geometry to map exactly to the CSS bounds.
    mesh.scale.set(Math.max(rect.width, 1), Math.max(rect.height, 1), 1)
    mesh.position.set(rect.left + rect.width / 2, sizes.height - (rect.top + rect.height / 2), 0)
    mesh.material.uniforms.uPlaneSize.value.set(rect.width, rect.height)
  })
}

function onResize() {
  sizes.width = window.innerWidth; sizes.height = window.innerHeight
  const touchCheck = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);
  const newIsMobile = window.innerWidth < 768 || touchCheck;

  if (newIsMobile !== isMobile) {
    isMobile = newIsMobile; COMPUTE_SIZE = isMobile ? 128 : 256;
    if (particles) { scene.remove(particles); particles.geometry.dispose(); particles.material.dispose(); }
    initGpuCompute(); initParticles();
  }

  // Ensure camera perfectly maps to new layout dimensions
  camera.right = sizes.width; camera.top = sizes.height; camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  bloomComposer.setSize(sizes.width, sizes.height)
  finalComposer.setSize(sizes.width, sizes.height)
  
  if (typeof bloomPass !== 'undefined') {
    bloomPass.setSize(isMobile ? sizes.width / 2 : sizes.width, isMobile ? sizes.height / 2 : sizes.height);
  }

  if (positionVariable) positionVariable.material.uniforms.uBounds.value.set(sizes.width, sizes.height, 100)
  if (velocityVariable) velocityVariable.material.uniforms.uBounds.value.set(sizes.width, sizes.height, 100)

  updatePlaceholderMeshTransforms()
}
window.addEventListener('resize', onResize)

createPlaceholderMeshes()
updatePlaceholderMeshTransforms()

const lenis = new Lenis()
let currentScroll = 0, scrollVelocity = 0, smoothedVelocity = 0, lastRafTime = performance.now()

lenis.on('scroll', ({ scroll, velocity }) => { 
  currentScroll = scroll; scrollVelocity = velocity; ScrollTrigger.update();
})

// [FEATURE ADDED]: Lightbox / Image Enlarge Event Handlers
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBg = document.getElementById('lightbox-close-bg');
const closeBtn = document.getElementById('lightbox-close-btn');

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const imgEl = card.querySelector('.image-placeholder');
    const imgSrc = imgEl.dataset.image;
    if (imgSrc) {
      lightboxImg.src = imgSrc;
      lightbox.classList.add('is-active');
      lenis.stop(); // Lock scrolling while viewing image
    }
  });
});

function closeLightbox() {
  lightbox.classList.remove('is-active');
  setTimeout(() => { lightboxImg.src = ''; }, 300); // Clear source after fade out
  lenis.start(); // Unlock scrolling
}

closeBg.addEventListener('click', closeLightbox);
closeBtn.addEventListener('click', closeLightbox);

// Smooth Scroll Links
document.querySelectorAll('[data-scroll-target]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault()
    const targetElement = document.querySelector(button.getAttribute('data-scroll-target'))
    if (!targetElement) return
    lenis.scrollTo(targetElement, { offset: -80, duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) })
  })
})

function raf(time) {
  if (typeof lenis !== 'undefined' && lenis) lenis.raf(time);
  lastRafTime = performance.now();
  smoothedVelocity += ((isMobile ? 0 : scrollVelocity) - smoothedVelocity) * 0.16;

  if (typeof updatePlaceholderMeshTransforms === 'function') updatePlaceholderMeshTransforms(currentScroll);

  let intersects = [];
  if (!isMobile && window.matchMedia('(hover: hover)').matches) {
    raycaster.setFromCamera(pointerNDC, camera);
    intersects = raycaster.intersectObjects(placeholderMeshes.map(p => p.mesh));
  }

  placeholderMeshes.forEach(({ element, mesh }) => {
    mesh.material.uniforms.uVelocity.value = smoothedVelocity;
    const isHovered = intersects.length > 0 && intersects[0].object === mesh;
    mesh.material.uniforms.uHoverStrength.value += ((isHovered ? 1.0 : 0.0) - mesh.material.uniforms.uHoverStrength.value) * 0.1;
    
    const rect = element.getBoundingClientRect();
    const localX = (pointerScreen.x - rect.left) / Math.max(rect.width, 1.0);
    const localY = (pointerScreen.y - rect.top) / Math.max(rect.height, 1.0);
    mesh.material.uniforms.uMouse.value.set(localX, 1.0 - localY);
  });

  if (gpuCompute && positionVariable && velocityVariable) {
    velocityVariable.material.uniforms.uMouse.value.copy(fboMouse);
    velocityVariable.material.uniforms.uTime.value += 0.01;
    positionVariable.material.uniforms.uTime.value += 0.01;
    gpuCompute.compute();
    if (pointsMaterial) pointsMaterial.uniforms.uPositionTexture.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
  }

  if (typeof bloomComposer !== 'undefined' && typeof finalComposer !== 'undefined') {
    camera.layers.set(BLOOM_LAYER); bloomComposer.render();
    if (finalPass && finalPass.uniforms.bloomTexture) finalPass.uniforms.bloomTexture.value = bloomComposer.readBuffer.texture;
    camera.layers.set(0); finalComposer.render();
  }

  requestAnimationFrame(raf);
}

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor = initCursor()
  if (cursor && typeof cursor.setupMagnetic === 'function') cursor.setupMagnetic()
}

raf(performance.now());
