import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { CreateLeadSchema, UpdateLeadSchema, UpdateStatusSchema } from '../schema/leads';


// GET /api/leads
export const getLeads = async (req: Request, res: Response) => {
  const { status, source, assignedToId, search, page = '1', limit = '20' } = req.query;

  const where: any = {};
  if (status)       where.status       = status;
  if (source)       where.source       = source;
  if (assignedToId) where.assignedToId = +assignedToId;

  if (search) {
    where.OR = [
      { name:    { contains: search as string } },
      { company: { contains: search as string } },
      { email:   { contains: search as string } },
    ];
  }

  const skip  = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take  = parseInt(limit as string);

  const [leads, total] = await Promise.all([
    prismaClient.lead.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        _count:     { select: { notes: true } },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take,
    }),
    prismaClient.lead.count({ where }),
  ]);

  res.json({
    leads,
    pagination: {
      total,
      page:       parseInt(page as string),
      limit:      take,
      totalPages: Math.ceil(total / take),
    },
  });
};

// GET /api/leads/:id
export const getLeadById = async (req: Request, res: Response) => {
  const lead = await prismaClient.lead.findUnique({
    where:   { id: +req.params.id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      notes: {
        include: { createdBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!lead) throw new NotFoundException('Lead not found', ErrorCode.LEAD_NOT_FOUND);
  res.json(lead);
};

// POST /api/leads
export const createLead = async (req: Request, res: Response) => {
  const data = CreateLeadSchema.parse(req.body);

  const lead = await prismaClient.lead.create({
    data: {
      ...data,
      dealValue:    data.dealValue ?? 0,
      assignedToId: data.assignedToId ?? req.user!.id,
    },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });

  res.status(201).json(lead);
};

// PUT /api/leads/:id
export const updateLead = async (req: Request, res: Response) => {
  const existing = await prismaClient.lead.findUnique({ where: { id: +req.params.id } });
  if (!existing) throw new NotFoundException('Lead not found', ErrorCode.LEAD_NOT_FOUND);

  const data = UpdateLeadSchema.parse(req.body);

  const lead = await prismaClient.lead.update({
    where:   { id: +req.params.id },
    data,
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  });

  res.json(lead);
};

// PATCH /api/leads/:id/status
export const updateLeadStatus = async (req: Request, res: Response) => {
  const existing = await prismaClient.lead.findUnique({ where: { id: +req.params.id } });
  if (!existing) throw new NotFoundException('Lead not found', ErrorCode.LEAD_NOT_FOUND);

  const { status } = UpdateStatusSchema.parse(req.body);

  const lead = await prismaClient.lead.update({
    where:   { id: +req.params.id },
    data:    { status },
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  });

  res.json(lead);
};

// DELETE /api/leads/:id
export const deleteLead = async (req: Request, res: Response) => {
  const existing = await prismaClient.lead.findUnique({ where: { id: +req.params.id } });
  if (!existing) throw new NotFoundException('Lead not found', ErrorCode.LEAD_NOT_FOUND);

  await prismaClient.lead.delete({ where: { id: +req.params.id } });
  res.json({ success: true, message: 'Lead deleted' });
};