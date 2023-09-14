import axios from "axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const res = await axios.post(
          `${process.env.BACKEND_BASE_URL}/sessions`,
          {
            email: credentials?.email as string,
            password: credentials?.password as string,
          },
        );

        const user = res.data.user;

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      return { ...token, ...user };
    },

    async session({ session, token }: any) {
      session.user = token;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET as string,
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
