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

export function setLeft(label: string, listener: Listener) {
  leftElement.innerText = label;
  onLeft = listener;
}

export function setRight(label: string, listener: Listener) {
  rightElement.innerText = label;
  onRight = listener;
}

export function setEnter(label: string, listener: Listener) {
  enterElement.innerText = label;
  onEnter = listener;
}

setLeft("left", () => alert("left"));
setRight("right", () => alert("right"));
setEnter("enter", () => alert("enter"));
