const getEnvString = (field: string, defaultValue?: string): string => {
  return process.env[field] || defaultValue;
};

const getEnvNumber = (field: string, defaultValue?: number): number => {
  const result = getEnvString(field);

  return typeof result === 'string' ? parseInt(result, 10) : defaultValue;
};

const config = {
  agora: {
    appId: getEnvString('NEXT_PUBLIC_AGORA_APP_ID'),
    testToken: getEnvString('NEXT_PUBLIC_AGORA_TEST_TOKEN'),
    certificate: getEnvString('AGORA_CERTIFICATE'),
  },
  auth: {
    githubId: getEnvString('GITHUB_ID'),
    githubSecret: getEnvString('GITHUB_SECRET'),
    hashSaltRound: getEnvNumber('HASH_SALT_ROUND'),
    password: getEnvString('PASSWORD'),
    jwtSecret: getEnvString('JWT_SECRET'),
    jwtExpiration: getEnvNumber('JWT_EXPIRATION'),
  },
  adminEmail: process.env.ADMIN_EMAIL,
};

export default config;
