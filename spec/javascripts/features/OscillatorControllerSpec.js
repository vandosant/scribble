describe("OscillatorController", function () {
  it("should initialize", function() {
    var oscillator = new OscillatorController();

    expect(typeof oscillator.initialize).toEqual("function");
  });
});