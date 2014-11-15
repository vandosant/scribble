function DrumController(drums, container, tempo, volume) {
  this.drums = drums;
  this.container = $(container);
  this.tempo = tempo;
  this.startVolume = volume;
}

DrumController.prototype.render = function () {
  var that = this,
    typeContainer = $('<div class="drum-container"></div>');

  typeContainer.attr('id', 'drum-types');

  $.each(this.drums, function (key, drum) {
    drum['beats'] = [];
    var buttonContainer = $('<div class="drum-container"></div>');
    buttonContainer.attr('id', 'drum-' + key);
    for (var i = 0; i < 16; i++) {
      var beatEl = $('<div class="drum-button">' + (i + 1) + '</div>');

      drum['beats'].push({
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

DrumController.parseTempo = function (tempo) {
  return (60 * 1000) / tempo;
};

DrumController.prototype.start = function (statusButton) {
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

  }, DrumController.parseTempo(this.tempo));

  var $statusButton = $(statusButton),
    $statusDiv = $('<div id="pause"></div>');
  $statusButton.addClass('active');
  $statusButton.children().remove();
  $statusButton.append($statusDiv);
};

DrumController.prototype.selectBeat = function (button) {
  var $button = $(button);
  $button.toggleClass('drum-button-selected');
  var index = $button.text() - 1;
  var type = $button.parent().attr('id').split('-')[1];
  if (this.drums[type].beats[index].selected == true) {
    this.drums[type].beats[index].selected = false;
  } else {
    this.drums[type].beats[index].selected = true;
  }
};

DrumController.prototype.selectDrum = function (button) {
  var that = this,
    $button = $(button),
    id = $button.attr('id');

  $button.parent().find('.drum-type').removeClass('drum-button-selected');
  $button.addClass('drum-button-selected');

  $.each(this.drums, function (key, drum) {
    if (key === id) {
      that.container.find('#drum-' + key).css('visibility', 'visible');
      that.container.find('#drum-' + key).css('height', '');
    } else {
      that.container.find('#drum-' + key).css('visibility', 'hidden');
      that.container.find('#drum-' + key).css('height', '0');
    }
  });

};

DrumController.prototype.setTempo = function (tempo) {
  this.tempo = tempo;
  this.start();
};

DrumController.prototype.stop = function (statusButton) {
  var $statusButton = $(statusButton),
    $statusDiv = $('<div id="play"></div>');
  clearInterval(this.interval);
  $statusButton.removeClass('active');
  $statusButton.addClass('inactive');
  $statusButton.children().remove();
  $statusButton.append($statusDiv);
  this.container.find('.drum-button-active').removeClass('drum-button-active');
};

DrumController.prototype.setVolume = function (volumeModifier) {
  var that = this;
  $.each(this.drums, function (key, drum) {
    drum.machine.gainVal = that.startVolume * volumeModifier;
  });
};