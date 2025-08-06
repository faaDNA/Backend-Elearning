import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/authenticated-request-type';

const onlyAdminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        statusCode: 403,
        message: 'Akses ditolak! Hanya student yang diperbolehkan.',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      message: 'Token invalid atau kedaluwarsa!',
    });
  }
};

module.exports = onlyAdminMiddleware;
