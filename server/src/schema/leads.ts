import { z } from 'zod';

// These must exactly match your Prisma LeadSource enum
const LeadSourceEnum = z.enum([
  'WEBSITE',
  'LINKEDIN',
  'REFERRAL',
  'COLD_EMAIL',   // ← your Prisma schema uses COLD_EMAIL (not COLD_CALL)
  'EVENT',
  'OTHER',
]);

const LeadStatusEnum = z.enum([
  'NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST',
]);

const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const CreateLeadSchema = z.object({
  name:         z.string().min(1, 'Name is required'),
  email:        z.string().email('Invalid email'),
  company:      z.string().default(''),
  phone:        z.string().optional().default(''),
  source:       LeadSourceEnum.default('WEBSITE'),
  status:       LeadStatusEnum.default('NEW'),
  priority:     PriorityEnum.default('MEDIUM'),
  dealValue:    z.number().nonnegative().optional(),
  assignedToId: z.number().int().positive().optional(),
});

export const UpdateLeadSchema = z.object({
  name:         z.string().min(1).optional(),
  email:        z.string().email().optional(),
  company:      z.string().optional(),
  phone:        z.string().optional(),
  source:       LeadSourceEnum.optional(),
  status:       LeadStatusEnum.optional(),
  priority:     PriorityEnum.optional(),
  dealValue:    z.number().nonnegative().optional(),
  assignedToId: z.number().int().positive().optional().nullable(),
});

export const UpdateStatusSchema = z.object({
  status: LeadStatusEnum,
});