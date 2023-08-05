import { waitForMilliseconds } from "./utils";
import "./kaiads.v5.min.js";

const publisherId = "be03b323-64ad-468e-b429-6018d38d3c5d";

const errorMessages = {
  [1]: "Document body not yet ready",
  [2]: "Ad onready function is required",
  [3]: "Ad container dimension is too small",
  [4]: "Ad iframe is gone",
  [5]: "Ad request timed out",
  [6]: "Server responded 'no ad'",
  [7]: "Frequency capping in effect",
  [8]: "Configuration error: Missing w & h",
  [9]: "Bad server response",
  [10]: "Internal error",
  [11]: "Internal error",
  [12]: "Internal error",
  [13]: "Cannot process server response",
  [14]: "No server response",
  [15]: "Configuration error: Invalid test parameter",
  [16]: "ad.call('display') is not allowed to be called more than once",
  [17]: "Cannot fetch settings",
  [18]: "Internal error",
  [19]: "Cannot load SDK",
  [20]: "Internal error",
} as const;

type AdEvent = "click" | "close" | "display";

declare interface Ad {
  call(command: AdEvent): void;
  on(event: AdEvent, callback: () => void): void;
}

declare function getKaiAd(config: {
  publisher: string;
  app?: string;
  slot?: string;
  test: 0 | 1;
  timeout: number;
  onerror: (code: keyof typeof errorMessages) => void;
  onready: (ad: Ad) => void;
}): {
  destroy: () => void;
};

export function getAd() {
  return new Promise<Ad>((resolve, reject) => {
    if (!("getKaiAd" in window)) {
      return reject(new Error("getKaiAd does not exist"));
    }
    getKaiAd({
      publisher: publisherId,
      app: "Othello",

      test: import.meta.env.DEV ? 1 : 0,
      timeout: 30_000,
      onready: resolve,
      onerror: (code) =>
        reject(
          new Error(import.meta.env.DEV ? `KaiAds Error: ${code} ${errorMessages[code]}` : `KaiAds Error: ${code}`),
        ),
    });
  });
}

function waitOn(ad: Ad, event: AdEvent) {
  return new Promise<void>((resolve) => ad.on(event, resolve));
}

export async function displayAd(ad: Ad | Promise<Ad>) {
  const timeout = waitForMilliseconds(500).then(() => Promise.reject(new Error("ad not ready")));
  ad = await Promise.race([ad, timeout]);
  ad.call("display");
  if (import.meta.env.DEV) {
    await waitForMilliseconds(5_000);
    document.querySelector("iframe")?.parentElement?.remove();
  } else {
    await waitOn(ad, "close");
  }
}
