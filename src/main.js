import {html} from "/card-tools/lit-element.js";
import {parseTemplate} from "/card-tools/templates.js";
import {fireEvent} from "/card-tools/event.js";

const HuiMarkDownCard = customElements.get('hui-markdown-card');
const HaMarkdown = customElements.get('ha-markdown');

// Patch ha-markdown.filterXSS to allow ha-icon tags
// filterXSS is lazy-loaded, so we need to patch it in the _render function
const svgWhiteList = ["svg", "path", "ha-icon"];
const oldRender = HaMarkdown.prototype._render;
HaMarkdown.prototype._render = function () {
  if(! this.oldFilterXSS) {
    this.oldFilterXSS = this.filterXSS;
    this.filterXSS = function(data, options) {
      return this.oldFilterXSS(data, {
        onIgnoreTag: this.allowSvg
        ? (tag, html) => (svgWhiteList.indexOf(tag) >= 0 ? html: null)
        : null,
      });
    }
  }
  oldRender.bind(this)();
};

// Patch hui-markdown-card to allow tags and parse templates
HuiMarkDownCard.prototype.render = function () {
  if (!this._config) {
    return html``;
  }

  return html`
    <ha-card .header="${this._config.title}">
      <style> ${parseTemplate(this._config.style)} </style>
      <ha-markdown
        class="markdown ${this._config.title? '' : 'no-header'}"
        .allowSvg="${true}"
        .content="${parseTemplate(this._config.content)}"
      ></ha-markdown>
    </ha-card>
  `;
};

// Add a listener for location-changed on first update
// This helps keeping track of the page hash
HuiMarkDownCard.prototype.firstUpdated = function () {
  window.addEventListener("location-changed", () => this._requestUpdate());
}

// Add a .hass property to hui-markdown-card and update when it's changed
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

// Rebuild everything to make sure the patched versions are loaded
fireEvent('ll-rebuild', {});
