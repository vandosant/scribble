function Oscillator(context, frequency, volume) {
  this.context = context;
  this.osc1 = this.context.createOscillator();
  this.osc2 = this.context.createOscillator();
  this.osc3 = this.context.createOscillator();
  this.gainNode1 = context.createGain();
  this.gainNode2 = context.createGain();
  this.gainNode3 = context.createGain();
  this.frequency = frequency;
  this.volume = volume;
}

Oscillator.prototype.connect = function () {
  this.gainNode1.connect(this.context.destination);
  this.gainNode1.gain.value = this.volume;
  this.osc1.connect(this.gainNode1);
  this.osc1.type = "sine";
  this.osc1.frequency.value = this.frequency;
  this.osc1.start(0);

  this.gainNode2.connect(this.context.destination);
  this.gainNode2.gain.value = this.volume;
  this.osc2.connect(this.gainNode2);
  this.osc2.type = "sawtooth";
  this.osc2.frequency.value = this.frequency / 2;
  this.osc2.start(0);

  this.gainNode3.connect(this.context.destination);
  this.gainNode3.gain.value = this.volume * 0.8;
  this.osc3.connect(this.gainNode3);
  this.osc3.type = "square";
  this.osc3.frequency.value = this.frequency / 2;
  this.osc3.start(0);
};

Oscillator.prototype.disconnect = function () {
  this.osc1.disconnect();
  this.osc2.disconnect();
  this.osc3.disconnect();
};

Oscillator.prototype.updateVolume = function (value) {
  this.volume = value;
  this.gainNode1.gain.value = value;
  this.gainNode2.gain.value = value;
  this.gainNode3.gain.value = value * 0.8;
};

Oscillator.prototype.updateNote = function (value) {
  this.osc1.frequency.value = (value);
  this.osc2.frequency.value = (value) / 2;
  this.osc3.frequency.value = (value) / 2;
};