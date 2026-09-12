// Web Audio API procedural sound engine for 3D Console Portfolio
// Emulates classic retro handheld sound chip (pulse/square, triangle, noise)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private enabled = false;

  private init() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();

      // Master gain node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

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
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.032);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.04);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    this.mechanicalClick(0.03);
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
    gain1.gain.linearRampToValueAtTime(0.09, t + 0.004);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.06);

    // Note 2: E5 (659Hz) - slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(659.25, t + 0.045);
    gain2.gain.setValueAtTime(0.001, t + 0.045);
    gain2.gain.linearRampToValueAtTime(0.1, t + 0.05);
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

    this.mechanicalClick(0.04);
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
    gain1.gain.linearRampToValueAtTime(0.08, t + 0.003);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.05);

    // Note 2: A4 (440Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(440, t + 0.04);
    gain2.gain.setValueAtTime(0.001, t + 0.04);
    gain2.gain.linearRampToValueAtTime(0.08, t + 0.044);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(t + 0.04);
    osc2.stop(t + 0.13);

    osc2.onended = () => {
      osc1.disconnect();
      gain1.disconnect();
      osc2.disconnect();
      gain2.disconnect();
    };

    this.mechanicalClick(0.04);
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
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.025);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.05);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    this.mechanicalClick(0.05);
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
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.linearRampToValueAtTime(780, t + 0.035);
    osc.frequency.linearRampToValueAtTime(620, t + 0.065);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.08);

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
      { freq: 1046.5, time: 0, dur: 0.16, vol: 0.09 },
      { freq: 2093.0, time: 0.12, dur: 0.45, vol: 0.13 },
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
    const step = 0.065;

    notes.forEach((freq, i) => {
      const startTime = t + i * step;
      const isLast = i === notes.length - 1;
      const duration = isLast ? 0.35 : 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(isLast ? 0.12 : 0.08, startTime + 0.005);
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
      const startTime = t + i * 0.055;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + (i === 2 ? 0.22 : 0.06));

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(startTime);
      osc.stop(startTime + 0.25);

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
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.09);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.11);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  // 10. Subtle tactile plastic microswitch click (adds physical realism to 3D buttons)
  public mechanicalClick(intensity = 0.04) {
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
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noiseNode.start(t);
      noiseNode.stop(t + 0.02);

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
    osc.frequency.exponentialRampToValueAtTime(450, t + 0.02);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.03);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }
}

export const soundEffects = new SoundEngine();
