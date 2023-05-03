const leftElement = document.querySelector("#soft-left") as HTMLSpanElement;
const rightElement = document.querySelector("#soft-right") as HTMLSpanElement;
const enterElement = document.querySelector("#soft-enter") as HTMLSpanElement;

export type Listener = (() => void) | undefined;

let onLeft: Listener;
let onRight: Listener;
let onEnter: Listener;

document.addEventListener("keydown", (event) => {
  if (event.key == "SoftLeft" || event.key == "ArrowLeft") {
    onLeft?.();
  } else if (event.key == "SoftRight" || event.key == "ArrowRight") {
    onRight?.();
  } else if (event.key == "Enter") {
    onEnter?.();
  }
});

export function setLeft(label: string, listener: Listener = undefined, once = false) {
  if (once) {
    const oldLabel = leftElement.innerText;
    const oldListener = onLeft;

    leftElement.innerText = label;
    onLeft = () => {
      leftElement.innerText = oldLabel;
      onLeft = oldListener;
      listener?.();
    };
  } else {
    leftElement.innerText = label;
    onLeft = listener;
  }
}

export function setRight(label: string, listener: Listener = undefined, once = false) {
  if (once) {
    const oldLabel = rightElement.innerText;
    const oldListener = onRight;

    rightElement.innerText = label;
    onRight = () => {
      rightElement.innerText = oldLabel;
      onRight = oldListener;
      listener?.();
    };
  } else {
    rightElement.innerText = label;
    onRight = listener;
  }
}

export function setEnter(label: string, listener: Listener = undefined, once = false) {
  if (once) {
    const oldLabel = enterElement.innerText;
    const oldListener = onEnter;

    enterElement.innerText = label;
    onEnter = () => {
      enterElement.innerText = oldLabel;
      onEnter = oldListener;
      listener?.();
    };
  } else {
    enterElement.innerText = label;
    onEnter = listener;
  }
}
