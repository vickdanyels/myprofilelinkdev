import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    // If user is not logged in, redirect to login
    // req.auth is automatically populated by the wrapper
    if (!req.auth) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/dashboard/:path*", "/settings/:path*"],
};
