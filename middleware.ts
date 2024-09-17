import { withAuth } from "next-auth/middleware";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  CUSTOM_SIGN_IN_URL,
} from "./routes";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { nextUrl } = req;
    const { pathname } = nextUrl;
    const isLoggedIn = !!req.nextauth?.token; // Token olup olmadığını kontrol et

    if(pathname === "/") {
      return NextResponse.next()
    }
    // Giriş yapılmamış kullanıcıların /authentication sayfasına erişimine izin ver
    if (pathname.startsWith("/authentication")) {
      if (!isLoggedIn) {
        return NextResponse.next(); // Giriş yapılmamış kullanıcıların erişimine izin ver
      }
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)); // Giriş yapmış kullanıcıları yönlendir
    }

    // Giriş yapmış kullanıcılar ana sayfaya gitmeye çalışırsa, /app sayfasına yönlendir
    if (isLoggedIn && pathname === "/") {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    // Giriş yapmış kullanıcılar için /admin sayfalarına erişim kontrolü
    if (pathname.startsWith("/admin")) {
      if (req.nextauth?.token?.role === "ADMIN") {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
    }

    // Diğer korunan sayfalar için yönlendirme
    const isProtectedRoute = authRoutes.includes(pathname);
    
    if (isProtectedRoute && !isLoggedIn) {
      return NextResponse.redirect(new URL(CUSTOM_SIGN_IN_URL, nextUrl)); // Yönlendirme
    }

    // Diğer sayfalar için devam et
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Giriş yapılmamış kullanıcıların /authentication sayfasına erişimine izin ver
        if (pathname.startsWith("/authentication") && !token) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/authentication/:path*"],
};
