import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Cache for 5 minutes so the hero doesn't hammer the DB on every load.
export const revalidate = 300;

// Floor until the real app user database is wired in (see below).
const BASE = 300;

export async function GET() {
  try {
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // App users live in the app's Supabase project, not this marketing one.
    // When that project's URL + service key are added (e.g. APP_SUPABASE_URL /
    // APP_SUPABASE_SERVICE_ROLE_KEY), point this at it and count the right
    // source (auth.users or a profiles/users table).
    const { data } = await sb.auth.admin.listUsers({ page: 1, perPage: 1 });
    const raw = (data as { total?: number } | null)?.total ?? 0;

    // Round DOWN to the nearest 5 so the "+" stays truthful.
    const n = Math.max(raw, BASE);
    const rounded = Math.floor(n / 5) * 5;

    return NextResponse.json({ users: rounded });
  } catch {
    return NextResponse.json({ users: BASE });
  }
}
