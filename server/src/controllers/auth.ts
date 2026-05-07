import { compareSync, hashSync } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad_requests";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { SignUpSchema } from "../schema/users";
import { JWT_SECRET } from "../secrets";



export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignUpSchema.parse(req.body);
  const { email, password, name, phoneNumber } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw new BadRequestsException(
      "User already exists!",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      phoneNumber,
      password: hashSync(password, 10),
    },
  });

  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestsException(
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );

  res.json({ user, token });
};


export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};



export const removeAccount = async (req: Request, res: Response) => {
  try {
    await prismaClient.user.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ success: true });
  } catch (err) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
};
