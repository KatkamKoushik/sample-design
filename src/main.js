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

// --- State & Config ---
let fboMouse = new THREE.Vector3(0, 0, 0)
let pointerScreen = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2)
const projects = [
  { image: '/image.jpg', url: '#' },
  { image: '/image2.jpg', url: '#' },
]

// --- UI Rendering ---
const app = document.querySelector('#app')
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

  <section class="about" id="about">
    <h2 class="section-label">About</h2>
    <div class="about__content">
      <h3 class="about__headline">Motivated problem-solver seeking to apply technical skills in real-world projects.</h3>
      <p class="about__body">
        I'm a 2nd-year B.Tech Computer Science Engineering student at Ku College of Engineering and Technology.
      </p>
    </div>
  </section>

  <section class="projects" id="projects">
    <header class="projects__header">
      <h2 class="section-label">Selected projects</h2>
    </header>
    <div class="projects__grid">
      ${projects.map(p => `
        <div class="project-card" data-url="${p.url}" style="cursor: pointer;">
          <div class="image-placeholder" data-image="${p.image}"></div>
        </div>
      `).join('')}
    </div>
  </section>

  <section class="contact" id="contact">
    <div class="contact__inner">
        <a class="contact__email" href="mailto:pidugushivaram@gmail.com">pidugushivaram@gmail.com</a>
        <footer class="footer">
          <p class="footer__text">© ${new Date().getFullYear()} Pidugu Shivaram.</p>
        </footer>
    </div>
  </section>
</main>

<div class="lightbox" id="lightbox">
  <div class="lightbox__backdrop" id="lightbox-close-bg"></div>
  <div class="lightbox__content">
    <button class="lightbox__close" id="lightbox-close-btn">✕</button>
    <img class="lightbox__image" id="lightbox-img" src="" alt="Project Expanded View" />
  </div>
</div>
`

// --- GSAP & Scroll Setup ---
gsap.registerPlugin(ScrollTrigger)
const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)

function splitWords(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  const words = element.innerText.split(' ');
  element.innerHTML = ''; 
  words.forEach(word => {
    const wrapper = document.createElement('span');
    wrapper.style.cssText = 'overflow: hidden; display: inline-flex; vertical-align: top; margin-right: 0.25em;';
    const inner = document.createElement('span');
    inner.style.cssText = 'display: inline-block; transform: translateY(110%);'; 
    inner.className = 'reveal-word';
    inner.innerText = word;
    wrapper.appendChild(inner);
    element.appendChild(wrapper);
  });
}

splitWords('.hero__title');
splitWords('.hero__subtitle');

const heroTimeline = gsap.timeline({ paused: true });
heroTimeline.from('.hero__eyebrow', { opacity: 0, duration: 1 })
            .to('.hero__title .reveal-word', { y: '0%', duration: 1, stagger: 0.05 }, '-=0.5')
            .to('.hero__subtitle .reveal-word', { y: '0%', duration: 0.8, stagger: 0.02 }, '-=0.8');

// Preloader
let loadProgress = { val: 0 };
gsap.to(loadProgress, {
  val: 100, duration: 2, roundProps: "val",
  onUpdate: () => {
    document.querySelector('.preloader__count').innerText = loadProgress.val + '%';
    document.querySelector('.preloader__bar').style.width = loadProgress.val + '%';
  },
  onComplete: () => {
    gsap.to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut', onComplete: () => heroTimeline.play() });
  }
});

// --- Three.js Scene Setup ---
const backgroundCanvas = document.createElement('canvas')
backgroundCanvas.className = 'scene-canvas'
document.body.appendChild(backgroundCanvas)

const scene = new THREE.Scene()
const sizes = { width: window.innerWidth, height: window.innerHeight }
const camera = new THREE.OrthographicCamera(0, sizes.width, sizes.height, 0, -1000, 1000)
camera.position.z = 10

const renderer = new THREE.WebGLRenderer({ canvas: backgroundCanvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

// --- Post Processing ---
const BLOOM_LAYER = 1;
const bloomComposer = new EffectComposer(renderer);
const finalComposer = new EffectComposer(renderer);

bloomComposer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(sizes.width, sizes.height), 1.5, 0.4, 0.85);
bloomComposer.addPass(bloomPass);
bloomComposer.renderToScreen = false;

const finalPass = new ShaderPass({
  uniforms: { baseTexture: { value: null }, bloomTexture: { value: null } },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv; void main() { gl_FragColor = texture2D(baseTexture, vUv) + texture2D(bloomTexture, vUv); }`
}, 'baseTexture');
finalComposer.addPass(new RenderPass(scene, camera));
finalComposer.addPass(finalPass);

// --- GPU Particles ---
const COMPUTE_SIZE = 128;
let gpuCompute, positionVariable, velocityVariable, pointsMaterial;

function initGpuCompute() {
  gpuCompute = new GPUComputationRenderer(COMPUTE_SIZE, COMPUTE_SIZE, renderer);
  const posTex = gpuCompute.createTexture();
  const velTex = gpuCompute.createTexture();
  
  const posData = posTex.image.data;
  for(let i=0; i<posData.length; i+=4) {
    posData[i] = Math.random() * sizes.width;
    posData[i+1] = Math.random() * sizes.height;
  }

  positionVariable = gpuCompute.addVariable('texturePosition', `
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 pos = texture2D(texturePosition, uv);
      vec4 vel = texture2D(textureVelocity, uv);
      gl_FragColor = vec4(pos.xyz + vel.xyz, 1.0);
    }
  `, posTex);

  velocityVariable = gpuCompute.addVariable('textureVelocity', `
    uniform vec3 uMouse;
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec3 pos = texture2D(texturePosition, uv).xyz;
      vec3 vel = texture2D(textureVelocity, uv).xyz;
      vec3 dir = normalize(pos - uMouse);
      float dist = distance(pos.xy, uMouse.xy);
      if(dist < 100.0) vel.xy += dir.xy * 0.5;
      vel *= 0.96;
      gl_FragColor = vec4(vel, 1.0);
    }
  `, velTex);

  gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);
  gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
  velocityVariable.material.uniforms.uMouse = { value: fboMouse };
  gpuCompute.init();
}

initGpuCompute();

const particlesGeom = new THREE.BufferGeometry();
const refs = new Float32Array(COMPUTE_SIZE * COMPUTE_SIZE * 2);
for(let i=0; i<COMPUTE_SIZE*COMPUTE_SIZE; i++) {
  refs[i*2] = (i % COMPUTE_SIZE) / COMPUTE_SIZE;
  refs[i*2+1] = Math.floor(i / COMPUTE_SIZE) / COMPUTE_SIZE;
}
particlesGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COMPUTE_SIZE*COMPUTE_SIZE*3), 3));
particlesGeom.setAttribute('reference', new THREE.BufferAttribute(refs, 2));

pointsMaterial = new THREE.ShaderMaterial({
  uniforms: { uPositionTexture: { value: null }, uTime: { value: 0 } },
  vertexShader: `uniform sampler2D uPositionTexture; attribute vec2 reference; void main() { vec3 pos = texture2D(uPositionTexture, reference).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); gl_PointSize = 2.0; }`,
  fragmentShader: `void main() { gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0); }`,
  transparent: true, blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particlesGeom, pointsMaterial);
particles.layers.set(BLOOM_LAYER);
scene.add(particles);

// --- Image Meshes ---
const placeholderMeshes = [];
const texLoader = new THREE.TextureLoader();

function createMeshes() {
  document.querySelectorAll('.image-placeholder').forEach(el => {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTexture: { value: null }, uHoverStrength: { value: 0 }, uVelocity: { value: 0 } },
      vertexShader: `varying vec2 vUv; uniform float uVelocity; void main() { vUv = uv; vec3 p = position; p.z += sin(uv.y * 3.14) * abs(uVelocity) * 10.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
      fragmentShader: `varying vec2 vUv; uniform sampler2D uTexture; void main() { gl_FragColor = texture2D(uTexture, vUv); }`
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    texLoader.load(el.dataset.image, t => mat.uniforms.uTexture.value = t);
    scene.add(mesh);
    placeholderMeshes.push({ el, mesh });
  });
}
createMeshes();

// --- Main Loop ---
function raf(time) {
  lenis.raf(time);
  
  placeholderMeshes.forEach(({ el, mesh }) => {
    const rect = el.getBoundingClientRect();
    mesh.scale.set(rect.width, rect.height, 1);
    mesh.position.set(rect.left + rect.width/2, sizes.height - (rect.top + rect.height/2), 0);
    mesh.material.uniforms.uVelocity.value = lenis.velocity;
  });

  gpuCompute.compute();
  pointsMaterial.uniforms.uPositionTexture.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;

  camera.layers.set(BLOOM_LAYER);
  bloomComposer.render();
  finalPass.uniforms.bloomTexture.value = bloomComposer.readBuffer.texture;
  
  camera.layers.set(0);
  finalComposer.render();
  
  requestAnimationFrame(raf);
}

window.addEventListener('pointermove', (e) => {
  fboMouse.x = e.clientX;
  fboMouse.y = sizes.height - e.clientY;
});

raf(performance.now());
if (window.matchMedia('(hover: hover)').matches) initCursor();
