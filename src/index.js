import choo from "choo";
import { KEYS } from "../components/Keyboard";
import main from "./main";

let app = choo();

const createAudioContext = (window) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

const start = ({ gainNode }) => {
  gainNode.gain.value = 0.5;
};

const pause = ({ gainNode }) => {
  gainNode.gain.value = 0.0;
};

const create = ({ context, frequency }) => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.connect(gainNode);
  oscillator.frequency.value = frequency;
  oscillator.start(0);

  gainNode.gain.value = 0.0;
  gainNode.connect(context.destination);
  return {
    oscillator,
    gainNode,
    start: () => start({ gainNode }),
    pause: () => pause({ gainNode }),
  };
};

app.use(function (state, emitter) {
  state.keys = KEYS;
  state.activeKeys = [];
  state.context = createAudioContext(window);
  state.synthesizers = {};
  for (const key in KEYS) {
    const { freq } = KEYS[key];
    state.synthesizers[key] = create({
      context: state.context,
      frequency: freq,
    });
  }

  emitter.on("activateKey", function (key) {
    state.synthesizers[key].start();
    state.activeKeys = state.activeKeys.concat(key);
    emitter.emit("render");
  });
});

app.route("/", main);
app.mount("div");
