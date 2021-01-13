import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { InitOptions } from 'next-auth';
import Providers from 'next-auth/providers';
import config from '@/config';

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: config.auth.githubId,
      clientSecret: config.auth.githubSecret,
    }),
  ],
  jwt: {
    secret: config.auth.jwtSecret,
    encryption: true,
  },
};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
  NextAuth(req, res, options);
