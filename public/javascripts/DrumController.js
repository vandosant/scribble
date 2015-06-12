function DrumController(drums, container, tempo, volume) {
  this.drums = drums;
  this.container = $(container);
  this.tempo = tempo;
  this.startVolume = volume;

  var render = function () {
    var that = this,
      typeContainer = $('<div class="drum-container"></div>');

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

  };

  var parseTempo = function (tempo) {
    return (60 * 1000) / tempo;
  };

  var start = function (statusButton) {
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
  };

  var selectBeat = function (button) {
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
  };

  var selectDrum = function (button) {
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

  };

  var setTempo = function (newTempo) {
    this.tempo = newTempo;
    this.start();
  };

  var stop = function (statusButton) {
    var that = this;
    var $statusButton = $(statusButton),
      $statusDiv = $('<div id="play"></div>');
    clearInterval(this.interval);
    $statusButton.removeClass('active');
    $statusButton.addClass('inactive');
    $statusButton.children().remove();
    $statusButton.append($statusDiv);
    that.container.find('.drum-button-active').removeClass('drum-button-active');
  };

  var setVolume = function (volumeModifier) {
    var that = this;
    $.each(that.drums, function (key, drum) {
      drum.machine.gainVal = that.startVolume * volumeModifier;
    });
  };

  var listen = function (tempoSelector, beatSelector, drumSelector, statusSelector, drumVolumeSelector) {
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
  };

  return {
    drums: this.drums,
    container: this.container,
    tempo: this.tempo,
    startVolume: this.startVolume,
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
};