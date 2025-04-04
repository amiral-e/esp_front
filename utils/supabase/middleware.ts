import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      }
    );

    const { data: user } = await supabase.auth.getUser();
    const cookieStore = cookies();
    const auth_token = (await cookieStore).get("auth_token")?.value ?? null;

    const publicPaths = ["/", "/sign-in", "/sign-up"];
    const isPublicPath = publicPaths.some((path) =>
      request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/")
    );

    const isAuth = auth_token !== null;

    // Redirect to sign-in if not authenticated and trying to access protected route
    if (!isAuth && !isPublicPath) {
      console.log("Unauthenticated access to protected route. Redirecting to /sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Redirect to /protected/chat if already authenticated and trying to access sign-in
    if (isAuth && request.nextUrl.pathname === "/sign-in") {
      return NextResponse.redirect(new URL("/protected/chat", request.url));
    }

    return response;
  } catch (e) {
    console.error("Error in updateSession middleware:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
