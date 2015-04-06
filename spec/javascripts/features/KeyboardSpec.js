describe("Keyboard", function() {
  var keyboard;

  beforeEach(function () {
    keyboard = new Keyboard();
  });

  it("should listen for keydown events", function(){
    keyboard.initialize();

    spyOn(keyboard, "keydown");
    var keyDownEvent = jQuery.Event("keydown");
    keyDownEvent.keyCode = 65;
    $(document).trigger(keyDownEvent);

    expect(keyboard.keydown).toHaveBeenCalled();
  });

  it("should listen for keyup events", function(){
    keyboard.initialize();

    spyOn(keyboard, "keyup");
    var keyUpEvent = jQuery.Event("keyup");
    keyUpEvent.keyCode = 65;
    $(document).trigger(keyUpEvent);

    expect(keyboard.keyup).toHaveBeenCalled();
  });

  it("should set a default volume on creation", function() {
    keyboard = new Keyboard();
    expect(keyboard.volume).toEqual(.25);
  });

  it("should accept a volume on creation", function() {
    keyboard = new Keyboard({volume: .25});
    expect(keyboard.volume).toEqual(.25);
  });

  it("should accept a volume selector on creation", function() {
    keyboard = new Keyboard({volumeSelector: ".test-selector"});
    expect(keyboard.volumeSelector).toEqual(".test-selector");
  });

  xit("should update the volume", function() {
    keyboard = new Keyboard({volumeSelector: ".test-selector"});
    keyboard.initialize();

    var firstVolume = keyboard.volume;

    var volumeEvent = jQuery.Event("change");
    $(keyboard.volumeSelector).val(65).trigger(volumeEvent);

    var secondVolume = keyboard.volume;
    expect(secondVolume).toBeLessThan(firstVolume);
  })
});
