import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import type { PrismaClient } from '../generated/prisma/index.js';
import { PrismaClient as PrismaClientCtor } from '../generated/prisma/index.js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma: PrismaClient = new PrismaClientCtor({ adapter });

async function seedLotStatuses(): Promise<void> {
  const count = await prisma.lotStatus.count();
  if (count > 0) return;
  await prisma.lotStatus.createMany({
    data: [
      { name: 'Active', description: 'Lot in progress' },
      { name: 'Closed', description: 'Lot closed/sold' },
      { name: 'Pending', description: 'Lot pending start' },
    ],
  });
}

async function seedAnimalStatuses(): Promise<void> {
  const count = await prisma.animalStatus.count();
  if (count > 0) return;
  await prisma.animalStatus.createMany({
    data: [
      { name: 'Healthy', description: 'Animal in good condition' },
      { name: 'Sold', description: 'Animal sold' },
      { name: 'Deceased', description: 'Animal deceased' },
    ],
  });
}

async function seedPurchaseStatuses(): Promise<void> {
  const count = await prisma.purchaseStatus.count();
  if (count > 0) return;
  await prisma.purchaseStatus.createMany({
    data: [
      { name: 'Pending', description: 'Purchase pending payment' },
      { name: 'Paid', description: 'Purchase paid' },
      { name: 'Cancelled', description: 'Purchase cancelled' },
    ],
  });
}

async function seedExpenseCategories(): Promise<void> {
  const count = await prisma.expenseCategory.count();
  if (count > 0) return;
  await prisma.expenseCategory.createMany({
    data: [
      { name: 'Feed', description: 'Animal feed' },
      { name: 'Veterinary', description: 'Veterinary costs' },
      { name: 'Transport', description: 'Transportation' },
      { name: 'Other', description: 'Other expenses' },
    ],
  });
}

async function seedExpenseStatuses(): Promise<void> {
  const count = await prisma.expenseStatus.count();
  if (count > 0) return;
  await prisma.expenseStatus.createMany({
    data: [
      { name: 'Pending', description: 'Expense pending payment' },
      { name: 'Paid', description: 'Expense paid' },
      { name: 'Rejected', description: 'Expense rejected' },
    ],
  });
}

async function seedCostCategories(): Promise<void> {
  const count = await prisma.costCategory.count();
  if (count > 0) return;
  await prisma.costCategory.createMany({
    data: [
      { name: 'Infrastructure', description: 'Farm infrastructure' },
      { name: 'Utilities', description: 'Water, electricity, etc.' },
      { name: 'Labour', description: 'Labour costs' },
      { name: 'Other', description: 'Other general costs' },
    ],
  });
}

async function seedLoanStatuses(): Promise<void> {
  const count = await prisma.loanStatus.count();
  if (count > 0) return;
  await prisma.loanStatus.createMany({
    data: [
      { name: 'Active', description: 'Loan active' },
      { name: 'Settled', description: 'Loan settled' },
      { name: 'Defaulted', description: 'Loan defaulted' },
    ],
  });
}

async function seedUsers(): Promise<void> {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
  });
}

async function seedDemoData(): Promise<void> {
  const farmCount = await prisma.farm.count();
  if (farmCount > 0) return;

  const [
    lotStatusActive,
    animalStatusHealthy,
    purchaseStatusPaid,
    expenseCategoryFeed,
    expenseStatusPaid,
    costCategoryOther,
    loanStatusActive,
  ] = await Promise.all([
    prisma.lotStatus.findFirst({ where: { name: 'Active' } }),
    prisma.animalStatus.findFirst({ where: { name: 'Healthy' } }),
    prisma.purchaseStatus.findFirst({ where: { name: 'Paid' } }),
    prisma.expenseCategory.findFirst({ where: { name: 'Feed' } }),
    prisma.expenseStatus.findFirst({ where: { name: 'Paid' } }),
    prisma.costCategory.findFirst({ where: { name: 'Other' } }),
    prisma.loanStatus.findFirst({ where: { name: 'Active' } }),
  ]);

  if (
    !lotStatusActive ||
    !animalStatusHealthy ||
    !purchaseStatusPaid ||
    !expenseCategoryFeed ||
    !expenseStatusPaid ||
    !costCategoryOther ||
    !loanStatusActive
  ) {
    throw new Error(
      'Lookup data missing: run seed again after status/category seeds',
    );
  }

  const farm = await prisma.farm.create({
    data: {
      name: 'Demo Farm',
      location: 'Central Region',
      phone: '+1234567890',
    },
  });

  const company = await prisma.company.create({
    data: {
      name: 'Livestock Co',
      description: 'Cattle supplier',
      phone: '+0987654321',
      address: 'Supplier St 100',
    },
  });

  const lot = await prisma.lot.create({
    data: {
      farmId: farm.id,
      statusId: lotStatusActive.id,
      entryWeight: 1200.5,
      totalCost: 15000,
      date: new Date('2025-01-15'),
    },
  });

  const purchase = await prisma.purchase.create({
    data: {
      companyId: company.id,
      statusId: purchaseStatusPaid.id,
      amount: 5000,
      date: new Date('2025-01-10'),
      product: 'Initial cattle purchase',
    },
  });

  await prisma.animal.createMany({
    data: [
      {
        lotId: lot.id,
        statusId: animalStatusHealthy.id,
        weight: 250.5,
        nickname: 'Spot',
        sequenceNumber: 1,
      },
      {
        lotId: lot.id,
        statusId: animalStatusHealthy.id,
        weight: 280.0,
        nickname: 'Brown',
        sequenceNumber: 2,
      },
      {
        lotId: lot.id,
        statusId: animalStatusHealthy.id,
        weight: 265.0,
        sequenceNumber: 3,
      },
    ],
  });

  await prisma.expense.create({
    data: {
      lotId: lot.id,
      purchaseId: purchase.id,
      categoryId: expenseCategoryFeed.id,
      statusId: expenseStatusPaid.id,
      amount: 500,
      description: 'Feed for first month',
      date: new Date('2025-01-20'),
    },
  });

  await prisma.cost.create({
    data: {
      categoryId: costCategoryOther.id,
      amount: 200,
      date: new Date('2025-01-01'),
    },
  });

  await prisma.loan.create({
    data: {
      purchaseId: purchase.id,
      lotId: lot.id,
      statusId: loanStatusActive.id,
      amount: 3000,
      description: 'Initial financing',
      cashAmount: 2000,
      date: new Date('2025-01-10'),
    },
  });

  const lotSale = await prisma.lotSale.create({
    data: {
      lotId: lot.id,
      date: new Date('2025-02-01'),
      buyer: 'Buyer Inc',
      totalHeads: 3,
      notes: 'Demo sale',
    },
  });

  const animals = await prisma.animal.findMany({
    where: { lotId: lot.id },
    orderBy: { sequenceNumber: 'asc' },
  });
  for (let i = 0; i < animals.length; i++) {
    await prisma.animalSale.create({
      data: {
        lotSaleId: lotSale.id,
        animalId: animals[i].id,
        exitWeight: animals[i].weight + 10,
        averageWeight: animals[i].weight + 5,
        date: lotSale.date,
      },
    });
  }

  await prisma.operationClosure.create({
    data: {
      lotSaleId: lotSale.id,
      livestockPrice: 5.5,
      finalLivestockWeight: 800,
      totalExpenseFarm: 700,
      totalExpenseMediator: 300,
      loanAmountAtSale: 3000,
      profitFarm: 1200,
      profitMediator: 500,
      initialInvestment: 15000,
    },
  });
}

async function main(): Promise<void> {
  await seedLotStatuses();
  await seedAnimalStatuses();
  await seedPurchaseStatuses();
  await seedExpenseCategories();
  await seedExpenseStatuses();
  await seedCostCategories();
  await seedLoanStatuses();
  await seedUsers();
  await seedDemoData();
  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
