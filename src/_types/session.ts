import 'express-session';

declare module 'express-session' {
  interface Session {
    lastQuery?: string;
    nonce?: string;
  }
}
