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
    dialog.addEventListener(
      "cancel",
      (event) => {
        event.preventDefault();
        resolve();
      },
      { once: true }
    );
    dialog.querySelector("button")!.addEventListener(
      "click",
      () => {
        resolve();
      },
      { once: true }
    );
  });
}

const alertTemplate = document.getElementById("alert-template") as HTMLTemplateElement;

export async function showAlert(message: string): Promise<void> {
  const fragment = alertTemplate.content.cloneNode(true) as DocumentFragment;
  const dialog = fragment.querySelector("dialog") as HTMLDialogElement;
  const text = fragment.querySelector(".body") as HTMLParagraphElement;

  text.textContent = message;

  document.body.appendChild(fragment);

  dialog.showModal();

  await waitForDialogToBeClosed(dialog);

  dialog.classList.add("closing");

  await waitForEvent(dialog, "animationend");

  dialog.remove();
}
