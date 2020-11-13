import html from "choo/html";
import _styles from "./key.css";

export default function ({ flat, pressed, x, y }) {
  console.log(flat);
  return html`<rect
    x="${x}"
    y="${y}"
    width="10"
    height="${flat ? 30 : "40"}"
    rx="2"
    fill="${flat ? "black" : "white"}"
  /> `;
}
