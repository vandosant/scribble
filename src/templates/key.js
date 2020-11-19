import html from "choo/html";

export default function ({ active, flat, onClick, x, y }) {
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
}
