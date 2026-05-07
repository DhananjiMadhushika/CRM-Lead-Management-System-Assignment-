import { Router } from "express";
import authRoutes from "./auth";
import usersRouter from "./users";
import dashboardRouter from "./dashboard";
import notesRouter from "./notes";
import leadsRouter from "./leads";



const rootRouter:Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/leads',     leadsRouter);
rootRouter.use('/notes',     notesRouter);
rootRouter.use('/dashboard', dashboardRouter);
rootRouter.use('/users',     usersRouter);

export default rootRouter;
