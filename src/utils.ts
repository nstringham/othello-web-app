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

export function waitForDialogToBeClosed(dialog: HTMLDialogElement): Promise<void> {
  return new Promise((resolve) => {
    dialog.querySelector("button")?.addEventListener(
      "click",
      () => {
        resolve();
      },
      { once: true }
    );
    dialog.addEventListener(
      "cancel",
      (event) => {
        event.preventDefault();
        resolve();
      },
      { once: true }
    );
    window.addEventListener(
      "popstate",
      () => {
        resolve();
      },
      { once: true }
    );
  });
}

export async function showDialog(dialog: HTMLDialogElement): Promise<void> {
  const hash = "#" + dialog.id;
  if (location.hash != hash) {
    history.pushState({ dialog: true }, "", hash);
  }

  dialog.showModal();

  await waitForDialogToBeClosed(dialog);

  dialog.classList.add("closing");

  await waitForEvent(dialog, "animationend");

  dialog.classList.remove("closing");

  dialog.close();

  if (history.state?.dialog == true) {
    history.back();
  } else {
    history.replaceState({}, "", ".");
  }
}

const toastTemplate = document.getElementById("toast-template") as HTMLTemplateElement;
const toastContainer = document.getElementById("toast-container") as HTMLDivElement;

const toastAnimation = toastContainer.animate(
  { transform: ["translateY(60px)", "translateY(0)"] },
  { duration: 250, easing: "ease-out" }
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
    { duration: 500, easing: "ease-in", fill: "forwards" }
  );

  await toastDisappear.finished;

  toastElement.remove();
}
