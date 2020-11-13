import html from "choo/html";
import _styles from "./key.css";

export default function ({ key, flat, active, x, y }, emit) {
  console.log(flat);
  return html`<rect
    onclick=${onClick}
    x="${x}"
    y="${y}"
    width="10"
    height="${flat ? 30 : "40"}"
    rx="2"
    fill="${flat ? "black" : "white"}"
    stroke="${active ? "purple" : "none"}"
  /> `;

  function onClick() {
    emit("activateKey", key);
  }
}
