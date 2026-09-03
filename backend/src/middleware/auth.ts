import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { UserRole, UserStatus } from '../config/constants';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication token is missing' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super_secret_raiseit_jwt_key_development_2026';
    const decoded = jwt.verify(token, secret) as { userId: string; role: string };

    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      res.status(401).json({ message: 'User not found or session invalid' });
      return;
    }

    if (user.status === UserStatus.INACTIVE) {
      res.status(403).json({ message: 'User account has been deactivated' });
      return;
    }

    if (user.status === UserStatus.PENDING) {
      res.status(403).json({ message: 'Authority account is pending admin approval' });
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]`
      });
      return;
    }

    next();
  };
};

/**
 * Strict Authority Department Validation (PRD Section 6.2 & Scenario 7)
 * Ensures authorities can only access or modify reports belonging to their department
 */
export const validateAuthorityDepartment = (
  reportDepartmentId: string,
  user: IUser
): boolean => {
  if (user.role === UserRole.ADMIN) return true;
  if (user.role === UserRole.AUTHORITY) {
    if (!user.departmentId) return false;
    return user.departmentId.toString() === reportDepartmentId.toString();
  }
  return false;
};
