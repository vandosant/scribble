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
  })
});
