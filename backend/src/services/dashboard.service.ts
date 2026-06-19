import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardMetrics = async () => {
  // 1. Общее количество товаров на складе
  const allBatches = await prisma.batch.findMany({
    include: { medication: true }
  });
  
  let totalItems = 0;
  const stockByMedication = new Map<number, { name: string, quantity: number, minQuantity: number }>();
  
  for (const batch of allBatches) {
    totalItems += batch.quantity;
    
    if (!stockByMedication.has(batch.medicationId)) {
      stockByMedication.set(batch.medicationId, {
        name: batch.medication.name,
        quantity: 0,
        minQuantity: batch.medication.minQuantity
      });
    }
    const item = stockByMedication.get(batch.medicationId)!;
    item.quantity += batch.quantity;
  }

  // 2. Критические остатки
  const criticalItems = Array.from(stockByMedication.values()).filter(item => item.quantity <= item.minQuantity);

  // 3. ТОП-10 расходуемых товаров
  const outflows = await prisma.transaction.groupBy({
    by: ['medicationId'],
    where: { type: 'OUTFLOW' },
    _sum: { quantity: true },
    orderBy: {
      _sum: { quantity: 'desc' }
    },
    take: 10
  });

  const top10Ids = outflows.map(o => o.medicationId);
  const top10Medications = await prisma.medication.findMany({
    where: { id: { in: top10Ids } }
  });

  const top10Consumed = outflows.map(outflow => {
    const med = top10Medications.find(m => m.id === outflow.medicationId);
    return {
      medicationName: med?.name || 'Unknown',
      totalConsumed: outflow._sum.quantity
    };
  });

  return {
    overview: {
      totalItemsInStock: totalItems,
      totalUniqueMedications: stockByMedication.size,
      criticalItemsCount: criticalItems.length
    },
    criticalItems,
    top10Consumed
  };
};
