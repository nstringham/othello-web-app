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
    dialog.querySelector("button")!.addEventListener(
      "click",
      () => {
        close();
      },
      { once: true }
    );
    dialog.addEventListener(
      "cancel",
      (event) => {
        event.preventDefault();
        close();
      },
      { once: true }
    );
    function dialogClickListener(event: MouseEvent) {
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientY < rect.top ||
        event.clientY > rect.bottom ||
        event.clientX < rect.left ||
        event.clientX > rect.right
      ) {
        close();
      }
    }
    dialog.addEventListener("click", dialogClickListener);
    function close() {
      dialog.removeEventListener("click", dialogClickListener);
      resolve();
    }
  });
}

const alertTemplate = document.getElementById("alert-template") as HTMLTemplateElement;

export async function showAlert(message: string): Promise<void> {
  const fragment = alertTemplate.content.cloneNode(true) as DocumentFragment;
  const dialog = fragment.querySelector("dialog") as HTMLDialogElement;
  const text = fragment.querySelector(".body") as HTMLParagraphElement;

  text.textContent = message;

  document.body.appendChild(fragment);

  await showDialog(dialog);

  dialog.remove();
}

export async function showDialog(dialog: HTMLDialogElement): Promise<void> {
  dialog.showModal();

  await waitForDialogToBeClosed(dialog);

  dialog.classList.add("closing");

  await waitForEvent(dialog, "animationend");

  dialog.classList.remove("closing");
}
