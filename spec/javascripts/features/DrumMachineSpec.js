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
});