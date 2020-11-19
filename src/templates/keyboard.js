import html from "choo/html";
import Key from "./key";
import styles from "./keyboard.css";

export default function ({ activeKeys, keys, synthesizers }, emit) {
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

  function mapKey({ flat, key }, index) {
    const active = activeKeys.includes(key);
    return Key(
      {
        flat,
        active,
        y: 0,
        x: index * 10,
        onClick: () => {
          if (activeKeys.includes(key)) {
            emit("deactivateKey", key);
          } else {
            emit("activateKey", key);
          }
        },
      },
      emit
    );
  }
}
