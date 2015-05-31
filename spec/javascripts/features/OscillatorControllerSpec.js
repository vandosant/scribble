describe("OscillatorController", function () {
  it("should initialize", function() {
    var oscillator = OscillatorController({oscillators: [], initialVolume: 0, initialFrequency: 261.63});

    expect(typeof oscillator.initialize).toEqual("function");
  });

  it("should create oscillators upon initialization", function() {
    context = new AudioContext();

    var oscillators = [];
    var oscillator = OscillatorController({oscillators: oscillators, initialVolume: 0, initialFrequency: 261.63});

    expect(oscillators.length).toBe(0);
    oscillator.initialize();
    expect(oscillators.length).toBeGreaterThan(0)
  });
});