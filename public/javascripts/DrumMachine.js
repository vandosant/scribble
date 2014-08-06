function DrumMachine(context, initialVolume) {
  this.volume = initialVolume;
  this.context = context;
  this.bassDrum = this.context.createOscillator();
  this.bassDrum.frequency.value = 16.35;
  this.bassNode = context.createGain();
  this.bassNode.gain.value = initialVolume;
}