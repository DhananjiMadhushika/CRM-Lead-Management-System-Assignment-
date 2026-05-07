import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFoundException } from '../exceptions/not-found';
import { BadRequestsException } from '../exceptions/bad_requests';
import { ErrorCode } from '../exceptions/root';
import { compareSync, hashSync } from 'bcryptjs';
import { z } from 'zod';

// GET /api/users  — for the "assign to" dropdown in the frontend
export const getUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    select:  { id: true, name: true, email: true, role: true },
    orderBy: { name: 'asc' },
  });
  res.json(users);
};

// PATCH /api/users/:id/profile  — update name and email
export const updateProfile = async (req: Request, res: Response) => {
  const targetId = +req.params.id;

  // Users can only update their own profile; admins can update anyone
  if (req.user!.id !== targetId && req.user!.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const schema = z.object({
    name:  z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email').optional(),
  });

  const data = schema.parse(req.body);

  // Check email uniqueness if being changed
  if (data.email) {
    const existing = await prismaClient.user.findFirst({
      where: { email: data.email, NOT: { id: targetId } },
    });
    if (existing) {
      throw new BadRequestsException('Email already in use', ErrorCode.USER_ALREADY_EXISTS);
    }
  }

  const user = await prismaClient.user.update({
    where:  { id: targetId },
    data,
    select: { id: true, name: true, email: true, role: true },
  });

  res.json(user);
};

// PATCH /api/users/:id/password  — change password
export const updatePassword = async (req: Request, res: Response) => {
  const targetId = +req.params.id;

  // Only the account owner can change their password
  if (req.user!.id !== targetId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const schema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword:     z.string().min(8, 'Password must be at least 8 characters'),
  });

  const { currentPassword, newPassword } = schema.parse(req.body);

  const user = await prismaClient.user.findUnique({ where: { id: targetId } });
  if (!user) throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);

  if (!compareSync(currentPassword, user.password)) {
    throw new BadRequestsException('Current password is incorrect', ErrorCode.INCORRECT_PASSWORD);
  }

  await prismaClient.user.update({
    where: { id: targetId },
    data:  { password: hashSync(newPassword, 10) },
  });

  res.json({ success: true, message: 'Password updated successfully' });
};