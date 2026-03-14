import { chromium, type Browser } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium-min";

const CHROMIUM_PACK_URL =
  "https://github.com/nichochar/chromium-on-vercel/releases/download/v143.0.0/chromium-v143.0.0-pack.tar";

let browserInstance: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    const executablePath = await chromiumBinary.executablePath(CHROMIUM_PACK_URL);
    browserInstance = await chromium.launch({
      args: chromiumBinary.args,
      executablePath,
      headless: true,
    });
  }
  return browserInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
