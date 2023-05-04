const elements = {
  left: document.querySelector("#soft-left") as HTMLSpanElement,
  right: document.querySelector("#soft-right") as HTMLSpanElement,
  enter: document.querySelector("#soft-enter") as HTMLSpanElement,
} as const;

export type Listener = (() => void) | undefined;

const listeners = {} as {
  left: Listener;
  right: Listener;
  enter: Listener;
};

document.addEventListener("keydown", (event) => {
  if (event.key == "SoftLeft" || event.key == "[") {
    listeners["left"]?.();
  } else if (event.key == "SoftRight" || event.key == "]") {
    listeners["right"]?.();
  } else if (event.key == "Enter") {
    listeners["enter"]?.();
  } else {
    return;
  }
  event.preventDefault();
});

export function setKey(key: "left" | "right" | "enter", label: string, listener: Listener = undefined, once = false) {
  if (once) {
    const oldLabel = elements[key].innerText;
    const oldListener = listeners[key];

    elements[key].innerText = label;
    listeners[key] = () => {
      elements[key].innerText = oldLabel;
      listeners[key] = oldListener;
      listener?.();
    };
  } else {
    elements[key].innerText = label;
    listeners[key] = listener;
  }
}

export function waitForKeyPress(key: "left" | "right" | "enter", label: string) {
  return new Promise<void>((resolve) => {
    setKey(key, label, resolve, true);
  });
}
