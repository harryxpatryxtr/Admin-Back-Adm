const getConfig = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const configuredOrigins = process.env.CORS_ORIGINS
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    PORT: Number(process.env.PORT || 3001),
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '15m',
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',
    NODE_ENV: nodeEnv,
    TRUST_PROXY: process.env.TRUST_PROXY === 'true',
    CORS_ORIGINS:
      configuredOrigins ??
      (nodeEnv === 'production'
        ? []
        : ['http://localhost:3000', 'http://localhost:5173']),
    PUBLIC_REGISTRATION_ENABLED:
      process.env.PUBLIC_REGISTRATION_ENABLED === 'true',
  };
};

const validateConfig = () => {
  const config = getConfig();

  if (!Number.isInteger(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  if (!config.MONGODB_URI) {
    throw new Error('MONGODB_URI must be configured');
  }

  if (!config.JWT_SECRET || Buffer.byteLength(config.JWT_SECRET) < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes');
  }

  const validDuration = (value) => {
    const match = /^(\d+)(ms|s|m|h|d|w|y)$/i.exec(value);
    return Boolean(match && Number(match[1]) > 0);
  };
  if (!validDuration(config.JWT_EXPIRE) || !validDuration(config.JWT_REFRESH_EXPIRE)) {
    throw new Error('JWT expirations must use a positive duration such as 15m or 7d');
  }

  for (const origin of config.CORS_ORIGINS) {
    let parsedOrigin;
    try {
      parsedOrigin = new URL(origin);
    } catch {
      throw new Error('CORS_ORIGINS must contain valid HTTP or HTTPS origins');
    }
    if (!['http:', 'https:'].includes(parsedOrigin.protocol) || parsedOrigin.origin !== origin) {
      throw new Error('CORS_ORIGINS must contain valid HTTP or HTTPS origins without paths');
    }
  }

  if (config.NODE_ENV === 'production' && config.CORS_ORIGINS.length === 0) {
    throw new Error('CORS_ORIGINS must be configured in production');
  }

  return config;
};

module.exports = { getConfig, validateConfig };
