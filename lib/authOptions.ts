import bcrypt from "bcrypt";
import { AuthOptions , DefaultSession} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/lib/prismadb";

type extendedUser = DefaultSession["user"] & {
  role: string
}

declare module "next-auth" {

  interface Session {
    user: extendedUser
  }
}


export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name,
          surname: profile.family_name,
          username: profile.sub,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png";
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
        return {
          id: profile.id,
          name: profile.name,
          username: profile.username,
          email: profile.email,
          image: profile.image_url,
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Password is wrong!");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // Ensure session.user is defined
      if (session.user) {
        // Add role to session.user if it is present in the token
        session.user.role = token.role as string;
      } else {
        // Handle case where session.user is undefined
        session.user = { role: token.role || null } as any; // or provide a default user object
      }
      return session;
    },
  },
  pages: {
    signIn: "/authentication",
  },
debug: process.env.NODE_ENV === 'development',
session: {
    strategy: 'jwt',
},
secret: process.env.NEXTAUTH_SECRET,
};
