import { NextResponse } from "next/server";

import { backendApiUrl } from "./backend";

/**
 * Forward POST JSON to the PHP API and replay Set-Cookie so PHP sessions work
 * through Next (same-origin to the browser).
 */
export async function proxyPhpPost(apiPath: string, req: Request): Promise<NextResponse> {
  const target = backendApiUrl(apiPath);
  if (!target) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Account services are unavailable (set PARTYAXIS_BACKEND_URL to your PHP deployment origin).",
      },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const cookie = req.headers.get("cookie");

  try {
    const res = await fetch(target, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify(payload ?? {}),
    });

    const text = await res.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json(
        { ok: false, error: text.slice(0, 200) || "Upstream error" },
        { status: res.status >= 400 ? res.status : 502 },
      );
    }

    const out = NextResponse.json(json, { status: res.status });
    const cookies = res.headers.getSetCookie?.() ?? [];
    for (const c of cookies) {
      out.headers.append("Set-Cookie", c);
    }
    return out;
  } catch {
    return NextResponse.json({ ok: false, error: "Upstream unreachable" }, { status: 502 });
  }
}
