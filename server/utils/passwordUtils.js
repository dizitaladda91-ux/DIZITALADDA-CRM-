import bcrypt from 'bcryptjs';

export const isBcryptHash = (value) =>
  typeof value === 'string' && value.startsWith('$2');

export const verifyStoredPassword = async (providedPassword, storedPassword) => {
  if (!providedPassword || !storedPassword) {
    return false;
  }

  const normalizedProvided = providedPassword.trim();
  const normalizedStored = storedPassword.trim();

  if (isBcryptHash(normalizedStored)) {
    return bcrypt.compare(normalizedProvided, normalizedStored);
  }

  return normalizedProvided === normalizedStored;
};
