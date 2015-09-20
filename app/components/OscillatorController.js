var context = require("./Context");
var oscillator = require("./Oscillator");

function oscillatorController(options) {
  this.oscillators = options['oscillators'] || [];
  var initialFrequency = options['initialFrequency'] || 261.63;
  var initialVolume = options['initialVolume'] || 0;
  this.oscillatorSelector = options['oscillatorSelector'] || '.oscillator-wave';

  var createOscillators = function () {
    for (var i = 0; i < 13; i++) {
      var osc = oscillator(context, initialFrequency, initialVolume);
      oscillators.push(osc);
    }
  };

  var connectOscillators = function () {
    oscillators.forEach(function (osc) {
      osc.connect();
    });
  };

  var watchOscillatorWaves = function () {
    $(oscillatorSelector).change(function () {
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

  var update = function (options) {
    var id = 1;
    options.forEach(function (wave) {
      oscillators.forEach(function (osc) {
        osc.updateWave(id, wave);
      });
      id++;
    });
  };

  return {
    initialize: initialize,
    update: update,
    oscillators: oscillators
  };
}

var oscillatorCtrl = oscillatorController({
  oscillators: [],
  initialVolume: 0,
  initialFrequency: 261.63,
  oscillatorSelector: '.oscillator-wave'
});
oscillatorCtrl.initialize();

module.exports = oscillatorCtrl;
