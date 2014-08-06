function DrumMachine(context, initialVolume) {
  this.context = context;
  this.bassDrum = this.context.createOscillator();
  this.bassNode = context.createGain();
  this.bassNode.gain.value = initialVolume;
  this.volume = initialVolume;
}

DrumMachine.prototype.bassKick = function() {
  this.bassNode.gain.value = 0.8;
  this.bassNode.connect(this.context.destination);
  this.bassDrum.connect(this.bassNode);
  this.bassDrum.frequency.value = 52;
  this.bassDrum.type = "sine";
  this.bassDrum.start(0);
};