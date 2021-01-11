import { compare, hashSync } from 'bcrypt';
import config from '@/config';

const SALT_ROUNDS = 10;

const hashedPassword = hashSync(config.password, SALT_ROUNDS);

export const isValidPassword = async (password: string): Promise<boolean> => {
  try {
    const success = await compare(password, hashedPassword);
    return success;
  } catch (error) {
    console.error(error);
    return false;
  }
};
