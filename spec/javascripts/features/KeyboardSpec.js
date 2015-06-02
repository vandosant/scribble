describe("Keyboard", function () {
  var keyboard;

  beforeEach(function () {
    keyboard = Keyboard({volumeSelector: ".test-selector"});
    keyboard.initialize();
  });

  it("should listen for keydown events", function () {
    spyOn(keyboard, "keydown");
    var keyDownEvent = jQuery.Event("keydown");
    keyDownEvent.keyCode = 65;
    $(document).trigger(keyDownEvent);

    expect(keyboard.keydown).toHaveBeenCalled();
  });

  it("should listen for keyup events", function () {
    spyOn(keyboard, "keyup");
    var keyUpEvent = jQuery.Event("keyup");
    keyUpEvent.keyCode = 65;
    $(document).trigger(keyUpEvent);

    expect(keyboard.keyup).toHaveBeenCalled();
  });

  it("should set a default volume on creation", function () {
    expect(keyboard.volume).toEqual(.25);
  });

  it("should accept a volume on creation", function () {
    keyboard = Keyboard({volume: .25});
    expect(keyboard.volume).toEqual(.25);
  });

  it("should accept a volume selector on creation", function () {
    keyboard = Keyboard({volumeSelector: ".test-selector"});
    expect(keyboard.volumeSelector).toEqual(".test-selector");
  });

  it("should update the volume", function () {
    var firstVolume = keyboard.volume;

    keyboard.updateVolume(65);

    var secondVolume = keyboard.volume;
    expect(secondVolume).toBeLessThan(firstVolume);
  })
});
