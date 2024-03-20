import { apiUrl, login } from "@/constants/path";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { isExp, serverApiCall } from "./apiCall";
import { UserLoginResponse } from "@/interface/UserLoginResponse";
import { ApiResponse } from "@/interface/ApiResponse";
import { apiLogin } from "@/service/api-login";
import { apiRenew } from "@/service/api-renew";
import { jwtDecode } from "jwt-decode";

const { NEXT_PUBLIC_TEMP_APP_KEY } = process.env;

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { data, status } = await apiLogin({
          username: credentials?.username ?? "",
          password: credentials?.password ?? "",
        });

        const user = {
          id: data.user.idCode,
          email: data as any,
          name: data.user.firstNameTh,
        };

        if (status == 200 && user) {
          return user;
        } else {
          // TODO: handle login failed
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // user that we return in authorize will br in token (not user)
      const { data } = await apiRenew({
        renewtoken: (token as any).email.renewtoken,
      });
      return {
        ...token,
        email: {
          ...(token.email as any),
          accesstoken: data.accesstoken,
        },
      };
    },
    async session({ session, token }) {
      // return from jwt will be in token
      if (isExp((token.email as any as UserLoginResponse).accesstoken)) {
        return {} as any;
      }

      session.user = (token.email as any as UserLoginResponse).user;
      session.token = token.email as any as UserLoginResponse;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
};
