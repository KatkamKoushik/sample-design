/**
 * cursor.js
 * Custom magnetic cursor — dot + ring with state changes.
 * - "View" state expands ring when hovering .project-card
 * - Magnetic pull toward [data-magnetic] elements
 * - GSAP quickTo for buttery smooth lag
 */
import gsap from 'gsap'

export function initCursor() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return

  // ── Build DOM ────────────────────────────────────────────
  const dot  = document.createElement('div')
  const ring = document.createElement('div')
  dot.className  = 'cursor-dot'
  ring.className = 'cursor-ring'
  ring.innerHTML = '<span class="cursor-ring__label">View</span>'
  document.body.appendChild(dot)
  document.body.appendChild(ring)

  // ── GSAP quickTo setters ─────────────────────────────────
  const setDotX  = gsap.quickTo(dot,  'x', { duration: 0.12, ease: 'power2.out' })
  const setDotY  = gsap.quickTo(dot,  'y', { duration: 0.12, ease: 'power2.out' })
  const setRingX = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3.out' })
  const setRingY = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3.out' })

  // ── Mouse tracking ────────────────────────────────────────
  window.addEventListener('mousemove', (e) => {
    setDotX(e.clientX)
    setDotY(e.clientY)
    setRingX(e.clientX)
    setRingY(e.clientY)
  })

  // Hide when mouse leaves window
  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
  })
  document.addEventListener('mouseenter', () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
  })

  // ── State: VIEW on project cards ──────────────────────────
  function addCardListeners() {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('mouseenter', () => ring.classList.add('cursor-ring--view'))
      card.addEventListener('mouseleave', () => ring.classList.remove('cursor-ring--view'))
    })
  }
  // Cards may be injected later, so we use event delegation at body level
  document.body.addEventListener('mouseenter', (e) => {
    if (e.target.closest('.project-card')) {
      ring.classList.add('cursor-ring--view')
    }
  }, true)
  document.body.addEventListener('mouseleave', (e) => {
    if (e.target.closest('.project-card')) {
      ring.classList.remove('cursor-ring--view')
    }
  }, true)

  // ── State: shrink dot on clickable elements ───────────────
  const clickables = 'a, button, [data-magnetic]'
  document.body.addEventListener('mouseenter', (e) => {
    if (e.target.closest(clickables)) {
      gsap.to(dot, { scale: 0.4, duration: 0.2, ease: 'power2.out' })
      gsap.to(ring, { scale: 1.3, duration: 0.3, ease: 'power2.out' })
    }
  }, true)
  document.body.addEventListener('mouseleave', (e) => {
    if (e.target.closest(clickables)) {
      gsap.to(dot,  { scale: 1, duration: 0.25, ease: 'power2.out' })
      gsap.to(ring, { scale: 1, duration: 0.3,  ease: 'power2.out' })
    }
  }, true)

  // ── Magnetic pull on [data-magnetic] elements ─────────────
  function setupMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.35

      el.addEventListener('mousemove', (e) => {
        const rect   = el.getBoundingClientRect()
        const centerX = rect.left + rect.width  / 2
        const centerY = rect.top  + rect.height / 2
        const dx = e.clientX - centerX
        const dy = e.clientY - centerY

        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: 'power2.out',
        })
      })

      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
      })
    })
  }

  // Run once now for static elements, then again after DOM updates
  setupMagnetic()
  // Expose so main.js can call after project cards are injected
  return { setupMagnetic, addCardListeners }
}
