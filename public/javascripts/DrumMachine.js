function DrumMachine(context) {
  this.context = context;
}

DrumMachine.prototype.bassKick = function () {
  var bassDrum = this.context.createOscillator();
  var bassNode = this.context.createGain();

  bassNode.gain.value = 1;
  bassNode.connect(this.context.destination);
  bassDrum.connect(bassNode);
  bassDrum.frequency.value = 58;
  bassDrum.type = "sine";
  bassDrum.start(0);

  var fadeTimeout = setInterval(function () {
    if (bassNode.gain.value > 0) {
      bassNode.gain.value -= 0.02;
    }
  }, 5);
};

DrumMachine.prototype.snareHit = function () {
  var snareDrum = this.context.createOscillator();
  var snareNode = this.context.createGain();

  snareNode.gain.value = 1;
  snareNode.connect(this.context.destination);
  snareDrum.connect(snareNode);
  snareDrum.frequency.value = 200;
  snareDrum.type = "sine";
  snareDrum.start(0);

  var fadeTimeout = setInterval(function () {
    if (snareNode.gain.value > 0) {
      snareNode.gain.value -= 0.5;
    }
  }, 5);
};