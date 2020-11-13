import html from "choo/html";
import key from "./key";

export default function ({ keys }) {
  return html`<div class="keyboard-container">
    <div class="octave">
      <div id="octave-down">
        <div class="octave-text">oct dwn</div>
      </div>
    </div>
    <div class="keyboard">
      ${Object.values(keys)
        .sort((a, b) => b.index < a.index)
        .map(key)}
    </div>
    <div class="octave">
      <div id="octave-up">
        <div class="octave-text">oct up</div>
      </div>
    </div>
  </div> `;
}
