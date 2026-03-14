import { chromium, type Browser } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium-min";

const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.x64.tar";

export async function getBrowser(): Promise<Browser> {
  const executablePath = await chromiumBinary.executablePath(CHROMIUM_PACK_URL);
  return chromium.launch({
    args: chromiumBinary.args,
    executablePath,
    headless: true,
  });
}
