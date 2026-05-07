import { Request, Response } from 'express';
import { prismaClient } from '..';

export const getDashboardStats = async (req: Request, res: Response) => {
  const [
    totalLeads,
    statusGroups,
    totalValue,
    wonValue,
    sourceGroups,
    recentLeads,
    topSalespeople,
  ] = await Promise.all([
    prismaClient.lead.count(),

    prismaClient.lead.groupBy({
      by:    ['status'],
      _count: { status: true },
    }),

    prismaClient.lead.aggregate({
      _sum: { dealValue: true },
    }),

    prismaClient.lead.aggregate({
      where: { status: 'WON' },
      _sum:  { dealValue: true },
    }),

    prismaClient.lead.groupBy({
      by:    ['source'],
      _count: { source: true },
    }),

    prismaClient.lead.findMany({
      take:    5,
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: { select: { id: true, name: true } } },
    }),

    prismaClient.lead.groupBy({
      by:    ['assignedToId'],
      where: { status: 'WON' },
      _count: { assignedToId: true },
      _sum:   { dealValue: true },
      orderBy: { _sum: { dealValue: 'desc' } },
      take:   5,
    }),
  ]);

  const byStatus: Record<string, number> = {};
  statusGroups.forEach(g => { byStatus[g.status] = g._count.status; });

  const bySource: Record<string, number> = {};
  sourceGroups.forEach(g => { bySource[g.source] = g._count.source; });

  const userIds = topSalespeople
    .filter(g => g.assignedToId != null)
    .map(g => g.assignedToId!);

  const users = await prismaClient.user.findMany({
    where:  { id: { in: userIds } },
    select: { id: true, name: true },
  });
  const userMap: Record<number, string> = {};
  users.forEach(u => { userMap[u.id] = u.name; });

  const enrichedTop = topSalespeople.map(g => ({
    name:     g.assignedToId ? userMap[g.assignedToId] ?? 'Unknown' : 'Unassigned',
    wonDeals: g._count.assignedToId,
    wonValue: Number(g._sum.dealValue ?? 0),
  }));

  res.json({
    totalLeads,
    newLeads:          byStatus['NEW']           ?? 0,
    contactedLeads:    byStatus['CONTACTED']      ?? 0,
    qualifiedLeads:    byStatus['QUALIFIED']      ?? 0,
    proposalSentLeads: byStatus['PROPOSAL_SENT']  ?? 0,
    wonLeads:          byStatus['WON']            ?? 0,
    lostLeads:         byStatus['LOST']           ?? 0,
    totalDealValue:    Number(totalValue._sum.dealValue ?? 0),
    totalWonValue:     Number(wonValue._sum.dealValue   ?? 0),
    bySource,
    recentLeads,
    topSalespeople:    enrichedTop,
  });
};