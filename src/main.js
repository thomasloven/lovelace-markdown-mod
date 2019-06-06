import {html} from "/card-tools/lit-element.js";
import {parseTemplate} from "/card-tools/templates.js";
import {fireEvent} from "/card-tools/event.js";

const HuiMarkDownCard = customElements.get('hui-markdown-card');

HuiMarkDownCard.prototype.render = function () {
  if (!this._config) {
    return html``;
  }

  return html`
    <ha-card .header="${this._config.title}">
      <style> ${parseTemplate(this._config.style)} </style>
      <ha-markdown
        class="markdown ${this._config.title? '' : 'no-header'}"
        .content="${parseTemplate(this._config.content)}"
      ></ha-markdown>
    </ha-card>
  `;
};

HuiMarkDownCard.prototype.firstUpdated = function () {
  window.addEventListener("location-changed", () => this._requestUpdate());
}

Object.defineProperty(HuiMarkDownCard.prototype, 'hass', {
  get() {
    return this._hass;
  },
  set(value) {
    if(value !== this._hass) {
      const oldval = this._hass;
      this._hass = value;
      this._requestUpdate('hass', oldval);
    }
  },
});

fireEvent('ll-rebuild', {});
