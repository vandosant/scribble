function oscillator(context, frequency, volume) {
  var osc1, osc2, osc3, gainNode1, gainNode2, gainNode3;
  osc1 = context.createOscillator();
  osc2 = context.createOscillator();
  osc3 = context.createOscillator();

  gainNode1 = context.createGain();
  gainNode2 = context.createGain();
  gainNode3 = context.createGain();

  function connect() {
    this.gainNode1.connect(this.context.destination);
    this.gainNode1.gain.value = this.volume;
    this.osc1.connect(this.gainNode1);
    this.osc1.type = "sine";
    this.osc1.frequency.value = this.frequency;
    this.osc1.start(0);

    this.gainNode2.connect(this.context.destination);
    this.gainNode2.gain.value = this.volume;
    this.osc2.connect(this.gainNode2);
    this.osc2.type = "sine";
    this.osc2.frequency.value = this.frequency / 2;
    this.osc2.start(0);

    this.gainNode3.connect(this.context.destination);
    this.gainNode3.gain.value = this.volume * 0.8;
    this.osc3.connect(this.gainNode3);
    this.osc3.type = "triangle";
    this.osc3.frequency.value = this.frequency / 2;
    this.osc3.start(0);
  }

  function disconnect() {
    this.osc1.disconnect();
    this.osc2.disconnect();
    this.osc3.disconnect();
  }

  function updateVolume(value) {
    this.volume = value;
    this.gainNode1.gain.value = value;
    this.gainNode2.gain.value = value;
    this.gainNode3.gain.value = value * 0.8;
  }

  function updateNote(value) {
    this.osc1.frequency.value = (value);
    this.osc2.frequency.value = (value) / 2;
    this.osc3.frequency.value = (value) / 2;
  }

  function updateWave(id, newWave) {
    if (id === 1) {
      this.osc1.type = newWave;
    } else if (id === 2) {
      this.osc2.type = newWave;
    } else if (id === 3) {
      this.osc3.type = newWave;
    }
  }

  return {
    context: context,
    osc1: osc1,
    osc2: osc2,
    osc3: osc3,
    gainNode1: gainNode1,
    gainNode2: gainNode2,
    gainNode3: gainNode3,
    frequency: frequency,
    volume: volume,
    connect: connect,
    disconnect: disconnect,
    updateVolume: updateVolume,
    updateNote: updateNote,
    updateWave: updateWave
  };
}

module.exports = oscillator;
