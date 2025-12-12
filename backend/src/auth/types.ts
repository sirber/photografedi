import type { Request } from 'express';
import type { UserInterface } from '../user/types/user.interface';

// AuthRequest exposes `user` as a partial of your UserInterface so controllers
// can access fields like `username` without casting.
export type AuthRequest = Request & {
  user?: Partial<UserInterface>;
  isAuthenticated?: () => boolean;
};
