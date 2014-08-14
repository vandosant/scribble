function DrumMachine(context, frequency, wave, gainVal, sustain) {
  this.context = context;
  this.frequency = frequency;
  this.wave = wave;
  this.gainVal = gainVal;
  this.sustain = sustain;

}

DrumMachine.prototype.hit = function () {
  var drum = this.context.createOscillator();
  var node = this.context.createGain();
  var sustain = this.sustain;

  node.gain.value = this.gainVal;
  node.connect(this.context.destination);
  drum.connect(node);
  drum.frequency.value = this.frequency;
  drum.type = this.wave;
  drum.start(0);

  var fadeTimeout = setInterval(function () {
    if (node.gain.value > 0) {
      node.gain.value -= sustain;
    }
  }, 5);
};