import html from "choo/html";
import keyboard from "./templates/keyboard";

export default function (state) {
  return html` <div class="container">${keyboard(state)}</div> `;
}
