import { Request, Response } from 'express';
import { z } from 'zod';
import { prismaClient } from '..';
import { NotFoundException }  from '../exceptions/not-found';

import { ErrorCode } from '../exceptions/root';
import { ForbiddenException } from '../exceptions/forbidden';

const CreateNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
  leadId:  z.number().int().positive(),
});

// GET /api/notes/lead/:leadId
export const getNotesByLead = async (req: Request, res: Response) => {
  const leadId = +req.params.leadId;

  const lead = await prismaClient.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new NotFoundException('Lead not found', ErrorCode.LEAD_NOT_FOUND);

  const notes = await prismaClient.note.findMany({
    where:   { leadId },
    include: { createdBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json(notes);
};

// POST /api/notes
export const createNote = async (req: Request, res: Response) => {
  const { content, leadId } = CreateNoteSchema.parse(req.body);

  const lead = await prismaClient.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new NotFoundException('Lead not found', ErrorCode.LEAD_NOT_FOUND);

  const note = await prismaClient.note.create({
    data: {
      content,
      leadId,
      userId: req.user!.id,
    },
    include: { createdBy: { select: { id: true, name: true } } },
  });

  res.status(201).json(note);
};

// DELETE /api/notes/:id
export const deleteNote = async (req: Request, res: Response) => {
  const note = await prismaClient.note.findUnique({ where: { id: +req.params.id } });
  if (!note) throw new NotFoundException('Note not found', ErrorCode.NOTE_NOT_FOUND);

  // Only the author or an admin may delete
  if (note.userId !== req.user!.id && req.user!.role !== 'admin') {
    throw new ForbiddenException('Not authorized to delete this note', ErrorCode.FORBIDDEN);
  }

  await prismaClient.note.delete({ where: { id: +req.params.id } });
  res.json({ success: true, message: 'Note deleted' });
};