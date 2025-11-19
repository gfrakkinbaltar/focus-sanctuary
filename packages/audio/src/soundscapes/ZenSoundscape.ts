import * as Tone from 'tone'
import type { Soundscape } from '../types'

export class ZenSoundscape implements Soundscape {
  private synths: Tone.Synth[] = []
  private loops: Tone.Loop[] = []
  private volume: Tone.Volume
  private reverb: Tone.Reverb
  private filter: Tone.Filter
  private started = false

  constructor() {
    this.volume = new Tone.Volume(-14).toDestination()
    this.reverb = new Tone.Reverb({
      decay: 6,
      wet: 0.6
    }).connect(this.volume)
    
    this.filter = new Tone.Filter({
      frequency: 800,
      type: 'lowpass',
      rolloff: -12
    }).connect(this.reverb)
  }

  async start(): Promise<void> {
    if (this.started) return
    await Tone.start()
    
    this.createBambooChimes()
    this.createWaterBowl()
    this.createGentleStream()

    this.started = true
  }

  private createBambooChimes(): void {
    const chimeSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 3,
        sustain: 0,
        release: 3
      }
    }).connect(this.filter)

    this.synths.push(chimeSynth)

    // Gentle bamboo wind chimes
    const chimeLoop = new Tone.Loop((time) => {
      const pentatonic = ['D4', 'F4', 'G4', 'A4', 'C5', 'D5']
      const note = pentatonic[Math.floor(Math.random() * pentatonic.length)]
      chimeSynth.triggerAttackRelease(note, '2n', time, 0.3)
    }, `${Math.random() * 8 + 6}s`)

    chimeLoop.start(0)
    this.loops.push(chimeLoop)
  }

  private createWaterBowl(): void {
    const bowlSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.5,
        sustain: 0.1,
        release: 1
      }
    }).connect(this.filter)

    this.synths.push(bowlSynth)

    // Singing bowl meditative tones
    const bowlLoop = new Tone.Loop((time) => {
      const notes = ['C4', 'G4', 'C5']
      const note = notes[Math.floor(Math.random() * notes.length)]
      bowlSynth.triggerAttackRelease(note, '1m', time, 0.2)
    }, `${Math.random() * 20 + 40}s`)

    bowlLoop.start(0)
    this.loops.push(bowlLoop)
  }

  private createGentleStream(): void {
    const streamNoise = new Tone.Noise('pink')
    const streamFilter = new Tone.Filter(600, 'lowpass')
    const streamVolume = new Tone.Volume(-25)
    
    streamNoise.chain(streamFilter, streamVolume, this.reverb)
    streamNoise.start()

    // Water droplets
    const dropSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).connect(this.filter)

    this.synths.push(dropSynth)

    const dropLoop = new Tone.Loop((time) => {
      const notes = ['E5', 'G5', 'A5']
      const note = notes[Math.floor(Math.random() * notes.length)]
      dropSynth.triggerAttackRelease(note, '32n', time, 0.15)
    }, `${Math.random() * 2 + 2}s`)

    dropLoop.start(0)
    this.loops.push(dropLoop)
  }

  setVolume(volume: number): void {
    this.volume.volume.value = Tone.gainToDb(volume)
  }

  stop(): void {
    if (!this.started) return
    this.loops.forEach(loop => loop.stop())
    this.synths.forEach(synth => synth.triggerRelease())
    this.started = false
  }

  dispose(): void {
    this.stop()
    this.loops.forEach(loop => loop.dispose())
    this.synths.forEach(synth => synth.dispose())
    this.filter.dispose()
    this.reverb.dispose()
    this.volume.dispose()
  }
}
