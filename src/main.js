import html from "choo/html";
import keyboard from "./templates/keyboard";
import styles from "./main.css";

export default function (state, emit) {
  return html`
    <div class="${styles.container}">${keyboard(state, emit)}</div>
  `;
}
