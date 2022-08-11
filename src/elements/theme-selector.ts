import { applyTheme, Color, themes } from "../themes";
import ThemeSelectorCSS from "./theme-selector.css?inline";

const black = new Color(0, 0, 0);
const white = new Color(255, 255, 255);

export class ThemeSelectorElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.innerText = ThemeSelectorCSS;
    shadow.appendChild(style);

    const template = document.createElement("template");

    template.innerHTML = /* html */ `<label>
        <div class="disk ai"></div>
        <div class="disk player"></div>
        <div class="disk player"></div>
        <div class="disk ai"></div>
        <input type="radio" name="theme"/>
      </label>`;

    const currentThemeId = localStorage.getItem("theme-id") ?? "default";

    for (const [themeId, theme] of Object.entries(themes)) {
      const fragment = template.content.cloneNode(true) as DocumentFragment;

      const label = fragment.querySelector("label") as HTMLLabelElement;

      label.style.setProperty("--board", theme.board.toString());
      label.style.setProperty("--player", (theme.player ?? black).toString());
      label.style.setProperty("--ai", (theme.ai ?? white).toString());

      const input = fragment.querySelector('input[type="radio"]') as HTMLInputElement;

      input.setAttribute("aria-label", theme.name);

      input.addEventListener("change", () => {
        localStorage.setItem("theme-id", themeId);
        applyTheme(theme);
      });

      if (currentThemeId == themeId) {
        input.checked = true;
        applyTheme(theme);
      }

      shadow.appendChild(fragment);
    }
  }
}

customElements.define("theme-selector", ThemeSelectorElement);
