function DrumController(drums, container, tempo) {
  this.drums = drums;
  this.container = $(container);
  this.tempo = tempo
}

DrumController.prototype.render = function () {

  var that = this;
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
  });

};

DrumController.parseTempo = function (tempo) {
  return (60 * 1000) / tempo;
};

DrumController.prototype.start = function () {
  var that = this;
  var node = 0;
  clearInterval(this.interval);
  this.interval = setInterval(function () {
    that.container.find('.drum-button-active').removeClass('drum-button-active');
    $.each(this.drums, function (key, drum) {
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
//  console.log(button)
};

DrumController.prototype.setTempo = function (tempo) {
  this.tempo = tempo;
  this.start();
};