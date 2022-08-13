import { registerSW } from "virtual:pwa-register";

let shouldRestart = true;

export function preventRestart() {
  shouldRestart = false;
}

const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(shouldRestart);
  },
});
