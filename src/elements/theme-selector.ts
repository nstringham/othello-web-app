import { applyTheme, themes } from "../themes";
import ThemeSelectorCSS from "./theme-selector.css?inline";

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(ThemeSelectorCSS);

const themeBroadcastChannel = new BroadcastChannel("theme");

export class ThemeSelectorElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    shadow.adoptedStyleSheets.push(styleSheet);

    const template = document.createElement("template");

    template.innerHTML = /* html */ `
      <input type="radio" name="theme"/>
      <label>
        <div class="disk ai"></div>
        <div class="disk player"></div>
        <div class="disk player"></div>
        <div class="disk ai"></div>
      </label>
    `;

    const currentThemeId = localStorage.getItem("theme-id") ?? "default";

    for (const [themeId, theme] of Object.entries(themes)) {
      const fragment = template.content.cloneNode(true) as DocumentFragment;

      const label = fragment.querySelector("label") as HTMLLabelElement;
      label.setAttribute("for", themeId);
      label.style.setProperty("--board-background", theme.boardBackground);
      label.style.setProperty("--player", theme.player);
      label.style.setProperty("--ai", theme.ai);

      const input = fragment.querySelector('input[type="radio"]') as HTMLInputElement;
      input.setAttribute("id", themeId);
      input.setAttribute("aria-label", theme.name);

      input.addEventListener("change", () => {
        localStorage.setItem("theme-id", themeId);
        applyTheme(theme);
        themeBroadcastChannel.postMessage(themeId);
      });

      if (currentThemeId == themeId) {
        input.checked = true;
        applyTheme(theme);
      }

      shadow.appendChild(fragment);
    }

    themeBroadcastChannel.addEventListener("message", (event) => {
      document.documentElement.style.cssText = localStorage.getItem("theme-styles") ?? "";
      const themeId = event.data;
      const input = shadow.querySelector(`input#${themeId}`) as HTMLInputElement;
      input.checked = true;
    });
  }
}

customElements.define("theme-selector", ThemeSelectorElement);
