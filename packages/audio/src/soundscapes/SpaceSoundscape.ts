import * as Tone from 'tone'
import type { Soundscape } from '../types'

export class SpaceSoundscape implements Soundscape {
  private synths: (Tone.Synth | Tone.PolySynth)[] = []
  private loops: Tone.Loop[] = []
  private volume: Tone.Volume
  private reverb: Tone.Reverb
  private delay: Tone.FeedbackDelay
  private chorus: Tone.Chorus
  private started = false

  constructor() {
    this.volume = new Tone.Volume(-10).toDestination()
    
    this.reverb = new Tone.Reverb({
      decay: 8,
      wet: 0.6
    }).connect(this.volume)
    
    this.delay = new Tone.FeedbackDelay({
      delayTime: '8n',
      feedback: 0.4,
      wet: 0.3
    }).connect(this.reverb)

    this.chorus = new Tone.Chorus({
      frequency: 0.5,
      delayTime: 3.5,
      depth: 0.7,
      wet: 0.5
    }).connect(this.delay)
  }

  async start(): Promise<void> {
    if (this.started) return
    await Tone.start()
    
    this.chorus.start()
    this.createAmbientPad()
    this.createStarTwinkles()
    this.createCosmicDrones()

    this.started = true
  }

  private createAmbientPad(): void {
    const padSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 4,
        decay: 2,
        sustain: 0.8,
        release: 6
      }
    }).connect(this.chorus)

    this.synths.push(padSynth)

    // Deep space ambient chords
    const padLoop = new Tone.Loop((time) => {
      const chords = [
        ['C3', 'E3', 'G3'],
        ['F3', 'A3', 'C4'],
        ['G3', 'B3', 'D4']
      ]
      const chord = chords[Math.floor(Math.random() * chords.length)]
      padSynth.triggerAttackRelease(chord, '4m', time, 0.2)
    }, '8m')

    padLoop.start(0)
    this.loops.push(padLoop)
  }

  private createStarTwinkles(): void {
    const twinkleSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.1,
        decay: 1,
        sustain: 0.2,
        release: 2
      }
    }).connect(this.delay)

    this.synths.push(twinkleSynth)

    // High frequency twinkles
    const twinkleLoop = new Tone.Loop((time) => {
      const notes = ['C6', 'E6', 'G6', 'A6', 'C7']
      const note = notes[Math.floor(Math.random() * notes.length)]
      twinkleSynth.triggerAttackRelease(note, '8n', time, 0.1)
    }, `${Math.random() * 3 + 2}s`)

    twinkleLoop.start(0)
    this.loops.push(twinkleLoop)
  }

  private createCosmicDrones(): void {
    const droneSynth = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 8,
        decay: 4,
        sustain: 0.9,
        release: 10
      }
    }).connect(this.chorus)

    this.synths.push(droneSynth)

    // Deep cosmic drones
    const droneLoop = new Tone.Loop((time) => {
      const notes = ['A1', 'C2', 'E2']
      const note = notes[Math.floor(Math.random() * notes.length)]
      droneSynth.triggerAttackRelease(note, '16m', time, 0.15)
    }, '20m')

    droneLoop.start(0)
    this.loops.push(droneLoop)
  }

  setVolume(volume: number): void {
    this.volume.volume.value = Tone.gainToDb(volume)
  }

  stop(): void {
    if (!this.started) return
    this.chorus.stop()
    this.loops.forEach(loop => loop.stop())
    this.synths.forEach(synth => {
      if (synth instanceof Tone.PolySynth) {
        synth.releaseAll()
      } else {
        synth.triggerRelease()
      }
    })
    this.started = false
  }

  dispose(): void {
    this.stop()
    this.loops.forEach(loop => loop.dispose())
    this.synths.forEach(synth => synth.dispose())
    this.chorus.dispose()
    this.delay.dispose()
    this.reverb.dispose()
    this.volume.dispose()
  }
}
