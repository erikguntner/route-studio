import {NextApiRequest, NextApiResponse} from 'next';
import NextAuth, {NextAuthOptions} from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const options: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({session, token, user}) {
      console.log('session', session);
      console.log(session, token, user);
      if (!session?.user || !user) {
        return session;
      }

      session.user.id = user.id as string;
      return session;
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
