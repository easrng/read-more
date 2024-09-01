// @ts-check
/** @type {boolean} */
let skipNextAttrChange;
class ReadMore extends HTMLElement {
  static observedAttributes = ["open"];
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    const shadow = /** @type {ShadowRoot} */ (this.shadowRoot);
    const content = document.createElement("slot");
    const overlay = document.createElement("slot");
    overlay.name = "overlay";
    overlay.style.visibility = "hidden";
    const styles = document.createElement("style");
    styles.textContent =
      ":host{display:grid;grid-template-columns:1fr;grid-template-rows:1fr;overflow:hidden}slot{display:block;grid-column:1;grid-row:1;height:fit-content;}";
    shadow.append(content, overlay, styles);
    this._c = () => {
      overlay.style.visibility = "hidden";
      content.style.position = "static";
      if (
        content.getBoundingClientRect().height >
        overlay.getBoundingClientRect().height
      ) {
        this.setAttribute("collapse", "");
        if (!this.open) {
          overlay.style.visibility = "visible";
          content.style.position = "absolute";
        }
      } else {
        this.removeAttribute("collapse");
        overlay.style.visibility = "hidden";
        content.style.position = "";
      }
    };
    if (typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(this._c);
    }
    this.setAttribute("hydrated", "");
  }
  connectedCallback() {
    if (this._ro) {
      this._ro.observe(this);
    }
    this._c();
  }
  disconnectedCallback() {
    if (this._ro) {
      this._ro.disconnect();
    }
  }
  attributeChangedCallback(name, _oldValue, newValue) {
    if (skipNextAttrChange) {
      skipNextAttrChange = false;
      return;
    }
    if (name === "open") {
      this.open = newValue;
    }
  }
  get open() {
    return this._o;
  }
  set open(value) {
    skipNextAttrChange = true;
    if ((this._o = !!value)) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
    this._c();
  }
}
customElements.define("easrng-read-more", ReadMore);
