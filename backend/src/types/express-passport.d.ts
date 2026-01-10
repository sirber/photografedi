// Minimal user shape for Drizzle-based users table
declare global {
  namespace Express {
    interface User {
      id?: number | string;
      username?: string;
      email?: string;
      // allow additional fields (providers, public_key, etc.)
      [key: string]: unknown;
    }
    interface Request {
      logIn(user: Express.User, cb: (err?: Error) => void): void;
    }
  }
}

export {};
