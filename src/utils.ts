import { setKey, waitForKeyPress } from "./soft-keys";

export function waitForMilliseconds(milliseconds?: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function waitForIdle(): Promise<void> {
  return new Promise((resolve) => requestIdleCallback(() => resolve()));
}

export function waitForEvent(emitter: EventTarget, event: string, options?: AddEventListenerOptions) {
  return new Promise((resolve) => {
    emitter.addEventListener(event, resolve, { ...options, once: true });
  });
}

export function focus(element: HTMLElement | null | undefined) {
  for (const element of document.querySelectorAll(".focus")) {
    element.classList.remove("focus");
  }
  if (element == null) {
    setKey("enter", "");
    return;
  }
  element.classList.add("focus");

  const select = element.querySelector("select");
  const input = element.querySelector("input");
  if (select != undefined) {
    setKey("enter", "select", () => select.focus());
  } else if (input != undefined) {
    setKey("enter", "select", () => input.click());
  } else {
    setKey("enter", "");
  }

  element.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

export async function showDialog(dialog: HTMLDialogElement, closeLabel: string): Promise<void> {
  const previouslyFocusedElement = document.querySelector<HTMLElement>(".focus");

  dialog.classList.add("open");

  focus(dialog.querySelector<HTMLElement>(".focusable"));

  await waitForKeyPress("left", closeLabel);

  setKey("enter", "");

  dialog.classList.add("closing");

  await waitForEvent(dialog, "animationend");

  dialog.classList.remove("closing");

  focus(previouslyFocusedElement);

  dialog.classList.remove("open");
}

const toastTemplate = document.getElementById("toast-template") as HTMLTemplateElement;
const toastContainer = document.getElementById("toast-container") as HTMLDivElement;

const toastAnimation = toastContainer.animate(
  { transform: ["translateY(40px)", "translateY(0)"] },
  { duration: 250, easing: "ease-out" },
);

export async function showToast(text: string, waitFor: Promise<unknown> = waitForMilliseconds(10_000)) {
  const fragment = toastTemplate.content.cloneNode(true) as DocumentFragment;

  const toastElement = fragment.querySelector(".toast") as HTMLDivElement;
  const textElement = fragment.querySelector(".text") as HTMLSpanElement;

  textElement.textContent = text;

  toastContainer.appendChild(fragment);

  toastAnimation.finish();
  toastAnimation.play();

  await waitFor;

  const toastDisappear = toastElement.animate(
    { transform: ["translateX(0)", "translateX(calc(-12px + -100%))"] },
    { duration: 500, easing: "ease-in", fill: "forwards" },
  );

  await toastDisappear.finished;

  toastElement.remove();
}
