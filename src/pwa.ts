import { registerSW } from "virtual:pwa-register";

let shouldRestart = true;

export function preventRestart() {
  shouldRestart = false;
}

const updateSW = registerSW({
  onNeedRefresh() {
    if (shouldRestart) {
      updateSW();
      sessionStorage.setItem("updating", "true");
    } else {
      updateAndRestart = updateSW;
    }
  },
});

export let updateAndRestart = () => location.reload();

sessionStorage.removeItem("updating");
