var context = require("./Context");

function drumMachine(options) {
  var context, frequency, wave, gainVal, sustain;
  context = options['context'];
  frequency = options['frequency'];
  wave = options['wave'];
  gainVal = options['gainVal'];
  sustain = options['sustain'];

  var hit = function () {
    var drum1 = this.context.createOscillator(),
      node1 = this.context.createGain(),
      drum2 = this.context.createOscillator(),
      node2 = this.context.createGain(),
      sustain = this.sustain;

    node1.gain.value = this.gainVal;
    node1.connect(this.context.destination);
    drum1.connect(node1);
    drum1.frequency.value = this.frequency;
    drum1.type = this.wave;
    drum1.start(0);

    setInterval(function () {
      if (node1.gain.value > 0) {
        node1.gain.value -= sustain;
      } else {
        drum1.stop();
      }
    }, 5);

    node2.gain.value = this.gainVal * 0.8;
    node2.connect(this.context.destination);
    drum2.connect(node2);
    drum2.frequency.value = this.frequency;
    drum2.type = this.wave;
    drum2.start(0);

    setInterval(function () {
      if (node2.gain.value > 0) {
        node2.gain.value -= sustain * 2;
      } else {
        drum2.stop();
      }
    }, 5);
  };

  return {
    hit: hit,
    context: context,
    frequency: frequency,
    gainVal: gainVal,
    wave: wave,
    sustain: sustain
  }
}

function DrumController(drums, containerId, tempo, volume) {
  var container = $(containerId);
  function render() {
    var that = this;
    var typeContainer = $('<div class="drum-container"></div>');

    typeContainer.attr('id', 'drum-types');
    $.each(that.drums, function (key, drum) {
      drum.beats = [];
      var buttonContainer = $('<div class="drum-container"></div>');
      buttonContainer.attr('id', 'drum-' + key);
      for (var i = 0; i < 16; i++) {
        var beatEl = $('<div class="drum-button">' + (i + 1) + '</div>');

        drum.beats.push({
          selected: false,
          el: beatEl
        });
        buttonContainer.append(beatEl);
        if (i === 7) {
          buttonContainer.append('<br>');
        }
      }
      that.container.append(buttonContainer);

      var typeButton = $('<div class="drum-type">' + key + '</div>');
      typeButton.attr('id', key);
      typeContainer.append(typeButton);

    });
    that.container.append(typeContainer);
  }

  function parseTempo(tempo) {
    return (60 * 1000) / tempo;
  }

  function start(statusButton) {
    var that = this,
      node = 0;

    clearInterval(this.interval);
    this.interval = setInterval(function () {
      that.container.find('.drum-button-active').removeClass('drum-button-active');
      $.each(that.drums, function (key, drum) {
        drum.beats[node].el.addClass('drum-button-active');
        if (drum.beats[node].selected === true) {
          drum.machine.hit();
        }
      });

      if (node === 15) {
        node = 0;
      } else {
        node++;
      }

    }, parseTempo(that.tempo));

    var $statusButton = $(statusButton),
      $statusDiv = $('<div id="pause"></div>');
    $statusButton.addClass('active');
    $statusButton.children().remove();
    $statusButton.append($statusDiv);
  }

  function selectBeat(button) {
    var that = this;
    var $button = $(button);
    $button.toggleClass('drum-button-selected');
    var index = $button.text() - 1;
    var type = $button.parent().attr('id').split('-')[1];
    if (that.drums[type].beats[index].selected) {
      that.drums[type].beats[index].selected = false;
    } else {
      that.drums[type].beats[index].selected = true;
    }
  }

  function selectDrum(button) {
    var that = this,
      $button = $(button),
      id = $button.attr('id');

    $button.parent().find('.drum-type').removeClass('drum-button-selected');
    $button.addClass('drum-button-selected');

    $.each(that.drums, function (key, drum) {
      if (key === id) {
        that.container.find('#drum-' + key).css('visibility', 'visible');
        that.container.find('#drum-' + key).css('height', '');
      } else {
        that.container.find('#drum-' + key).css('visibility', 'hidden');
        that.container.find('#drum-' + key).css('height', '0');
      }
    });

  }

  function setTempo(newTempo) {
    this.tempo = newTempo;
    this.start();
  }

  function stop(statusButton) {
    var that = this;
    var $statusButton = $(statusButton),
      $statusDiv = $('<div id="play"></div>');
    clearInterval(this.interval);
    $statusButton.removeClass('active');
    $statusButton.addClass('inactive');
    $statusButton.children().remove();
    $statusButton.append($statusDiv);
    that.container.find('.drum-button-active').removeClass('drum-button-active');
  }

  function setVolume(volumeModifier) {
    var that = this;
    $.each(that.drums, function (key, drum) {
      drum.machine.gainVal = that.startVolume * volumeModifier;
    });
  }

  function listen(tempoSelector, beatSelector, drumSelector, statusSelector, drumVolumeSelector) {
    $(tempoSelector).change(function () {
      drumController.setTempo($(this).val());
    });

    $(beatSelector).click(function () {
      drumController.selectBeat(this);
    });

    $(drumSelector).click(function () {
      drumController.selectDrum(this);
    });

    $(statusSelector).click(function () {
      var $this = $(this);
      if ($this.hasClass('active') === true) {
        drumController.stop(statusSelector);
      } else {
        drumController.start(statusSelector);
      }
    });

    $(drumVolumeSelector).change(function (e) {
      var volumeModifier = (this.value / 100);
      drumController.setVolume(volumeModifier);
    });
  }

  return {
    drums: drums,
    container: container,
    tempo: tempo,
    startVolume: volume,
    render: render,
    parseTempo: parseTempo,
    start: start,
    stop: stop,
    selectBeat: selectBeat,
    selectDrum: selectDrum,
    setTempo: setTempo,
    setVolume: setVolume,
    listen: listen
  }
}

var drumVol = 1.3;
var drums = {
  'bass': {
    'machine': drumMachine({context: context, frequency: 47, wave: 'sine', gainVal: drumVol, sustain: 0.03})
  },
  'tom1': {
    'machine': drumMachine({context: context, frequency: 64, wave: 'sine', gainVal: drumVol, sustain: 0.05})
  },
  'tom2': {
    'machine': drumMachine({context: context, frequency: 160, wave: 'sine', gainVal: drumVol, sustain: 0.05})
  },
  'snare': {
    'machine': drumMachine({context: context, frequency: 188, wave: 'sine', gainVal: drumVol, sustain: 0.07})
  },
  'pad': {
    'machine': drumMachine({context: context, frequency: 261.63, wave: 'triangle', gainVal: drumVol, sustain: 0.02})
  }
};

module.exports = DrumController(drums, '#drums', 180, drumVol);;