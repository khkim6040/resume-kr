import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/pdfDataStore";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const data = getData(id);
  if (!data) {
    return NextResponse.json({ error: "Data not found or expired" }, { status: 404 });
  }

  return NextResponse.json(data);
}
