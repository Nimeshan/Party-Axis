import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/backend";

export async function POST(req: Request) {
  const target = backendApiUrl("/api/newsletter.php");
  if (!target) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Newsletter signup is unavailable (set PARTYAXIS_BACKEND_URL for your PHP deployment).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const res = await fetch(target, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: res.status });
    } catch {
      return NextResponse.json(
        { ok: false, error: text.slice(0, 200) || "Upstream error" },
        { status: res.status >= 400 ? res.status : 502 },
      );
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Upstream unreachable" }, { status: 502 });
  }
}
