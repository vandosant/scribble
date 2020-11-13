import html from "choo/html";

export default function ({ flat, pressed, x, y }) {
  return html`<div
    class="${flat ? "key-flat" : "key"} ${pressed ? "keyon" : null}"
  >

  <!-- Rounded corner rectangle -->
  <rect x="${x}" y="${y}" width="10" height="40" rx="2" />
  </div>`;
}
