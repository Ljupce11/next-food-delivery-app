import NextAuth from "next-auth";
import { authConfig } from "../auth-config";

// Next.js 16 renamed middleware to proxy (always runs on the Node.js runtime).
// Auth.js checks the `authorized` callback in auth-config.ts for every match.
const { auth } = NextAuth(authConfig);

export { auth as proxy };

export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
