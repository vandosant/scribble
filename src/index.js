import choo from "choo";
import { KEYS } from "../components/Keyboard";
import main from "./main";

let app = choo();

app.use(function (state, emitter) {
  state.keys = KEYS;

  emitter.on("activateKey", function (key) {
    console.log(state.keys, key, state.keys[key]);
    state.keys[key].active = !state.keys[key].active;
    emitter.emit("render");
  });
});

app.route("/", main);
app.mount("div");
