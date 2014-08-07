function DrumMachine(context) {
  this.context = context;
}

DrumMachine.prototype.bassKick = function () {
  var bassDrum = this.context.createOscillator();
  var bassNode = this.context.createGain();

  bassNode.gain.value = 0.8;
  bassNode.connect(this.context.destination);
  bassDrum.connect(bassNode);
  bassDrum.frequency.value = 52;
  bassDrum.type = "sine";
  bassDrum.start(0);

  var fadeTimeout = setInterval(function () {
    if (bassNode.gain.value > 0) {
      bassNode.gain.value -= 0.01;
    }
  }, 5);

  setTimeout(function () {
    clearInterval(fadeTimeout);
    bassDrum.stop(0);
  }, 1000);

};