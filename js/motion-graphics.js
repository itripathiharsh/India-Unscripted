/**
 * India Unscripted — Motion Graphics, 3D Tilt & Interactive Canvas Engine
 * Built for bespoke luxury, zero AI-slop, responsive 60fps performance
 */

class MotionGraphicsEngine {
  constructor() {
    this.canvas = document.getElementById('heroCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 180 };
    this.animId = null;
    this.width = 0;
    this.height = 0;
  }

  init() {
    if (this.canvas && this.ctx) {
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      this.initParticles();
      this.bindMouse();
      this.animate();
    }
    this.init3DTilt();
    this.initCounters();
    this.initMagneticButtons();
    this.initFilmModeToggle();
    this.initMobileNavigation();
  }

  // Luxury Mobile Drawer Navigation
  initMobileNavigation() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const drawer = document.getElementById('mobileDrawer');
    const closeBtn = document.getElementById('mobileDrawerClose');

    if (!toggleBtn || !drawer) return;

    const openDrawer = () => {
      drawer.classList.add('active');
      toggleBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      drawer.classList.remove('active');
      toggleBtn.classList.remove('open');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', () => {
      if (drawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    // Close when clicking any link inside drawer
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });
  }

  // Film Mode Toggle for Hero Video
  initFilmModeToggle() {
    const toggleBtn = document.getElementById('filmModeToggle');
    const heroStage = document.getElementById('heroStage');
    const video = document.getElementById('heroBgVideo');
    const label = document.getElementById('filmModeLabel');

    if (!toggleBtn || !heroStage) return;

    let isFilmOn = true;

    toggleBtn.addEventListener('click', () => {
      isFilmOn = !isFilmOn;
      if (isFilmOn) {
        heroStage.classList.remove('film-mode-off');
        toggleBtn.classList.add('active');
        if (label) label.textContent = 'Film Motion: ON';
        if (video) video.play().catch(() => {});
      } else {
        heroStage.classList.add('film-mode-off');
        toggleBtn.classList.remove('active');
        if (label) label.textContent = 'Film Motion: OFF';
        if (video) video.pause();
      }
    });
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    this.width = this.canvas.width = parent.offsetWidth;
    this.height = this.canvas.height = parent.offsetHeight;
  }

  initParticles() {
    const count = Math.min(Math.floor((this.width * this.height) / 14000), 75);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.55 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  bindMouse() {
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw subtle ambient topographic waves
    this.drawTopoWaves();

    // 2. Update & Draw Particles with Proximity Lines
    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      const p = this.particles[i];

      // Natural drift
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse magnetic reaction
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 0.7;
        p.x -= (dx / dist) * force;
        p.y -= (dy / dist) * force;
      }

      // Draw particle star
      p.phase += p.pulseSpeed;
      const currentAlpha = p.alpha + Math.sin(p.phase) * 0.2;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0.1, currentAlpha)})`;
      this.ctx.shadowBlur = p.size > 2 ? 8 : 0;
      this.ctx.shadowColor = '#d4af37';
      this.ctx.fill();

      // Proximity connection filaments
      for (let j = i + 1; j < len; j++) {
        const p2 = this.particles[j];
        const pdist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (pdist < 110) {
          const lineAlpha = (1 - pdist / 110) * 0.18;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
          this.ctx.lineWidth = 0.7;
          this.ctx.stroke();
        }
      }
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }

  drawTopoWaves() {
    const time = Date.now() * 0.0006;
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.04)';
    this.ctx.lineWidth = 1;

    for (let j = 0; j < 3; j++) {
      this.ctx.beginPath();
      const baseY = this.height * 0.75 + j * 45;
      for (let x = 0; x <= this.width; x += 30) {
        const y = baseY + Math.sin(x * 0.003 + time + j) * 25 + Math.cos(x * 0.002 - time) * 15;
        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // 3D Perspective Tilt on Luxury Cards
  init3DTilt() {
    const cards = document.querySelectorAll('.tilt-card, .chapter-card, .dest-card');
    cards.forEach(card => {
      // Add specular shine element if not present
      let shine = card.querySelector('.card-shine-glare');
      if (!shine) {
        shine = document.createElement('div');
        shine.className = 'card-shine-glare';
        card.appendChild(shine);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

        // Move shine
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(212,175,55,0.18) 0%, transparent 60%)`;
        shine.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        shine.style.opacity = '0';
      });
    });
  }

  // Animated Numbers Counting
  initCounters() {
    const counters = document.querySelectorAll('.counter-num');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          const target = parseFloat(entry.target.dataset.target || 0);
          const isDecimal = entry.target.dataset.decimal === 'true';
          const duration = 1800;
          const start = performance.now();

          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            const current = target * ease;
            entry.target.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
            else entry.target.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
          };
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // Magnetic Button Spring
  initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.motionEngine = new MotionGraphicsEngine();
  window.motionEngine.init();
});
