var OscillatorController = function () {
};
OscillatorController.prototype = (function () {
  var createOscillators = function () {
    for (var i = 0; i < 13; i++) {
      var osc = new Oscillator(context, initialFrequency, initialVolume);
      oscillators.push(osc);
    }
  };

  var connectOscillators = function () {
    oscillators.forEach(function (osc) {
      osc.connect();
    });
  };

  var watchOscillatorWaves = function () {
    $('.oscillator-wave').change(function () {
      var wave = $(this).val();
      var id = Number(this.id);

      oscillators.forEach(function (osc) {
        osc.updateWave(id, wave);
      });
    });
  };

  var initialize = function () {
    createOscillators();
    connectOscillators();
    watchOscillatorWaves();
  };

  return {
    initialize: initialize
  };
}());