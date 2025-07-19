import { Request as ExpressRequest } from 'express';

export type AuthenticatedRequest = ExpressRequest & {
  user: {
    id: number;
    name?: string;
    email?: string;
    role?: string;
  },
};
