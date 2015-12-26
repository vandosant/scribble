import context from "./Context";

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
        beatEl.textContent = (i + 1).toString();

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
    var maxNodes = 15;
    clearInterval(DrumController.interval);
    DrumController.interval = setInterval(function () {
      var activeDrumNodes = document.getElementsByClassName('drum-button-active');
      if (activeDrumNodes.length > 0) {
        for (var i = 0; i < activeDrumNodes.length; i++) {
          activeDrumNodes[i].classList.remove("drum-button-active");
        }
      }
      drums.forEach(function (drum) {
        if (node === 0) {
          drum.beats[maxNodes].el.classList.remove('drum-button-active');
        } else {
          drum.beats[node - 1].el.classList.remove('drum-button-active');
        }
        drum.beats[node].el.classList.add('drum-button-active');
        if (drum.beats[node].selected === true) {
          drum[drum.identifier].machine.hit();
        }
      });

      if (node === maxNodes) {
        node = 0;
      } else {
        node++;
      }
    }, parseTempo(this.tempo));

    var statusButton = document.getElementById(statusButtonId);
    var statusDiv = document.createElement('div');
    statusDiv.setAttribute('id', 'pause');
    statusButton.setAttribute('active', 'true');
    while (statusButton.firstChild) {
      statusButton.removeChild(statusButton.firstChild);
    }
    statusButton.appendChild(statusDiv);
  }

  function stop(statusButtonId) {
    clearInterval(DrumController.interval);
    var statusButton = document.getElementById(statusButtonId);
    var statusDiv = document.createElement("div");
    statusDiv.id = "play";
    statusButton.classList.remove('active');
    statusButton.classList.add('inactive');
    while (statusButton.firstChild) {
      statusButton.removeChild(statusButton.firstChild);
    }
    statusButton.appendChild(statusDiv);
  }

  function selectBeat(button) {
    button.classList.add('drum-button-selected');
    var index = parseInt(button.innerText) - 1;
    var id = button.parentNode.getAttribute('id');
    var type = id.split('-')[1];
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
    for (var i = 0; i < drums.length; i++) {
      that.drums[i][drums[i].identifier].machine.gainVal = that.startVolume * volumeModifier;
    }
  }

  function listen(tempoId, drumBeatClass, drumTypeClass, statusSelectorId, drumVolumeSelector) {
    var context = this;
    var tempoEl = document.getElementById(tempoId);
    tempoEl.addEventListener('change', function() {
      var boundSetTempo = setTempo.bind(context);
      boundSetTempo(parseInt(this.value), statusSelectorId);
    });

    var drumBeats = document.getElementsByClassName(drumBeatClass);
    for (var i = 0; i < drumBeats.length; i++) {
      drumBeats[i].addEventListener('click', function() {
        selectBeat(this);
      });
    }

    var drumTypes = document.getElementsByClassName(drumTypeClass);
    for (var j = 0; j < drumTypes.length; j++) {
      drumTypes[j].addEventListener('click', function() {
        selectDrum(this);
      });
    }

    var statusButton = document.getElementById(statusSelectorId);
    statusButton.addEventListener('click', function() {
      var el = this;
      if (el.getAttribute('active') === 'true') {
        el.setAttribute('active', 'false');
        stop(statusSelectorId);
      } else {
        var boundStart = start.bind(context);
        boundStart(statusSelectorId);
      }
    });

    var drumVolumeEl = document.getElementById(drumVolumeSelector);
    drumVolumeEl.addEventListener('change', function() {
      var volumeModifier = this.value / 100;
      var boundSetVolume = setVolume.bind(context);
      boundSetVolume(volumeModifier);
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

export default DrumController;
