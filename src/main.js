import './style.css'
import * as THREE from 'three'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { initPreloader } from './preloader.js'
import { initCursor } from './cursor.js'

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────
// PROJECT DATA
// ─────────────────────────────────────────────────
const projects = [
  { title: 'SchemaSense AI',  tag: 'AI / Full-Stack',    year: '2025', image: '/image.jpg',  url: '#' },
  { title: 'Living Particle', tag: 'Creative / WebGL',   year: '2025', image: '/image2.jpg', url: '#' },
  { title: 'GDG Cloud Delhi', tag: 'Event / Community',  year: '2025', image: '/image3.jpg', url: '#' },
  { title: 'Neural Dashboard',tag: 'Data / Analytics',   year: '2024', image: '/image.jpg',  url: '#' },
  { title: 'Deep Learning Lab',tag:'Research / PyTorch', year: '2024', image: '/image2.jpg', url: '#' },
  { title: 'Creative Tooling', tag: 'Three.js / GSAP',   year: '2024', image: '/image3.jpg', url: '#' },
]

// ─────────────────────────────────────────────────
// HTML INJECTION
// ─────────────────────────────────────────────────
const app = document.querySelector('#app')
app.innerHTML = `
  <header class="site-header">
    <div class="site-header__inner">
      <a href="#top" class="site-header__logo">KK</a>
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
        <p class="hero__eyebrow">Creative Developer</p>
        <h1 id="hero-title" class="hero__title">Digital experiences,<br>crafted with care.</h1>
        <p class="hero__subtitle">
          I build interactive visuals, AI-powered products, and end-to-end web platforms
          — with a focus on performance, craft, and the details that make interfaces feel alive.
        </p>
      </div>
    </section>

    <section class="about" id="about" aria-labelledby="about-title">
      <h2 id="about-title" class="section-label">About</h2>
      <div class="about__content">
        <h3 class="about__headline">Building thoughtful digital experiences with code, craft, and curiosity.</h3>
        <p class="about__body">
          I design and develop interfaces that feel intentional, minimal, and alive. From interactive
          GPU-accelerated visuals and data-driven products to end-to-end web platforms, I care deeply
          about details, performance, and creating work that feels quietly premium.
        </p>
      </div>
    </section>

    <section class="skills" id="skills" aria-labelledby="skills-title">
      <h2 id="skills-title" class="section-label">Skills</h2>
      <div class="skills__grid">
        <article class="skills__card"><h3 class="skills__title">AI &amp; Machine Learning</h3><p class="skills__meta">Python · PyTorch · TensorFlow · Transformers · Gemini API</p></article>
        <article class="skills__card"><h3 class="skills__title">Full‑Stack Development</h3><p class="skills__meta">TypeScript · React · Node.js · REST &amp; GraphQL APIs</p></article>
        <article class="skills__card"><h3 class="skills__title">Creative Engineering</h3><p class="skills__meta">Three.js · GSAP · WebGL · GLSL Shaders</p></article>
        <article class="skills__card"><h3 class="skills__title">Data &amp; Analytics</h3><p class="skills__meta">Data pipelines · Dashboards · Experimentation · SQL</p></article>
      </div>
    </section>

    <section class="experience" aria-labelledby="experience-title">
      <h2 id="experience-title" class="section-label">Experience &amp; Certifications</h2>
      <ul class="experience__list">
        <li class="experience__item">
          <span class="experience__label">AI Hackathon Finalist</span>
          <span class="experience__meta">2025 · GDG Cloud Delhi · Generative visuals prototype</span>
        </li>
        <li class="experience__item">
          <span class="experience__label">Deep Learning Specialization</span>
          <span class="experience__meta">Coursera · Neural networks &amp; applied ML</span>
        </li>
        <li class="experience__item">
          <span class="experience__label">Full‑Stack Web Certification</span>
          <span class="experience__meta">Modern JavaScript · React · Node.js</span>
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
          <div class="project-card" data-url="${p.url}">
            <div class="image-placeholder" data-image="${p.image}"></div>
            <div class="project-card__info">
              <span class="project-card__tag">${p.tag}</span>
              <h3 class="project-card__title">${p.title}</h3>
              <span class="project-card__year">${p.year}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="contact" id="contact" aria-labelledby="contact-title">
      <div class="contact__inner">
        <div class="contact__copy">
          <h2 id="contact-title" class="section-label">Contact</h2>
          <p class="contact__headline">Let's collaborate on something meaningful.</p>
          <p class="contact__body">Whether you're exploring an idea, looking for a long-term collaborator, or curious about the work — feel free to reach out.</p>
        </div>
        <div class="contact__actions">
          <a class="contact__email" href="mailto:katkamkoushik@gmail.com">katkamkoushik@gmail.com</a>
          <div class="contact__buttons">
            <button type="button" class="button button--primary" data-magnetic="0.3">Download Resume</button>
            <div class="contact__links">
              <a href="https://github.com/KatkamKoushik" target="_blank" rel="noreferrer">GitHub</a>
              <span>·</span>
              <a href="https://linkedin.com/in/katkam-koushik" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer">
        <p class="footer__text">© ${new Date().getFullYear()} Koushik Katkam. All rights reserved.</p>
        <p class="footer__text" style="opacity:0.4">Built with Three.js · GSAP · Vite</p>
      </footer>
    </section>
  </main>
`

// ─────────────────────────────────────────────────
// DEVICE DETECTION
// ─────────────────────────────────────────────────
const isTouchDevice = window.matchMedia('(hover: none)').matches
let isMobile = window.innerWidth < 768

// ─────────────────────────────────────────────────
// CONSTELLATION BACKGROUND (replaces GPGPU + bloom)
// ─────────────────────────────────────────────────
// Uses a 2D canvas drawn into a Three.js CanvasTexture on a fullscreen quad.
// This avoids bloom entirely and gives a clean, elegant network look.
// ─────────────────────────────────────────────────

const offscreenCanvas  = document.createElement('canvas')
const ctx              = offscreenCanvas.getContext('2d')
let constellationNodes = []
let mouseX = 0, mouseY = 0

const NODE_COUNT         = isTouchDevice ? 0 : 90
const CONNECTION_RADIUS  = 180   // px — max distance to draw a line
const MOUSE_REPEL_RADIUS = 110   // px
const MOUSE_REPEL_FORCE  = 2.2
const DRIFT_SPEED        = 0.35  // base speed

function resizeOffscreen() {
  offscreenCanvas.width  = window.innerWidth
  offscreenCanvas.height = window.innerHeight
}

function createNodes() {
  constellationNodes = []
  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = DRIFT_SPEED * (0.4 + Math.random() * 0.6)
    constellationNodes.push({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      // Slightly vary node sizes for depth illusion
      r:  0.9 + Math.random() * 1.2,
    })
  }
}

function updateAndDrawConstellation(scrollY) {
  const W = offscreenCanvas.width
  const H = offscreenCanvas.height

  ctx.clearRect(0, 0, W, H)

  // Scroll offset: nodes appear to drift slightly with page scroll
  const scrollShift = scrollY * 0.06

  for (let i = 0; i < constellationNodes.length; i++) {
    const n = constellationNodes[i]

    // Mouse repulsion
    const dx   = n.x - mouseX
    const dy   = n.y - (mouseY + scrollShift)
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
      const force = (1 - dist / MOUSE_REPEL_RADIUS) * MOUSE_REPEL_FORCE
      n.vx += (dx / dist) * force
      n.vy += (dy / dist) * force
    }

    // Speed cap + gentle damping back to drift speed
    const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
    if (spd > 3.5) { n.vx = (n.vx / spd) * 3.5; n.vy = (n.vy / spd) * 3.5 }
    n.vx *= 0.988
    n.vy *= 0.988

    // Move
    n.x += n.vx
    n.y += n.vy

    // Wrap around edges (seamless)
    if (n.x < -10) n.x = W + 10
    if (n.x > W + 10) n.x = -10
    if (n.y < -10) n.y = H + 10
    if (n.y > H + 10) n.y = -10
  }

  // Draw connections
  for (let i = 0; i < constellationNodes.length; i++) {
    for (let j = i + 1; j < constellationNodes.length; j++) {
      const a  = constellationNodes[i]
      const b  = constellationNodes[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d  = Math.sqrt(dx * dx + dy * dy)

      if (d < CONNECTION_RADIUS) {
        // Opacity falls off with distance
        const alpha = (1 - d / CONNECTION_RADIUS) * 0.22
        ctx.beginPath()
        ctx.strokeStyle = `rgba(148, 200, 255, ${alpha})`
        ctx.lineWidth   = 0.6
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }

  // Draw nodes (dots)
  for (let i = 0; i < constellationNodes.length; i++) {
    const n = constellationNodes[i]
    ctx.beginPath()
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(180, 215, 255, 0.7)'
    ctx.fill()
  }
}

// ─────────────────────────────────────────────────
// THREE.JS SCENE — bare minimum for project cards
// ─────────────────────────────────────────────────
const backgroundCanvas = document.createElement('canvas')
backgroundCanvas.className = 'scene-canvas'
document.body.appendChild(backgroundCanvas)

const scene  = new THREE.Scene()
const sizes  = { width: window.innerWidth, height: window.innerHeight }

const camera = new THREE.OrthographicCamera(0, sizes.width, sizes.height, 0, -1000, 1000)
camera.position.z = 10

const renderer = new THREE.WebGLRenderer({
  canvas: backgroundCanvas,
  antialias: true,
  alpha: true,
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(0x000000, 0)

// ─────────────────────────────────────────────────
// CONSTELLATION — fullscreen quad with canvas texture
// ─────────────────────────────────────────────────
resizeOffscreen()
createNodes()

const constellationTexture = new THREE.CanvasTexture(offscreenCanvas)
const constellationQuad    = new THREE.Mesh(
  new THREE.PlaneGeometry(sizes.width, sizes.height),
  new THREE.MeshBasicMaterial({
    map: constellationTexture,
    transparent: true,
    depthWrite: false,
  })
)
// Centre the quad in the orthographic viewport
constellationQuad.position.set(sizes.width / 2, sizes.height / 2, -200)
scene.add(constellationQuad)

// ─────────────────────────────────────────────────
// PROJECT CARD MESHES (WebGL planes with shaders)
// ─────────────────────────────────────────────────
const cardVertexShader = `
  uniform float uVelocity;
  uniform float uHoverStrength;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 t = position;
    float s = clamp(abs(uVelocity) * 0.6, 0.0, 1.0);
    float e = vUv.y - 0.5;
    float p = e * abs(e);
    t.y += -sign(uVelocity) * s * p * 50.0;
    t.z +=  s * p * 140.0 + uHoverStrength * 20.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(t, 1.0);
  }
`

const cardFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uImageSize;
  uniform vec2 uPlaneSize;
  uniform vec2 uMouse;
  uniform float uHoverStrength;
  varying vec2 vUv;
  void main() {
    float ia = uImageSize.x / uImageSize.y;
    float pa = uPlaneSize.x / uPlaneSize.y;
    vec2 uv = vUv;
    if (ia > pa) { uv.x = (uv.x - 0.5) * (pa / ia) + 0.5; }
    else          { uv.y = (uv.y - 0.5) * (ia / pa) + 0.5; }
    float d  = distance(uv, uMouse);
    float hm = smoothstep(0.35, 0.0, d) * uHoverStrength;
    vec2 dir = normalize(uv - uMouse);
    dir = mix(dir, vec2(0.0), 1.0 - hm);
    vec2 sh = dir * 0.025 * hm;
    vec4 cR = texture2D(uTexture, uv + sh * 0.7);
    vec4 cG = texture2D(uTexture, uv);
    vec4 cB = texture2D(uTexture, uv - sh * 0.7);
    gl_FragColor = vec4(cR.r, cG.g, cB.b, cG.a);
  }
`

const placeholderMeshes = []
const textureLoader     = new THREE.TextureLoader()

function createPlaceholderMeshes() {
  placeholderMeshes.forEach(({ mesh }) => {
    scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose()
  })
  placeholderMeshes.length = 0

  document.querySelectorAll('.image-placeholder').forEach((el) => {
    const rect = el.getBoundingClientRect()
    const geo  = new THREE.PlaneGeometry(rect.width, rect.height, 32, 32)
    const mat  = new THREE.ShaderMaterial({
      uniforms: {
        uTexture:       { value: null },
        uVelocity:      { value: 0 },
        uHoverStrength: { value: 0 },
        uMouse:         { value: new THREE.Vector2(0.5, 0.5) },
        uImageSize:     { value: new THREE.Vector2(1, 1) },
        uPlaneSize:     { value: new THREE.Vector2(rect.width, rect.height) },
      },
      vertexShader:   cardVertexShader,
      fragmentShader: cardFragmentShader,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geo, mat)
    const url  = el.dataset.image
    if (url) {
      textureLoader.load(url, (tex) => {
        if (tex.image) mat.uniforms.uImageSize.value.set(tex.image.width, tex.image.height)
        mat.uniforms.uTexture.value = tex
        gsap.to(el, { opacity: 1, duration: 0.8, ease: 'power2.out' })
      }, undefined, () => gsap.to(el, { opacity: 1, duration: 0.8 }))
    }
    scene.add(mesh)
    placeholderMeshes.push({ element: el, mesh })
  })
}

function updatePlaceholderMeshTransforms() {
  placeholderMeshes.forEach(({ element, mesh }) => {
    const rect = element.getBoundingClientRect()
    mesh.position.set(
      rect.left + rect.width  / 2,
      sizes.height - (rect.top + rect.height / 2),
      0
    )
  })
}

// ─────────────────────────────────────────────────
// MOUSE + POINTER TRACKING
// ─────────────────────────────────────────────────
const raycaster  = new THREE.Raycaster()
const pointerNDC = new THREE.Vector2(2, 2)

window.addEventListener('pointermove', (e) => {
  const rect = renderer.domElement.getBoundingClientRect()
  pointerNDC.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
  pointerNDC.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
  // Feed raw coords to constellation
  mouseX = e.clientX
  mouseY = e.clientY
})

// ─────────────────────────────────────────────────
// RESIZE
// ─────────────────────────────────────────────────
function onResize() {
  sizes.width  = window.innerWidth
  sizes.height = window.innerHeight
  isMobile     = window.innerWidth < 768

  camera.right = sizes.width
  camera.top   = sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)

  // Resize offscreen canvas + recentre quad
  resizeOffscreen()
  constellationQuad.geometry.dispose()
  constellationQuad.geometry = new THREE.PlaneGeometry(sizes.width, sizes.height)
  constellationQuad.position.set(sizes.width / 2, sizes.height / 2, -200)

  createNodes()
  createPlaceholderMeshes()
  updatePlaceholderMeshTransforms()
}
window.addEventListener('resize', onResize)

// ─────────────────────────────────────────────────
// LENIS SMOOTH SCROLL
// ─────────────────────────────────────────────────
const lenis = new Lenis()
let currentScroll = 0, scrollVelocity = 0, smoothedVelocity = 0

lenis.on('scroll', ({ scroll, velocity }) => {
  currentScroll  = scroll
  scrollVelocity = velocity
})

gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)

document.querySelectorAll('[data-scroll-target]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const el = document.querySelector(btn.dataset.scrollTarget)
    if (el) lenis.scrollTo(el, { offset: -80, duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) })
  })
})

// ─────────────────────────────────────────────────
// SCROLL ANIMATIONS
// ─────────────────────────────────────────────────
function initScrollAnimations() {
  function splitWords(sel) {
    const el = document.querySelector(sel)
    if (!el) return
    el.innerHTML = el.innerText.split(' ').map(w =>
      `<span style="overflow:hidden;display:inline-flex;padding-bottom:0.08em;margin-right:0.25em">
         <span class="reveal-word" style="display:inline-block;transform:translateY(110%)">${w}</span>
       </span>`
    ).join('')
  }

  splitWords('.hero__title')
  splitWords('.hero__subtitle')

  gsap.timeline({ delay: 0.1 })
    .from('.hero__eyebrow', { opacity: 0, y: 10, duration: 0.9, ease: 'power3.out' })
    .to('.hero__title .reveal-word',    { y: '0%', duration: 1.1, stagger: 0.05, ease: 'power4.out' }, '-=0.5')
    .to('.hero__subtitle .reveal-word', { y: '0%', duration: 0.9, stagger: 0.02, ease: 'power4.out' }, '-=0.8')

  const sectionAnim = (trigger, targets, extra = {}) =>
    gsap.from(targets, {
      y: 36, opacity: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger, start: 'top 80%', toggleActions: 'play none none reverse' },
      ...extra
    })

  sectionAnim('.about',         '.about__headline, .about__body')
  sectionAnim('.skills__grid',  '.skills__card', { stagger: 0.12 })
  sectionAnim('.experience__list', '.experience__item', { x: -20, y: 0 })
  sectionAnim('.projects__header', '.projects__header')
  sectionAnim('.projects__grid',   '.project-card',  { stagger: 0.1 })
  sectionAnim('.contact',          '.contact__headline, .contact__body, .contact__email, .button', { stagger: 0.08 })
}

// ─────────────────────────────────────────────────
// RAF LOOP
// ─────────────────────────────────────────────────
let lastTime = performance.now()

function raf(time) {
  const now   = performance.now()
  const delta = Math.min((now - lastTime) / 1000, 0.05)
  lastTime    = now

  // Smooth scroll velocity for card bend
  const tv = isMobile ? 0 : scrollVelocity
  smoothedVelocity += (tv - smoothedVelocity) * 0.16

  // Sync card mesh positions with DOM
  updatePlaceholderMeshTransforms()

  // Raycaster for hover detection
  raycaster.setFromCamera(pointerNDC, camera)
  let hoveredMesh = null
  for (let i = 0; i < placeholderMeshes.length; i++) {
    if (raycaster.intersectObject(placeholderMeshes[i].mesh).length > 0) {
      hoveredMesh = placeholderMeshes[i].mesh; break
    }
  }

  placeholderMeshes.forEach(({ mesh }) => {
    mesh.material.uniforms.uVelocity.value       = smoothedVelocity
    const target = mesh === hoveredMesh ? 1.0 : 0.0
    mesh.material.uniforms.uHoverStrength.value +=
      (target - mesh.material.uniforms.uHoverStrength.value) * 0.1
    mesh.material.uniforms.uMouse.value.set(
      pointerNDC.x * 0.5 + 0.5,
      pointerNDC.y * 0.5 + 0.5,
    )
  })

  // Update & draw constellation into offscreen canvas, upload to GPU
  updateAndDrawConstellation(currentScroll)
  constellationTexture.needsUpdate = true

  // Plain render — no bloom, no composers
  renderer.render(scene, camera)

  requestAnimationFrame(raf)
}

// ─────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────
async function boot() {
  const preloaderDone = initPreloader()

  createPlaceholderMeshes()
  updatePlaceholderMeshTransforms()

  await preloaderDone

  initScrollAnimations()

  const cursor = initCursor()
  if (cursor) cursor.setupMagnetic()

  requestAnimationFrame(raf)
}

boot()