import choo from "choo.mjs";
import KEYS from "../components/Keyboard";
import main from "./main.js";

var app = choo();

app.use(function (state, emitter) {
  state.keys = KEYS;
  state.keys;

  emitter.on("keyPressed", function () {
    console.log("haha");
  });
});

app.route("/", main);
app.mount("div");
