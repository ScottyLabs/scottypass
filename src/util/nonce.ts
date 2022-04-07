import { randomBytes } from 'crypto';

export const generateNonce = (): string => randomBytes(16).toString('base64');
