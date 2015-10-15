var context = require("./Context");
var oscillator = require("./Oscillator");

function oscillatorController(options) {
  var oscillators = options['oscillators'] || [];
  var oscillatorSelector = options['oscillatorSelector'] || '.oscillator-wave';
  var initialFrequency = options['initialFrequency'] || 261.63;
  var initialVolume = options['initialVolume'] || 0;

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

  var updateWave = function (id, wave) {
    oscillators.forEach(function (osc) {
      osc.updateWave(id, wave);
    });
  };

  var initialize = function () {
    createOscillators();
    connectOscillators();
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
    updateWave: updateWave,
    oscillators: oscillators
  };
}

module.exports = oscillatorController;
