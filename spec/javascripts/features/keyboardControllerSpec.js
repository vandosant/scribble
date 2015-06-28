describe("keyboardController", function () {
  var keyboardCtrl;

  beforeEach(function () {
    keyboardCtrl = keyboardController();
  });

  it("should initialize", function () {
    keyboardCtrl.initialize()
  });

  it("should initialize a keyboard", function () {
    expect(keyboardCtrl.keyboard).toEqual(undefined);
    keyboardCtrl.initialize({keyboard: {}});
    expect(keyboardCtrl.keyboard).toEqual({})
  });

  describe("volumeSelector", function () {
    it("should be undefined by default", function () {
      expect(keyboardCtrl.volumeSelector).toEqual(undefined)
    });

    it("should be configurable upon initialize", function () {
      expect(keyboardCtrl.volumeSelector).toEqual(undefined);
      keyboardCtrl.initialize({volumeSelector: "val"});
      expect(keyboardCtrl.volumeSelector).toEqual("val")
    });
  });
});