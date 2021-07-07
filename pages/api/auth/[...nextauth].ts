import {NextApiRequest, NextApiResponse} from 'next';
import NextAuth, {NextAuthOptions} from 'next-auth';
import Providers, {SendVerificationRequest} from 'next-auth/providers';
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {PrismaClient} from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const sendVerificationRequest: SendVerificationRequest = ({
  identifier: email,
  provider,
  url,
}) => {
  return new Promise((resolve, reject) => {
    const {server, from} = provider;

    nodemailer.createTransport(server).sendMail(
      {
        to: email,
        from,
        subject: `Sign in link for Route Studio`,
        text: 'Sign in link for Route Studio',
        html: html({url, email}),
      },
      error => {
        if (error) {
          return reject(new Error('SEND_VERIFICATION_EMAIL_ERROR'));
        }
        return resolve();
      },
    );
  });
};

interface Args {
  url: string;
  email: string;
}

const html = ({url, email}: Args): string => {
  const escapedEmail = `${email?.replace(/\./g, '&#8203;.')}`;

  const backgroundColor = '#f9f9f9';
  const textColor = '#444444';
  const mainBackgroundColor = '#ffffff';
  const buttonBackgroundColor = '#346df1';
  const buttonBorderColor = '#346df1';
  const buttonTextColor = '#ffffff';

  return `
    <body style="background: ${backgroundColor};">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            Hi! 👋 You asked us to send you a a sign in link for Route Studio.
          </td>
        </tr>
      </table>
      <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            Sign in as <strong>${escapedEmail}</strong>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in to Route Studio</a></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            This link will expire in 24 hours and can only be used once, but you can always request another link.
          </td>
        </tr>
      </table>
    </body>`;
};

const options: NextAuthOptions = {
  providers: [
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST || '',
        port: process.env.NODE_ENV === 'production' ? 465 : 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER || '',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      },
      sendVerificationRequest,
      from: process.env.EMAIL_FROM,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
