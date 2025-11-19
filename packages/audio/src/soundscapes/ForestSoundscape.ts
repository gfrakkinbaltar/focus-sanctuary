import * as Tone from 'tone'
import type { Soundscape } from '../types'

export class ForestSoundscape implements Soundscape {
  private synths: Tone.Synth[] = []
  private loops: Tone.Loop[] = []
  private volume: Tone.Volume
  private reverb: Tone.Reverb
  private filter: Tone.Filter
  private noise: Tone.Noise
  private started = false

  constructor() {
    // Create audio chain: synths -> filter -> reverb -> volume -> destination
    this.volume = new Tone.Volume(-10).toDestination()
    this.reverb = new Tone.Reverb({
      decay: 4,
      wet: 0.3
    }).connect(this.volume)
    
    this.filter = new Tone.Filter({
      frequency: 1000,
      type: 'lowpass',
      rolloff: -12
    }).connect(this.reverb)

    // Ambient forest noise (leaves rustling)
    this.noise = new Tone.Noise('pink')
    const noiseFilter = new Tone.Filter(800, 'lowpass')
    const noiseVolume = new Tone.Volume(-20)
    
    this.noise.chain(noiseFilter, noiseVolume, this.reverb)
  }

  async start(): Promise<void> {
    if (this.started) return

    await Tone.start()
    
    // Start ambient noise
    this.noise.start()

    // Bird chirps - random generative melodies
    this.createBirdChirps()

    // Gentle wind through trees
    this.createWindSounds()

    // Occasional cricket sounds
    this.createCricketSounds()

    this.started = true
  }

  private createBirdChirps(): void {
    const birdSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.05,
        release: 0.1
      }
    }).connect(this.filter)

    this.synths.push(birdSynth)

    // Random bird chirps
    const birdLoop = new Tone.Loop((time) => {
      const notes = ['C5', 'D5', 'E5', 'G5', 'A5']
      const numNotes = Math.floor(Math.random() * 3) + 2
      
      for (let i = 0; i < numNotes; i++) {
        const note = notes[Math.floor(Math.random() * notes.length)]
        const delay = i * 0.08
        birdSynth.triggerAttackRelease(note, '16n', time + delay)
      }
    }, `${Math.random() * 8 + 4}s`)

    birdLoop.start(0)
    this.loops.push(birdLoop)
  }

  private createWindSounds(): void {
    const windSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 2,
        decay: 1,
        sustain: 0.3,
        release: 3
      }
    }).connect(this.filter)

    this.synths.push(windSynth)

    // Gentle wind gusts
    const windLoop = new Tone.Loop((time) => {
      const notes = ['A2', 'B2', 'C3']
      const note = notes[Math.floor(Math.random() * notes.length)]
      windSynth.triggerAttackRelease(note, '2n', time, 0.1)
    }, `${Math.random() * 10 + 15}s`)

    windLoop.start(0)
    this.loops.push(windLoop)
  }

  private createCricketSounds(): void {
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
      const numChirps = Math.floor(Math.random() * 5) + 3
      for (let i = 0; i < numChirps; i++) {
        cricketSynth.triggerAttackRelease('C6', '32n', time + i * 0.05, 0.05)
      }
    }, `${Math.random() * 5 + 3}s`)

    cricketLoop.start(0)
    this.loops.push(cricketLoop)
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
