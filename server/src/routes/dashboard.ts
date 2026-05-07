import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import { getDashboardStats } from '../controllers/dashboard';

const dashboardRouter: Router = Router();

dashboardRouter.use(authMiddleware);
dashboardRouter.get('/stats', errorHandler(getDashboardStats));

export default dashboardRouter;