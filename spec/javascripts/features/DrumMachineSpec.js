describe("DrumMachine", function () {
  var contextClass = (window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext);
  var context = new contextClass();
  var initialVolume = 0.2;

  beforeEach(function () {
    drumMachine = new DrumMachine(context, initialVolume);
  });

  it("should have a context", function () {
    expect(drumMachine.context).toEqual(context);
  });

  it("should have a volume", function () {
    expect(drumMachine.volume).toEqual(initialVolume);
  });

  it("should have a bass drum", function () {
    expect(round(drumMachine.bassDrum.frequency.value, 3)).toEqual(16.35);
    expect(round(drumMachine.bassNode.gain.value, 1)).toEqual(initialVolume);
  })

});