describe("OscillatorController", function () {
  it("should initialize", function() {
    var oscillator = OscillatorController({oscillators: [], initialVolume: 0, initialFrequency: 261.63});

    expect(typeof oscillator.initialize).toEqual("function");
  });
});