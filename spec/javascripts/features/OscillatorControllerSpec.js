import oscillatorController from '../../../app/components/OscillatorController.js';

describe("OscillatorController", function () {
  it("should initialize", function() {
    var oscillatorCtrl = oscillatorController({oscillators: [], initialVolume: 0, initialFrequency: 261.63});

    expect(typeof oscillatorCtrl.initialize).toEqual("function");
  });

  it("should create oscillators upon initialization", function() {
    var oscillators = [];
    var oscillatorCtrl = oscillatorController({oscillators: oscillators, initialVolume: 0, initialFrequency: 261.63});

    expect(oscillators.length).toBe(0);
    oscillatorCtrl.initialize();
    expect(oscillators.length).toBeGreaterThan(0)
  });
});