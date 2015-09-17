require('expose?$!expose?jQuery!jquery');
var context = require("./Context");
var keyboard = require("./Keyboard");
var oscillatorCtrl = require("./OscillatorController");
var drumController = require("./Drums");

var modes = {
  standard: ['sine', 'sine', 'triangle'],
  raspy: ['sine', 'square', 'sawtooth'],
  organ: ['sine', 'sine', 'sine'],
  game: ['square', 'sine', 'triangle']
};

$('.oscillator-mode').change(function () {
  var mode = $(this).val();
  oscillatorCtrl.update(modes[mode]);

  $('.oscillator-wave').each(function (oscSelector) {
    $(this).val(modes[mode][oscSelector])
  });
});

drumController.render();
drumController.selectDrum('#bass');
drumController.start('#drum-status');
drumController.listen('#tempo', '.drum-button', '.drum-type', '#drum-status', '.drum-volume');
