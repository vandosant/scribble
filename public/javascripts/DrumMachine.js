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
    } else {
      drum.stop();
    }
  }, 5);

  var drum1 = this.context.createOscillator();
  var node2 = this.context.createGain();
  var sustain1 = this.sustain;

  node2.gain.value = this.gainVal * 0.8;
  node2.connect(this.context.destination);
  drum1.connect(node2);
  drum1.frequency.value = this.frequency;
  drum1.type = this.wave;
  drum1.start(0);

  var fadeTimeout = setInterval(function () {
    if (node2.gain.value > 0) {
      node2.gain.value -= sustain1 * 2;
    } else {
      drum1.stop();
    }
  }, 5);
};