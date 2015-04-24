var OscillatorController = function (oscillators, initialFrequency, initialVolume) {
  this.oscillators = oscillators;
  this.initialFrequency = initialFrequency;
  this.initialVolume = initialVolume
};
OscillatorController.prototype = (function () {
  var createOscillators = function () {
    for (var i = 0; i < 13; i++) {
      var osc = new Oscillator(context, this.initialFrequency, this.initialVolume);
      this.oscillators.push(osc);
    }
  };

  var connectOscillators = function () {
    this.oscillators.forEach(function (osc) {
      osc.connect();
    });
  };

  var watchOscillatorWaves = function () {
    var that = this;
    $('.oscillator-wave').change(function () {
      var wave = $(this).val();
      var id = Number(this.id);
      that.oscillators.forEach(function (osc) {
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