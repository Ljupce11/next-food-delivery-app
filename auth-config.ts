import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const PRIVATE_PATHS = ["/orders", "/profile", "/favorites"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Without this callback the middleware lets every request through.
    // Returning false redirects to pages.signIn.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPrivatePage = PRIVATE_PATHS.some((path) =>
        nextUrl.pathname.startsWith(path),
      );
      return isPrivatePage ? isLoggedIn : true;
    },
    async session({ session, token }) {
      if (typeof token.sub === "string") {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  providers: [Credentials({})],
} satisfies NextAuthConfig;
