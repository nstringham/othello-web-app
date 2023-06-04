import { applyTheme, themes } from "../themes";
import ThemeSelectorCSS from "./theme-selector.css?inline";

const themeBroadcastChannel = new BroadcastChannel("theme");

export class ThemeSelectorElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.innerText = ThemeSelectorCSS;
    shadow.appendChild(style);

    const template = document.createElement("template");

    template.innerHTML = /* html */ `
      <label>
        <input type="radio" name="theme"/>
        <svg viewBox="-1.25 -1.25 12.5 12.5">
          <circle cx="2.25" cy="2.25" r="2.25" fill="var(--ai)"/>
          <circle cx="2.25" cy="7.75" r="2.25" fill="var(--player)"/>
          <circle cx="7.75" cy="2.25" r="2.25" fill="var(--player)"/>
          <circle cx="7.75" cy="7.75" r="2.25" fill="var(--ai)"/>
        </svg>
      </label>
    `;

    const currentThemeId = localStorage.getItem("theme-id") ?? "default";

    for (const [themeId, theme] of Object.entries(themes)) {
      const fragment = template.content.cloneNode(true) as DocumentFragment;

      const label = fragment.querySelector("label") as HTMLLabelElement;
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
