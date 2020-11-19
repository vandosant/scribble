import choo from "choo";
import { KEYS } from "../components/Keyboard";
import main from "./main";
import impulseResponse from "./assets/bottledungeon1_sf_edited.wav";

let app = choo();

const createAudioContext = (window) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

const start = ({ context, gainNode }) => {
  if (context.state === "suspended") {
    context.resume();
  }

  gainNode.gain.setValueAtTime(1, context.currentTime);
};

const pause = ({ context, gainNode }) => {
  for (let i = 1.0, j = 0; i > 0.0; i -= 0.1, j += 0.01) {
    gainNode.gain.setValueAtTime(i, context.currentTime + j);
  }
};

const effects = {
  compressor: ({ context }) => {
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-90, context.currentTime);
    compressor.knee.setValueAtTime(40, context.currentTime);
    compressor.ratio.setValueAtTime(12, context.currentTime);
    compressor.attack.setValueAtTime(0, context.currentTime);
    compressor.release.setValueAtTime(0.5, context.currentTime);
    return compressor;
  },
  distortion: ({ context }) => {
    var distortion = context.createWaveShaper();

    function makeDistortionCurve(amount) {
      var k = typeof amount === "number" ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
      for (; i < n_samples; ++i) {
        x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    }

    distortion.curve = makeDistortionCurve(800);
    distortion.oversample = "4x";
    return distortion;
  },
  filter: ({ context }) => {
    const filterNumber = 2;

    let lowPassCoefs = [
      {
        frequency: 200,
        feedforward: [0.00020298, 0.0004059599, 0.00020298],
        feedback: [1.0126964558, -1.9991880801, 0.9873035442],
      },
      {
        frequency: 500,
        feedforward: [0.0012681742, 0.0025363483, 0.0012681742],
        feedback: [1.0317185917, -1.9949273033, 0.9682814083],
      },
      {
        frequency: 1000,
        feedforward: [0.0050662636, 0.0101325272, 0.0050662636],
        feedback: [1.0632762845, -1.9797349456, 0.9367237155],
      },
      {
        frequency: 5000,
        feedforward: [0.1215955842, 0.2431911684, 0.1215955842],
        feedback: [1.2912769759, -1.5136176632, 0.7087230241],
      },
    ];

    let feedForward = lowPassCoefs[filterNumber].feedforward,
      feedBack = lowPassCoefs[filterNumber].feedback;

    return context.createIIRFilter(feedForward, feedBack);
  },
  reverb: async ({ context }) => {
    let convolver = context.createConvolver();

    let response = await fetch(impulseResponse);
    let arraybuffer = await response.arrayBuffer();
    convolver.buffer = await context.decodeAudioData(arraybuffer);

    return convolver;
  },
};

const oscillation = {
  node: ({ context, frequency, gainNode, reverb, type = "sine" }) => {
    const oscillator = context.createOscillator();
    oscillator.type = type;
    const filter = effects.filter({ context });
    const compressor = effects.compressor({ context });
    // const distortion = effects.distortion({ context });
    oscillator
      .connect(filter)
      .connect(reverb)
      .connect(compressor)
      .connect(gainNode);
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.start(0);
    return oscillator;
  },
};

const nodes = {
  gain: ({ context }) => {
    let gainNode = context.createGain();
    gainNode.gain.value = 0.0;
    gainNode.connect(context.destination);
    return gainNode;
  },
};

const create = async ({ context, frequency, reverb }) => {
  let gainNodes = [];
  [("sine", "sawtooth", "sine", "sawtooth")].forEach((type) => {
    const gainNode = nodes.gain({ context });
    gainNodes = gainNodes.concat(gainNode);
    oscillation.node({
      context,
      gainNode,
      frequency,
      type,
      reverb,
    });
  });

  return {
    start: ({ context }) =>
      gainNodes.forEach((gainNode) => start({ context, gainNode })),
    pause: ({ context }) =>
      gainNodes.forEach((gainNode) => pause({ context, gainNode })),
  };
};

app.use(async function (state, emitter) {
  state.keys = KEYS;
  state.activeKeys = [];
  state.context = createAudioContext(window);
  state.synthesizers = {};
  const reverb = await effects.reverb({ context: state.context });
  for (const key in KEYS) {
    const { freq } = KEYS[key];
    state.synthesizers[key] = await create({
      context: state.context,
      frequency: freq,
      reverb,
    });
  }

  emitter.on("activateKey", function (key) {
    state.synthesizers[key].start({ context: state.context });
    state.activeKeys = state.activeKeys.concat(key);
    emitter.emit("render");
  });
  emitter.on("deactivateKey", function (key) {
    state.synthesizers[key].pause({ context: state.context });
    state.activeKeys = state.activeKeys.filter(
      (activeKey) => key !== activeKey
    );
    emitter.emit("render");
  });
});

app.route("/", main);
app.mount("div");
