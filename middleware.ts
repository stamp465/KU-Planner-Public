import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "./constants/locales";

async function apiMiddleware(request: NextRequest) {
  // auth session
  const isAuth = request.nextUrl.pathname.startsWith("/api/auth");

  if (!isAuth) {
    const appKey = request.headers.get("app-key");
    if (appKey !== (process.env.NEXT_PUBLIC_TEMP_APP_KEY as string)) {
      return NextResponse.json({ message: "Error" }, { status: 404 });
    }

    const isToken = request.nextUrl.pathname.startsWith("/api/token");
    if (isToken) {
      const xAccessToken = request.headers.get("x-access-token");
      if (xAccessToken == null) {
        return NextResponse.json({ message: "Error" }, { status: 401 });
      }
    }
  }

  // retrieve the current response
  const res = NextResponse.next();

  // add the CORS headers to the response
  res.headers.append("Access-Control-Allow-Credentials", "true");
  res.headers.append("Access-Control-Allow-Origin", process.env.URL as string);
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT"
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  return res;
}

async function intlMiddleware(request: NextRequest) {
  // Step 1: Use the incoming request
  const getLocale = request.headers.get("x-default-locale") || "en";

  // Step 2: Create and call the next-intl middleware
  const handleI18nRouting = createMiddleware({
    // A list of all locales that are supported
    locales: locales,

    // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
    defaultLocale: defaultLocale,
  });
  const response = handleI18nRouting(request);

  // Step 3: Alter the response
  response.headers.set("x-default-locale", getLocale);
  return response;
}

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    return apiMiddleware(request);
  } else {
    return intlMiddleware(request);
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!_next|.*\\..*).*)"],
};
