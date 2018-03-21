export default function drumMachine ({ context, frequency, wave, gainVal, sustain, viz } = {}) {
  const hit = function () {
    const drum1 = this.context.createOscillator()
    const node1 = this.context.createGain()
    const sustain = this.sustain

    viz.connect(node1)
    node1.gain.value = this.gainVal
    node1.connect(this.context.destination)
    node1.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + (sustain + 1) / 40)
    drum1.connect(node1)
    drum1.frequency.setValueAtTime(this.frequency, context.currentTime)
    drum1.type = this.wave
    drum1.start(context.currentTime)
    drum1.stop(context.currentTime + (sustain + 1) / 40)
  }

  return {
    hit,
    context,
    frequency,
    gainVal,
    wave,
    sustain
  }
}
