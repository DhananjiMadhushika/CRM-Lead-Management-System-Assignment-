import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import { getNotesByLead, createNote, deleteNote } from '../controllers/notes';

const notesRouter: Router = Router();

notesRouter.use(authMiddleware);

notesRouter.get('/lead/:leadId', errorHandler(getNotesByLead));
notesRouter.post('/',            errorHandler(createNote));
notesRouter.delete('/:id',       errorHandler(deleteNote));

export default notesRouter;