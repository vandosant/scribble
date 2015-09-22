var context = require("./Context");

function DrumController(drums, containerId, tempo, volume) {
  var container = document.getElementById(containerId);

  function render() {
    var container = document.getElementById(containerId);
    var typeContainer = document.createElement('div');
    typeContainer.setAttribute('class', 'drum-container');
    typeContainer.setAttribute('id', 'drum-types');
    container.appendChild(typeContainer);
    drums.forEach(function (drum, key) {
      drum.beats = [];
      var buttonContainer = document.createElement('div');
      buttonContainer.setAttribute('class', 'drum-container');
      buttonContainer.setAttribute('id', 'drum-' + key);
      for (var i = 0; i < 16; i++) {
        var beatEl = document.createElement('div');
        beatEl.setAttribute('class', 'drum-button');
        beatEl.textContent = i + 1;

        drum.beats.push({
          selected: false,
          el: beatEl
        });

        buttonContainer.appendChild(beatEl);
        if (i === 7) {
          buttonContainer.appendChild(document.createElement('br'));
        }
      }
      container.appendChild(buttonContainer);

      var typeButton = document.createElement('div');
      typeButton.setAttribute('class', 'drum-type');
      typeButton.setAttribute('id', drum.identifier);
      typeButton.textContent = drum.identifier;
      typeContainer.appendChild(typeButton);
    });
  }

  function parseTempo(tempo) {
    return (60 * 1000) / tempo;
  }

  function start(statusButtonId) {
    var node = 0;

    clearInterval(this.interval);
    this.interval = setInterval(function () {
      var activeDrumNodes = document.getElementsByClassName('drum-button-active');
      if (activeDrumNodes.length > 0) {
        for (var i = 0; i < activeDrumNodes.length; i++) {
            activeDrumNodes[i].classList.remove("drum-button-active");
        }
      }

      drums.forEach(function (drum, key) {
        drum.beats[node].el.classList.add('drum-button-active');
        if (drum.beats[node].el.getAttribute('selected') === true) {
          drum.machine.hit();
        }
      });

      if (node === 15) {
        node = 0;
      } else {
        node++;
      }

    }, parseTempo(that.tempo));

    var statusButton = document.getElementById(statusButtonId);
    var statusDiv = document.createElement('div');
    statusDiv.setAttribute('id', 'pause');
    statusButton.setAttribute('active', true);
    while (statusButton.firstChild) {
      statusButton.removeChild(element.firstChild);
    };
    statusButton.appendChild(statusDiv);
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
    var container = document.getElementById(containerId);
    var $button = document.getElementById(button);
    var id = $button.getAttribute('id');

    var drumTypes = document.getElementsByClassName('drum-type');
    for (var i = 0; i < drumTypes.length; i++) {
        drumTypes[i].classList.remove('drum-button-selected');
    }

    drums.forEach(function (drum, key) {
      if (key === id) {
        var drum = document.getElementById('drum-'+key);
        drum.setAttribute('visibility', 'visible');
        drum.setAttribute('height', '');
      } else {
        var drum = document.getElementById('drum-'+key);
        drum.setAttribute('visibility', 'hidden');
        drum.setAttribute('height', '0');
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

module.exports = DrumController;
