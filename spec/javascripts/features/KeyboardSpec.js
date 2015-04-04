describe("Keyboard", function() {
  beforeEach(function () {
    var keyboard = new Keyboard();
  });

  it("should listen for keydown events", function(){
    var keyboard = new Keyboard();
    keyboard.listen();

    spyOn(keyboard, "keydown");
    var keyDownEvent = jQuery.Event("keydown");
    keyDownEvent.keyCode = 65;
    $(document).trigger(keyDownEvent);
    expect(keyboard.keydown).toHaveBeenCalled();
  });

  it("should listen for keyup events", function(){
    var keyboard = new Keyboard();
    keyboard.listen();

    spyOn(keyboard, "keyup");
    var keyUpEvent = jQuery.Event("keyup");
    keyUpEvent.keyCode = 65;
    $(document).trigger(keyUpEvent);
    expect(keyboard.keyup).toHaveBeenCalled();
  });
});
