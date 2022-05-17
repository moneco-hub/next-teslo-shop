import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const requestedPage = req.page.name;
  const url = req.nextUrl.clone();
  if (!session) {
    url.pathname = `/auth/login?p=${requestedPage}`;
    return NextResponse.redirect(url);
  }

  const validRoles = ["admin", "super-user", "SEO"];

  if (!validRoles.includes(session.user.role)) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
