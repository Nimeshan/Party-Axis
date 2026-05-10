import { backendApiUrl } from "./backend";

export type PartyAxisEvent = {
  id: number;
  title: string;
  description: string;
  start_at: string | null;
  city: string;
  event_type: string;
  visibility: string;
  image_url: string | null;
  status: string;
  is_highlight: boolean;
};

type EventsResponse =
  | { ok: true; data: PartyAxisEvent[] }
  | { ok: false; error?: string };

export async function fetchApprovedEvents(): Promise<PartyAxisEvent[]> {
  const url = backendApiUrl("/api/events.php");
  if (!url) return [];

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    const text = await res.text();
    let json: EventsResponse | null = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      return [];
    }
    if (!json || json.ok !== true || !Array.isArray(json.data)) return [];
    return json.data;
  } catch {
    return [];
  }
}

export function weekendLabel(date: Date): boolean {
  const d = date.getDay();
  return d === 5 || d === 6 || d === 0;
}
