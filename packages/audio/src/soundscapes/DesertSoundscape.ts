import * as Tone from 'tone'
import type { Soundscape } from '../types'

export class DesertSoundscape implements Soundscape {
  private synths: Tone.Synth[] = []
  private loops: Tone.Loop[] = []
  private volume: Tone.Volume
  private reverb: Tone.Reverb
  private filter: Tone.Filter
  private noise: Tone.Noise
  private lfo: Tone.LFO
  private started = false

  constructor() {
    this.volume = new Tone.Volume(-12).toDestination()
    this.reverb = new Tone.Reverb({
      decay: 5,
      wet: 0.4
    }).connect(this.volume)
    
    this.filter = new Tone.Filter({
      frequency: 600,
      type: 'lowpass',
      rolloff: -12
    }).connect(this.reverb)

    // Desert wind - low frequency noise with LFO
    this.noise = new Tone.Noise('brown')
    const noiseFilter = new Tone.Filter(400, 'lowpass')
    const noiseVolume = new Tone.Volume(-22)
    
    // LFO for wind gusts
    this.lfo = new Tone.LFO(0.08, -35, -15)
    this.lfo.connect(noiseVolume.volume)
    
    this.noise.chain(noiseFilter, noiseVolume, this.reverb)
  }

  async start(): Promise<void> {
    if (this.started) return
    await Tone.start()
    
    this.noise.start()
    this.lfo.start()
    this.createNightCrickets()
    this.createDistantCoyote()

    this.started = true
  }

  private createNightCrickets(): void {
    const cricketSynth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.001,
        decay: 0.02,
        sustain: 0,
        release: 0.02
      }
    }).connect(this.filter)

    this.synths.push(cricketSynth)

    // Cricket chirps
    const cricketLoop = new Tone.Loop((time) => {
      const numChirps = Math.floor(Math.random() * 4) + 2
      for (let i = 0; i < numChirps; i++) {
        cricketSynth.triggerAttackRelease('C6', '32n', time + i * 0.05, 0.08)
      }
    }, `${Math.random() * 4 + 2}s`)

    cricketLoop.start(0)
    this.loops.push(cricketLoop)
  }

  private createDistantCoyote(): void {
    const coyoteSynth = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.5,
        decay: 1,
        sustain: 0.3,
        release: 2
      }
    }).connect(this.filter)

    this.synths.push(coyoteSynth)

    // Distant coyote howls
    const coyoteLoop = new Tone.Loop((time) => {
      const notes = ['G3', 'A3', 'C4', 'D4']
      notes.forEach((note, i) => {
        coyoteSynth.triggerAttackRelease(note, '4n', time + i * 0.3, 0.1)
      })
    }, `${Math.random() * 60 + 90}s`)

    coyoteLoop.start(0)
    this.loops.push(coyoteLoop)
  }

  setVolume(volume: number): void {
    this.volume.volume.value = Tone.gainToDb(volume)
  }

  stop(): void {
    if (!this.started) return
    this.noise.stop()
    this.lfo.stop()
    this.loops.forEach(loop => loop.stop())
    this.synths.forEach(synth => synth.triggerRelease())
    this.started = false
  }

  dispose(): void {
    this.stop()
    this.loops.forEach(loop => loop.dispose())
    this.synths.forEach(synth => synth.dispose())
    this.noise.dispose()
    this.lfo.dispose()
    this.filter.dispose()
    this.reverb.dispose()
    this.volume.dispose()
  }
}
