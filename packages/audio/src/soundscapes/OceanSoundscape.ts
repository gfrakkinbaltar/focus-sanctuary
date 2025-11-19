import * as Tone from 'tone'
import type { Soundscape } from '../types'

export class OceanSoundscape implements Soundscape {
  private synths: (Tone.Synth | Tone.FMSynth)[] = []
  private loops: Tone.Loop[] = []
  private volume: Tone.Volume
  private reverb: Tone.Reverb
  private filter: Tone.Filter
  private waveNoise: Tone.Noise
  private started = false

  constructor() {
    this.volume = new Tone.Volume(-12).toDestination()
    this.reverb = new Tone.Reverb({
      decay: 6,
      wet: 0.5
    }).connect(this.volume)
    
    this.filter = new Tone.Filter({
      frequency: 600,
      type: 'lowpass',
      rolloff: -24
    }).connect(this.reverb)

    this.waveNoise = new Tone.Noise('brown')
    const waveFilter = new Tone.Filter(400, 'lowpass')
    const waveVolume = new Tone.Volume(-18)
    this.waveNoise.chain(waveFilter, waveVolume, this.reverb)
  }

  async start(): Promise<void> {
    if (this.started) return
    await Tone.start()
    
    this.waveNoise.start()
    this.createWaves()
    this.createDolphinCalls()
    this.createBubbles()
    this.createDeepRumble()
    
    this.started = true
  }

  private createWaves(): void {
    const waveSynth = new Tone.FMSynth({
      harmonicity: 0.5,
      modulationIndex: 2,
      envelope: {
        attack: 2,
        decay: 3,
        sustain: 0.1,
        release: 4
      }
    }).connect(this.filter)

    this.synths.push(waveSynth)

    const waveLoop = new Tone.Loop((time) => {
      waveSynth.triggerAttackRelease('A1', '4n', time, 0.15)
    }, `${Math.random() * 6 + 8}s`)

    waveLoop.start(0)
    this.loops.push(waveLoop)
  }

  private createDolphinCalls(): void {
    const dolphinSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.2,
        release: 0.5
      }
    }).connect(this.filter)

    this.synths.push(dolphinSynth)

    const dolphinLoop = new Tone.Loop((time) => {
      const notes = ['C5', 'E5', 'G5', 'C6']
      const pattern = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () =>
        notes[Math.floor(Math.random() * notes.length)]
      )
      
      pattern.forEach((note, i) => {
        dolphinSynth.triggerAttackRelease(note, '16n', time + i * 0.1, 0.08)
      })
    }, `${Math.random() * 15 + 20}s`)

    dolphinLoop.start(0)
    this.loops.push(dolphinLoop)
  }

  private createBubbles(): void {
    const bubbleSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.05,
        sustain: 0,
        release: 0.05
      }
    }).connect(this.filter)

    this.synths.push(bubbleSynth)

    const bubbleLoop = new Tone.Loop((time) => {
      const numBubbles = Math.floor(Math.random() * 5) + 2
      for (let i = 0; i < numBubbles; i++) {
        const note = ['C6', 'D6', 'E6', 'G6'][Math.floor(Math.random() * 4)]
        bubbleSynth.triggerAttackRelease(note, '32n', time + i * 0.08, 0.03)
      }
    }, `${Math.random() * 4 + 6}s`)

    bubbleLoop.start(0)
    this.loops.push(bubbleLoop)
  }

  private createDeepRumble(): void {
    const rumbleSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 4,
        decay: 2,
        sustain: 0.1,
        release: 5
      }
    }).connect(this.filter)

    this.synths.push(rumbleSynth)

    const rumbleLoop = new Tone.Loop((time) => {
      rumbleSynth.triggerAttackRelease('C1', '2n', time, 0.05)
    }, `${Math.random() * 20 + 30}s`)

    rumbleLoop.start(0)
    this.loops.push(rumbleLoop)
  }

  setVolume(volume: number): void {
    this.volume.volume.value = Tone.gainToDb(volume)
  }

  stop(): void {
    if (!this.started) return
    this.waveNoise.stop()
    this.loops.forEach(loop => loop.stop())
    this.synths.forEach(synth => synth.triggerRelease())
    this.started = false
  }

  dispose(): void {
    this.stop()
    this.loops.forEach(loop => loop.dispose())
    this.synths.forEach(synth => synth.dispose())
    this.waveNoise.dispose()
    this.filter.dispose()
    this.reverb.dispose()
    this.volume.dispose()
  }
}
