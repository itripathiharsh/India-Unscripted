/**
 * India Unscripted — Ambient Procedural Soundscape Generator
 * Generates subtle, non-intrusive organic atmospheres using the Web Audio API:
 * 1. Morning Ghats: Soft 108Hz harmonic hum, warm drone, distant brass bell shimmer
 * 2. Monsoon Mist: Filtered organic rain on leaves and calm water ripple
 * Zero external audio files required — completely self-contained and instant.
 */

class AmbientSoundscape {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.mode = 'temple'; // 'temple' | 'monsoon'
    this.masterGain = null;
    this.nodes = [];
    this.bellTimer = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  play() {
    if (!this.ctx) this.init();
    this.isPlaying = true;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + 2.5);

    if (this.mode === 'temple') {
      this.startTempleDrone();
    } else {
      this.startMonsoon();
    }
  }

  stop() {
    if (!this.ctx || !this.isPlaying) return;
    this.isPlaying = false;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
    setTimeout(() => {
      this.cleanupNodes();
    }, 1300);
  }

  cleanupNodes() {
    if (this.bellTimer) {
      clearInterval(this.bellTimer);
      this.bellTimer = null;
    }
    this.nodes.forEach(n => {
      try { n.stop(); n.disconnect(); } catch (e) {}
    });
    this.nodes = [];
  }

  startTempleDrone() {
    this.cleanupNodes();
    const now = this.ctx.currentTime;

    // Fundamental warm drone at 108Hz (Sacred Om harmonic frequency)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(108, now);

    // Warm fifth harmonic at 162Hz
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(162, now);

    // Sub-octave at 54Hz for deep chest resonance
    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(54, now);

    // Filter for mellow antique tone
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    // Subtle LFO for breathing warmth
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, now); // ~12 second breath cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.08, now);
    lfo.connect(lfoGain);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.12, now);
    lfoGain.connect(droneGain.gain);

    osc1.connect(filter);
    osc2.connect(filter);
    sub.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    sub.start();
    lfo.start();
    this.nodes.push(osc1, osc2, sub, lfo);

    // Occasional subtle distant bell chime every 18-28 seconds
    const chimeBell = () => {
      if (!this.isPlaying || this.mode !== 'temple') return;
      const t = this.ctx.currentTime;
      const bell = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bell.type = 'sine';
      // High harmonic chime
      bell.frequency.setValueAtTime(864, t);
      bell.frequency.exponentialRampToValueAtTime(858, t + 4.0);

      bGain.gain.setValueAtTime(0.001, t);
      bGain.gain.linearRampToValueAtTime(0.06, t + 0.05);
      bGain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);

      bell.connect(bGain);
      bGain.connect(this.masterGain);
      bell.start(t);
      bell.stop(t + 4.6);
    };

    this.bellTimer = setInterval(() => {
      if (Math.random() > 0.35) chimeBell();
    }, 22000);
  }

  startMonsoon() {
    this.cleanupNodes();
    // Pink noise generator for gentle monsoon rain
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.nodes.push(noise);
  }

  switchMode(newMode) {
    this.mode = newMode;
    if (this.isPlaying) {
      this.play();
    }
  }
}

window.soundscape = new AmbientSoundscape();

