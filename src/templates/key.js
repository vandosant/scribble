import html from "choo/html.js";

export default function ({ flat, pressed }) {
  return html`<div
    class="${flat ? "key-flat" : "key"} ${pressed ? "keyon" : null}"
  ></div>`;
}
