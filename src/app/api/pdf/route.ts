import { NextRequest, NextResponse } from "next/server";
import { getBrowser } from "@/lib/browser";
import { saveData } from "@/lib/pdfDataStore";
import type { ResumeData } from "@/types/resume";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let data: ResumeData;
  try {
    data = (await req.json()) as ResumeData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = randomUUID();
  saveData(id, data);

  // 현재 서버의 origin 추출
  const origin = req.nextUrl.origin;

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(`${origin}/print?id=${id}`, {
      waitUntil: "networkidle",
    });

    // useAutoFit 안정화 + ready 시그널 대기
    await page.waitForFunction(() => (window as Window & { __PRINT_READY?: boolean }).__PRINT_READY === true, {
      timeout: 10_000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await page.close();
  }
}
