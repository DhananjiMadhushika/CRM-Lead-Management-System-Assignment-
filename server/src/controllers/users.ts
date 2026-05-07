import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFoundException } from '../exceptions/not-found';
import { BadRequestsException } from '../exceptions/bad_requests';
import { ErrorCode } from '../exceptions/root';
import { compareSync, hashSync } from 'bcryptjs';
import { z } from 'zod';


export const getUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    select:  { id: true, name: true, email: true, role: true },
    orderBy: { name: 'asc' },
  });
  res.json(users);
};

export const updateProfile = async (req: Request, res: Response) => {
  const targetId = +req.params.id;


  if (req.user!.id !== targetId && req.user!.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const schema = z.object({
    name:  z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email').optional(),
  });

  const data = schema.parse(req.body);


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

export const updatePassword = async (req: Request, res: Response) => {
  const targetId = +req.params.id;

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