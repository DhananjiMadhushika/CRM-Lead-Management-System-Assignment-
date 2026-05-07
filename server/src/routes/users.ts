import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import { getUsers, updateProfile, updatePassword } from '../controllers/users';

const usersRouter: Router = Router();

usersRouter.use(authMiddleware);

usersRouter.get('/',                      errorHandler(getUsers));
usersRouter.patch('/:id/profile',         errorHandler(updateProfile));
usersRouter.patch('/:id/password',        errorHandler(updatePassword));

export default usersRouter;