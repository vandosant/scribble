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

    clearInterval(DrumController.interval);
    DrumController.interval = setInterval(function () {
      var activeDrumNodes = document.getElementsByClassName('drum-button-active');
      if (activeDrumNodes.length > 0) {
        for (var i = 0; i < activeDrumNodes.length; i++) {
          activeDrumNodes[i].classList.remove("drum-button-active");
        }
      }

      drums.forEach(function (drum) {
        drum.beats[node].el.classList.add('drum-button-active');
        if (drum.beats[node].selected === true) {
          drum[drum.identifier].machine.hit();
        }
      });

      if (node === 15) {
        node = 0;
      } else {
        node++;
      }
    }, parseTempo(this.tempo));

    var statusButton = document.getElementById(statusButtonId);
    var statusDiv = document.createElement('div');
    statusDiv.setAttribute('id', 'pause');
    statusButton.setAttribute('active', true);
    while (statusButton.firstChild) {
      statusButton.removeChild(statusButton.firstChild);
    }
    statusButton.appendChild(statusDiv);
  }

  function stop(statusButtonId) {
    clearInterval(DrumController.interval);
    var statusButton = document.getElementById(statusButtonId);
    var statusDiv = document.createElement("div")
    statusDiv.id = "play"
    statusButton.classList.remove('active')
    statusButton.classList.add('inactive');
    while (statusButton.firstChild) {
      statusButton.removeChild(statusButton.firstChild);
    }
    statusButton.appendChild(statusDiv);
    var container = document.getElementById(containerId);
    $(container).find('.drum-button-active').removeClass('drum-button-active');
  }

  function selectBeat(button) {
    var $button = $(button);
    $button.toggleClass('drum-button-selected');
    var index = $button.text() - 1;
    var type = $button.parent().attr('id').split('-')[1];
    if (!drums[type].beats[index].selected) {
      drums[type].beats[index].selected = true;
    }
  }

  function selectDrum(button) {
    var id = button.id;
    var drumTypes = document.getElementsByClassName('drum-type');
    for (var i = 0; i < drumTypes.length; i++) {
      drumTypes[i].classList.remove('drum-button-selected');
    }
    button.classList.add('drum-button-selected');

    drums.forEach(function (drum, key) {
      var drumEl = document.getElementById('drum-' + key);
      if (drum.identifier === id) {
        drumEl.setAttribute('visibility', 'visible');
        drumEl.setAttribute('height', '');
        drumEl.hidden = false;
      } else {
        drumEl.setAttribute('visibility', 'hidden');
        drumEl.hidden = true;
        drumEl.setAttribute('height', '0');
      }
    });
  }

  function setTempo(newTempo, statusSelectorId) {
    this.tempo = newTempo;
    var statusButton = document.getElementById(statusSelectorId);
    if (statusButton.getAttribute('active') === 'true') {
      var boundStart = start.bind(this);
      boundStart('drum-status');
    }
  }

  function setVolume(volumeModifier) {
    var that = this;
    $.each(that.drums, function (key, drum) {
      drum.machine.gainVal = that.startVolume * volumeModifier;
    });
  }

  function listen(tempoId, drumBeatClass, drumTypeClass, statusSelectorId, drumVolumeSelector) {
    var self = this;
    var tempoEl = document.getElementById(tempoId);
    tempoEl.addEventListener('change', function() {
      var boundSetTempo = setTempo.bind(self);
      boundSetTempo(parseInt(this.value), statusSelectorId);
    });

    var drumBeats = document.getElementsByClassName(drumBeatClass);
    for (var i = 0; i < drumBeats.length; i++) {
      drumBeats[i].addEventListener('click', function() {
        selectBeat(this);
      });
    }

    var drumTypes = document.getElementsByClassName(drumTypeClass);
    for (var i = 0; i < drumTypes.length; i++) {
      drumTypes[i].addEventListener('click', function() {
        selectDrum(this);
      });
    }

    var statusButton = document.getElementById(statusSelectorId);
    statusButton.addEventListener('click', function() {
      var el = this;
      if (el.getAttribute('active') === 'true') {
        el.setAttribute('active', false)
        stop(statusSelectorId);
      } else {
        var boundStart = start.bind(self);
        boundStart(statusSelectorId);
      }
    });

    $(drumVolumeSelector).change(function (e) {
      var volumeModifier = (this.value / 100);
      setVolume(volumeModifier);
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
