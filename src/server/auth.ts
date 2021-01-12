import jwt from 'jsonwebtoken';
import { compare, hashSync } from 'bcrypt';
import type { NextApiRequest } from 'next';
import type { User } from './user-service';
import config from '@/config/index';

const hashedPassword = hashSync(config.auth.password, config.auth.hashSalt);

export const isValidPassword = async (password: string): Promise<boolean> => {
  try {
    const success = await compare(password, hashedPassword);
    return success;
  } catch (error) {
    console.error('isValidPassword', error);
    return false;
  }
};

export const issueToken = (user: User): string => {
  return jwt.sign(user, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiration,
  });
};

export const verifyToken = (authorization: string): User | null => {
  try {
    return jwt.verify(
      authorization.replace('Bearer ', ''),
      config.auth.jwtSecret,
    ) as User;
  } catch (error) {
    console.error('verifyToken', error);
    return null;
  }
};

export const extractTokenOwner = (req: NextApiRequest): User | null => {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    return null;
  }

  return verifyToken(authorization);
};
