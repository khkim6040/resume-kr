import { chromium, type Browser } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium";

let browserInstance: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    const executablePath = await chromiumBinary.executablePath();
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
