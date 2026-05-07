import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import { createLead, deleteLead, getLeadById, getLeads, updateLead, updateLeadStatus } from '../controllers/lead';


const leadsRouter: Router = Router();

leadsRouter.use(authMiddleware); // all lead routes require login

leadsRouter.get('/',           errorHandler(getLeads));
leadsRouter.get('/:id',        errorHandler(getLeadById));
leadsRouter.post('/',          errorHandler(createLead));
leadsRouter.put('/:id',        errorHandler(updateLead));
leadsRouter.patch('/:id/status', errorHandler(updateLeadStatus));
leadsRouter.delete('/:id',     errorHandler(deleteLead));

export default leadsRouter;