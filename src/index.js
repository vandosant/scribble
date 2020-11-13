import choo from "choo";
import { KEYS } from "../components/Keyboard";
import main from "./main";

let app = choo();

app.use(function (state, emitter) {
  state.keys = KEYS;

  emitter.on("keyPressed", function () {
    console.log("haha");
  });
});

app.route("/", main);
app.mount("div");
