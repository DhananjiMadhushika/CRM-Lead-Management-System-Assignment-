import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@crm.com',
      password: hashSync('admin123', 10),
      role: 'admin',
    },
  });

  const sales = await prisma.user.create({
    data: {
      name: 'John Sales',
      email: 'sales@crm.com',
      password: hashSync('sales123', 10),
      role: 'salesperson',
    },
  });

  await prisma.lead.createMany({
    data: [
      {
        name: 'Alice Johnson',
        company: 'Tech Corp',
        email: 'alice@techcorp.com',
        phone: '+1-555-0101',
        status: 'NEW',
        source: 'WEBSITE',
        dealValue: 25000,
        priority: 'HIGH',
        assignedToId: sales.id,
      },
      {
        name: 'Bob Smith',
        company: 'Startup Inc',
        email: 'bob@startup.com',
        phone: '+1-555-0102',
        status: 'CONTACTED',
        source: 'LINKEDIN',
        dealValue: 15000,
        priority: 'MEDIUM',
        assignedToId: sales.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });