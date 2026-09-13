// Web Audio API procedural sound engine for 3D Console Portfolio
// Emulates classic retro handheld sound chip (pulse/square, triangle, noise)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private enabled = false;

  private init() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();

      // Dynamics compressor to prevent digital clipping while maximizing punch and clarity
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.08, this.ctx.currentTime);
      this.compressor.connect(this.ctx.destination);

      // Master gain node (enhanced volume)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      this.masterGain.connect(this.compressor);

      // Create 0.1s white noise buffer for mechanical switch / noise channel
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (val) {
      this.init();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public unlock() {
    this.init();
  }

  // 1. Snappy 8-bit D-pad cursor tick (menu item navigation)
  public move() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(580, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.038);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.042);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.045);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    this.mechanicalClick(0.1);
  }

  // 2. Bright ascending confirmation chime ('A' button / open / select)
  public confirm() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;

    // Note 1: C5 (523Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(523.25, t);
    gain1.gain.setValueAtTime(0.001, t);
    gain1.gain.linearRampToValueAtTime(0.32, t + 0.004);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.07);

    // Note 2: E5 (659Hz) - slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(659.25, t + 0.05);
    gain2.gain.setValueAtTime(0.001, t + 0.05);
    gain2.gain.linearRampToValueAtTime(0.35, t + 0.055);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(t + 0.05);
    osc2.stop(t + 0.17);

    osc2.onended = () => {
      osc1.disconnect();
      gain1.disconnect();
      osc2.disconnect();
      gain2.disconnect();
    };

    this.mechanicalClick(0.12);
  }

  // 3. Descending 2-tone cancel/back tone ('B' button)
  public back() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;

    // Note 1: D5 (587Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(587.33, t);
    gain1.gain.setValueAtTime(0.001, t);
    gain1.gain.linearRampToValueAtTime(0.3, t + 0.003);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.06);

    // Note 2: A4 (440Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(440, t + 0.045);
    gain2.gain.setValueAtTime(0.001, t + 0.045);
    gain2.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(t + 0.045);
    osc2.stop(t + 0.15);

    osc2.onended = () => {
      osc1.disconnect();
      gain1.disconnect();
      osc2.disconnect();
      gain2.disconnect();
    };

    this.mechanicalClick(0.12);
  }

  // 4. Clean mechanical option click (Select button / Shift / System settings)
  public select() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(620, t + 0.03);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.32, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.06);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    this.mechanicalClick(0.14);
  }

  // 5. Page turn chirp (Toolkit / Case study page cycles)
  public page() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.linearRampToValueAtTime(820, t + 0.04);
    osc.frequency.linearRampToValueAtTime(680, t + 0.075);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.095);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  // 6. Iconic retro handheld startup chime (crystal flourish upon booting)
  public boot() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    // Classic Game Boy style boot: crystal arpeggio
    const notes = [
      { freq: 1046.5, time: 0, dur: 0.18, vol: 0.32 },
      { freq: 2093.0, time: 0.14, dur: 0.55, vol: 0.45 },
    ];

    notes.forEach(({ freq, time, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + time);

      gain.gain.setValueAtTime(0.001, t + time);
      gain.gain.linearRampToValueAtTime(vol, t + time + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + time);
      osc.stop(t + time + dur + 0.02);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    });
  }

  // 7. Joyful 4-note victory / email copy fanfare (C5 -> E5 -> G5 -> C6)
  public success() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const step = 0.07;

    notes.forEach((freq, i) => {
      const startTime = t + i * step;
      const isLast = i === notes.length - 1;
      const duration = isLast ? 0.42 : 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(isLast ? 0.42 : 0.32, startTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    });
  }

  // 8. Toggled sound ON - friendly 3-note musical chirp
  public toggleOn() {
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const notes = [440, 659.25, 880]; // A4, E5, A5
    notes.forEach((freq, i) => {
      const startTime = t + i * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.38, startTime + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + (i === 2 ? 0.28 : 0.08));

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(startTime);
      osc.stop(startTime + 0.3);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    });
  }

  // 9. Toggled sound OFF - soft descending power-down chirp
  public toggleOff() {
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.1);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.32, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.13);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  // 10. Subtle tactile plastic microswitch click (adds physical realism to 3D buttons)
  public mechanicalClick(intensity = 0.1) {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain || !this.noiseBuffer) return;

    try {
      const t = ctx.currentTime;

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(1.8, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(intensity, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noiseNode.start(t);
      noiseNode.stop(t + 0.025);

      noiseNode.onended = () => {
        noiseNode.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
    } catch {
      // Ignore audio transient failure
    }
  }

  // 11. Subtle tab switch click for text edition
  public tab() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(450, t + 0.025);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.24, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.035);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }
}

export const soundEffects = new SoundEngine();
