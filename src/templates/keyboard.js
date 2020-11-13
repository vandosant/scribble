import html from "choo/html";
import key from "./key";
import styles from "./keyboard.css";

export default function ({ keys }) {
  return html`<div class="${styles.container}">
    <div class="octave">
      <div id="octave-down">
        <div class="octave-text">oct dwn</div>
      </div>
    </div>
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      ${Object.values(keys)
        .sort((a, b) => b.index < a.index)
        .map(mapKey)}
    </svg>
    <div class="octave">
      <div id="octave-up">
        <div class="octave-text">oct up</div>
      </div>
    </div>
  </div> `;
}

function mapKey(k, index) {
  return key({ flat: k.flat, y: 0, x: index * 10 });
}
