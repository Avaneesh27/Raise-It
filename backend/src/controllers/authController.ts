import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { UserRole, UserStatus } from '../config/constants';
import { registerSchema, loginSchema } from '../validators';
import { AuthRequest } from '../middleware/auth';

const generateToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'super_secret_raiseit_jwt_key_development_2026';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;
  return jwt.sign({ userId, role }, secret, { expiresIn });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: validated.email });
    if (existing) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    // Citizens are ACTIVE by default; Authorities require admin approval (PENDING)
    const role = validated.role || UserRole.CITIZEN;
    const status = role === UserRole.AUTHORITY ? UserStatus.PENDING : UserStatus.ACTIVE;

    const user = await User.create({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      passwordHash,
      role,
      status,
      departmentId: validated.departmentId || undefined
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      message:
        role === UserRole.AUTHORITY
          ? 'Authority account created and pending administrator verification'
          : 'Registration successful',
      token: status === UserStatus.ACTIVE ? token : undefined,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        departmentId: user.departmentId
      }
    });
  } catch (err: any) {
    res.status(400).json({ message: err.errors?.[0]?.message || err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validated.email }).populate('departmentId');
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    if (user.status === UserStatus.INACTIVE) {
      res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
      return;
    }

    if (user.status === UserStatus.PENDING) {
      res.status(403).json({ message: 'Your authority account is pending administrator approval.' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        department: user.departmentId
      }
    });
  } catch (err: any) {
    res.status(400).json({ message: err.errors?.[0]?.message || err.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user._id)
      .select('-passwordHash')
      .populate('departmentId', 'name code');

    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
