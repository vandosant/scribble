describe("drumMachine", function () {
  var contextClass = (window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext);
  var context = new contextClass();
  var initialVolume = 0.2;
  var drumMachineInstance;
  beforeEach(function () {
    drumMachineInstance = drumMachine({context: context, gainVal: initialVolume});
  });

  it("should have a context", function () {
    expect(drumMachineInstance.context).toEqual(context);
  });
});