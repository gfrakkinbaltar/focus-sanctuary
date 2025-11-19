import * as Tone from 'tone'
import type { Soundscape } from '../types'

export class RainSoundscape implements Soundscape {
  private synths: Tone.Synth[] = []
  private loops: Tone.Loop[] = []
  private volume: Tone.Volume
  private reverb: Tone.Reverb
  private filter: Tone.Filter
  private noise: Tone.Noise
  private started = false

  constructor() {
    this.volume = new Tone.Volume(-12).toDestination()
    this.reverb = new Tone.Reverb({
      decay: 2,
      wet: 0.4
    }).connect(this.volume)
    
    this.filter = new Tone.Filter({
      frequency: 2000,
      type: 'lowpass',
      rolloff: -12
    }).connect(this.reverb)

    // Rain noise
    this.noise = new Tone.Noise('white')
    const noiseFilter = new Tone.Filter(1500, 'lowpass')
    const noiseVolume = new Tone.Volume(-15)
    this.noise.chain(noiseFilter, noiseVolume, this.reverb)
  }

  async start(): Promise<void> {
    if (this.started) return
    await Tone.start()
    
    this.noise.start()
    this.createRaindrops()
    this.createThunder()

    this.started = true
  }

  private createRaindrops(): void {
    const dropSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.05,
        sustain: 0,
        release: 0.05
      }
    }).connect(this.filter)

    this.synths.push(dropSynth)

    // Individual raindrops
    const dropLoop = new Tone.Loop((time) => {
      const notes = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5']
      const note = notes[Math.floor(Math.random() * notes.length)]
      dropSynth.triggerAttackRelease(note, '32n', time, 0.1)
    }, '0.1s')

    dropLoop.start(0)
    this.loops.push(dropLoop)
  }

  private createThunder(): void {
    const thunderNoise = new Tone.Noise('brown')
    const thunderVolume = new Tone.Volume(-30)
    const thunderFilter = new Tone.Filter(200, 'lowpass')
    
    thunderNoise.chain(thunderFilter, thunderVolume, this.reverb)

    // Distant thunder rumbles
    const thunderLoop = new Tone.Loop((time) => {
      thunderNoise.start(time)
      thunderNoise.stop(time + 3)
    }, `${Math.random() * 30 + 40}s`)

    thunderLoop.start(0)
    this.loops.push(thunderLoop)
  }

  setVolume(volume: number): void {
    this.volume.volume.value = Tone.gainToDb(volume)
  }

  stop(): void {
    if (!this.started) return
    this.noise.stop()
    this.loops.forEach(loop => loop.stop())
    this.synths.forEach(synth => synth.triggerRelease())
    this.started = false
  }

  dispose(): void {
    this.stop()
    this.loops.forEach(loop => loop.dispose())
    this.synths.forEach(synth => synth.dispose())
    this.noise.dispose()
    this.filter.dispose()
    this.reverb.dispose()
    this.volume.dispose()
  }
}
