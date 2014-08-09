describe("Oscillator", function () {
  var contextClass = (window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext);
  var context = new contextClass();
  var oscillator;
  var initialFrequency = 261.63;
  var initialVolume = 0.2;

  beforeEach(function () {
    oscillator = new Oscillator(context, initialFrequency, initialVolume);
  });

  it("should have a frequency", function() {
    expect(oscillator.frequency).toEqual(initialFrequency);
  });

  it("should have a volume", function() {
    expect(oscillator.volume).toEqual(initialVolume);
  });

  it("should have a context", function() {
    expect(oscillator.context).toEqual(context);
  });

  it("should have 3 oscillators each with a type and a frequency when connected", function () {
    oscillator.connect();

    expect(oscillator.osc1.type).toEqual("sine");
    expect(oscillator.osc2.type).toEqual("sawtooth");
    expect(oscillator.osc3.type).toEqual("square");

    expect(round(oscillator.osc1.frequency.value, 3)).toEqual(initialFrequency);
    expect(round(oscillator.osc2.frequency.value, 3)).toEqual(initialFrequency / 2);
    expect(round(oscillator.osc3.frequency.value, 3)).toEqual(initialFrequency / 2);
  });

  it("should have 3 gain nodes each with a value when connected", function () {
    oscillator.connect();

    expect(round(oscillator.gainNode1.gain.value, 1)).toEqual(0.2);
    expect(round(oscillator.gainNode2.gain.value, 1)).toEqual(0.2);
    expect(round(oscillator.gainNode3.gain.value, 1)).toEqual(0.2);
  });

  it("should allow its note to be updated", function() {
    oscillator.connect();

    var newNote = 440.00;
    oscillator.updateNote(newNote);

    expect(oscillator.osc1.frequency.value).toEqual(newNote);
    expect(oscillator.osc2.frequency.value).toEqual(newNote / 2);
    expect(oscillator.osc3.frequency.value).toEqual(newNote / 2);
  });

  it("should allow its volume to be updated", function() {
    oscillator.connect();

    var newVolume = 0.5;
    oscillator.updateVolume(newVolume);

    expect(round(oscillator.gainNode1.gain.value, 2)).toEqual(newVolume);
    expect(round(oscillator.gainNode2.gain.value, 2)).toEqual(newVolume);
    expect(round(oscillator.gainNode3.gain.value, 2)).toEqual((newVolume) * 0.8);
  });
});