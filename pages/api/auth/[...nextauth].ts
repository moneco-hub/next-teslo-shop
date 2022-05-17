import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "Custom Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "youremail@mail.com" },
        password: { label: "Password", type: "password", placeholder: "your password" },
      },
      async authorize(credentials: any) {
        const { email = "", password = "" } = credentials;
        return await dbUsers.checkUserEmailPassword(email, password);
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  //Custom pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  //Sesion
  session: {
    maxAge: 2592000, //30d
    strategy: "jwt",
    updateAge: 86400, //every day
  },

  //callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case "credentials":
            token.user = user;
            break;
          case "oauth":
            token.user = await dbUsers.oAuthToDbUser(user?.email || "", user?.name || "");
            break;

          default:
            break;
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    },
  },
});
