import crypto from 'node:crypto';
import config from '../config';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // AES block size

/**
 * Derive a 32-byte (256-bit) key from the configured encryption key using PBKDF2.
 * Uses a fixed salt (derived from the key itself) for deterministic derivation.
 */
function deriveKey(): Buffer {
  const rawKey = config.passportEncryptionKey;
  // Use the first 16 bytes of SHA-256 of the key as the salt
  const salt = crypto.createHash('sha256').update(`salt:${rawKey}`).digest().subarray(0, 16);
  return crypto.pbkdf2Sync(rawKey, salt, 100000, 32, 'sha256');
}

/**
 * Encrypt a plaintext passport number.
 * Returns base64-encoded string: iv + ciphertext
 */
export function encryptPassport(plaintext: string): string {
  const key = deriveKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Prepend IV (base64 encoded) with a separator
  const ivBase64 = iv.toString('base64');
  return `${ivBase64}:${encrypted}`;
}

/**
 * Decrypt an encrypted passport number back to plaintext.
 */
export function decryptPassport(encrypted: string): string {
  const key = deriveKey();
  const [ivBase64, ciphertext] = encrypted.split(':');

  if (!ivBase64 || !ciphertext) {
    throw new Error('Invalid encrypted passport format');
  }

  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
