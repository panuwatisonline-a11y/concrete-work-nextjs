import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = searchParams.get("next")?.startsWith("/") ? searchParams.get("next")! : "/profile";

  const fail = () => NextResponse.redirect(new URL("/auth/error", request.url));

  if (!code) {
    return fail();
  }

  const redirectTo = new URL(nextPath, origin);
  let response = NextResponse.redirect(redirectTo);

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, responseHeaders) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        if (responseHeaders) {
          for (const [k, v] of Object.entries(responseHeaders)) {
            if (typeof v === "string") response.headers.set(k, v);
          }
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return fail();
  }

  return response;
}
