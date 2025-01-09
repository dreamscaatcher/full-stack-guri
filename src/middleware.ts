import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

console.log(matchers);

export default clerkMiddleware((auth, req) => {
  // Skip auth check for sign-in page and static assets
  if (req.nextUrl.pathname.startsWith('/sign-in') || 
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = auth();

  // If not authenticated and not on sign-in page, redirect to sign-in
  if (!userId && !req.nextUrl.pathname.startsWith('/sign-in')) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const role = (sessionClaims?.public_Meta_data as { role?: string })?.role;

  // If authenticated but no role, allow access to home page only
  if (userId && !role && req.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  // Check role-based access
  if (role) {
    for (const { matcher, allowedRoles } of matchers) {
      if (matcher(req) && allowedRoles.includes(role)) {
        // Only redirect if not already on a role-specific path
        if (!req.nextUrl.pathname.startsWith(`/${role}`)) {
          return NextResponse.redirect(new URL(`/${role}`, req.url));
        }
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
