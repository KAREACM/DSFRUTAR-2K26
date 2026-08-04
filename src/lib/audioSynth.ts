/**
 * Procedural Audio Synthesizer for DISFRUTAR 2K26 AI OS Boot Experience.
 * Uses Web Audio API to generate low-frequency ambient hums, harmonic sweeps,
 * and elegant resonant pulses without external audio dependencies.
 */

class BootAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.4;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.4, this.ctx.currentTime);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public startAmbientHum() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      // Stop old ambient if running
      if (this.ambientOsc) {
        try { this.ambientOsc.stop(); } catch { /* ignore */ }
      }

      const now = this.ctx.currentTime;
      this.ambientOsc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(45, now);
      // Frequency subtle sweep
      this.ambientOsc.frequency.exponentialRampToValueAtTime(60, now + 4);
      this.ambientOsc.frequency.exponentialRampToValueAtTime(50, now + 8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);
      filter.frequency.linearRampToValueAtTime(250, now + 4);

      this.ambientGain.gain.setValueAtTime(0.01, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.2, now + 1.5);
      this.ambientGain.gain.linearRampToValueAtTime(0.05, now + 8);

      this.ambientOsc.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      this.ambientOsc.start(now);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  public triggerParticleActivation() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 1.2);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      /* ignore */
    }
  }

  public triggerLogoAssemblyStep(stepIndex: number) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pentatonic note sequence for logo steps
      const notes = [220, 277.18, 329.63, 440, 554.37];
      const freq = notes[stepIndex % notes.length];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.3);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      /* ignore */
    }
  }

  public triggerPulseHarmonic() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.8);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      /* ignore */
    }
  }

  public stopAll() {
    if (this.ambientOsc) {
      try { this.ambientOsc.stop(); } catch { /* ignore */ }
    }
  }
}

export const bootAudio = new BootAudioSynthesizer();
