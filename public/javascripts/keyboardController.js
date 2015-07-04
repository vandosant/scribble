function keyboardController() {
  function initialize(options) {
    if (options) {
      api.volumeSelector = options.volumeSelector;
    }

    api.keyboard = Object.create(keyboard());

    $(api.volumeSelector).change(function () {
      api.updateVolume(this.value);
    });
  }

  var api = {
    initialize: initialize
  };

  return api
}