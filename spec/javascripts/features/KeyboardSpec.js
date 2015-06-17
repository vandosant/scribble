describe("keyboard", function () {
  var keyboardInstance;

  beforeEach(function () {
    keyboardInstance = keyboard({volumeSelector: ".test-selector"});
    keyboardInstance.initialize();
  });

  it("should listen for keydown events", function () {
    spyOn(keyboardInstance, "keydown");
    var keyDownEvent = jQuery.Event("keydown");
    keyDownEvent.keyCode = 65;
    $(document).trigger(keyDownEvent);

    expect(keyboardInstance.keydown).toHaveBeenCalled();
  });

  it("should listen for keyup events", function () {
    spyOn(keyboardInstance, "keyup");
    var keyUpEvent = jQuery.Event("keyup");
    keyUpEvent.keyCode = 65;
    $(document).trigger(keyUpEvent);

    expect(keyboardInstance.keyup).toHaveBeenCalled();
  });

  it("should set a default volume on creation", function () {
    expect(keyboardInstance.volume).toEqual(.25);
  });

  it("should accept a volume on creation", function () {
    keyboardInstance = keyboard({volume: .25});
    expect(keyboardInstance.volume).toEqual(.25);
  });

  it("should accept a volume selector on creation", function () {
    keyboardInstance = keyboard({volumeSelector: ".test-selector"});
    expect(keyboardInstance.volumeSelector).toEqual(".test-selector");
  });

  it("should update the volume", function () {
    var firstVolume = keyboardInstance.volume;

    keyboardInstance.updateVolume(65);

    var secondVolume = keyboardInstance.volume;
    expect(secondVolume).toBeLessThan(firstVolume);
  })
});
