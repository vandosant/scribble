function DrumMachine(context, frequency, wave, gainVal, sustain) {

  hit = function () {
    var drum1 = this.context.createOscillator(),
      node1 = this.context.createGain(),
      drum2 = this.context.createOscillator(),
      node2 = this.context.createGain(),
      sustain = this.sustain;

    node1.gain.value = this.gainVal;
    node1.connect(this.context.destination);
    drum1.connect(node1);
    drum1.frequency.value = this.frequency;
    drum1.type = this.wave;
    drum1.start(0);

    setInterval(function () {
      if (node1.gain.value > 0) {
        node1.gain.value -= sustain;
      } else {
        drum1.stop();
      }
    }, 5);

    node2.gain.value = this.gainVal * 0.8;
    node2.connect(this.context.destination);
    drum2.connect(node2);
    drum2.frequency.value = this.frequency;
    drum2.type = this.wave;
    drum2.start(0);

    setInterval(function () {
      if (node2.gain.value > 0) {
        node2.gain.value -= sustain * 2;
      } else {
        drum2.stop();
      }
    }, 5);
  };

  return {
    hit: hit,
    context: context,
    frequency: frequency,
    gainVal: gainVal,
    wave: wave,
    sustain: sustain
  }
}