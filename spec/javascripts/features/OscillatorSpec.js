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

  it("should have 3 oscillators each with a type and a frequency", function () {
    oscillator.connect();

    expect(oscillator.osc1.type).toEqual("sine");
    expect(oscillator.osc2.type).toEqual("square");
    expect(oscillator.osc3.type).toEqual("triangle");

    expect(parseFloat(oscillator.osc1.frequency.value.toFixed(2))).toEqual(initialFrequency);
    expect(parseFloat(oscillator.osc2.frequency.value.toFixed(3))).toEqual(initialFrequency / 2);
    expect(parseFloat(oscillator.osc3.frequency.value.toFixed(3))).toEqual(initialFrequency / 2);
  });

  it("should have 3 gain nodes each with a value", function () {
    oscillator.connect();

    expect(oscillator.osc1.type).toEqual("sine");
    expect(oscillator.osc2.type).toEqual("square");
    expect(oscillator.osc3.type).toEqual("triangle");

    expect(parseFloat(oscillator.osc1.frequency.value.toFixed(2))).toEqual(initialFrequency);
    expect(parseFloat(oscillator.osc2.frequency.value.toFixed(3))).toEqual(initialFrequency / 2);
    expect(parseFloat(oscillator.osc3.frequency.value.toFixed(3))).toEqual(initialFrequency / 2);
  });
});