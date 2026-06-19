import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProcedure = async (data: { name: string, description?: string, norms: { medicationId: number, expectedQuantity: number, tolerancePercent: number }[] }) => {
  return prisma.procedure.create({
    data: {
      name: data.name,
      description: data.description,
      norms: {
        create: data.norms.map(norm => ({
          medicationId: norm.medicationId,
          expectedQuantity: norm.expectedQuantity,
          tolerancePercent: norm.tolerancePercent
        }))
      }
    },
    include: { norms: true }
  });
};

export const logProcedure = async (data: { procedureId: number, locationId: number, userId: number }) => {
  return prisma.procedureLog.create({
    data: {
      procedureId: data.procedureId,
      locationId: data.locationId,
      userId: data.userId
    }
  });
};

export const getProcedureComparison = async () => {
  // Агрегируем данные по процедурам
  const procedures = await prisma.procedure.findMany({
    include: { norms: { include: { medication: true } }, logs: true }
  });

  const comparison = procedures.map(proc => {
    const logsCount = proc.logs.length;
    const expected = proc.norms.map(norm => {
      const expectedTotal = norm.expectedQuantity * logsCount;
      const minAllowed = expectedTotal * (1 - norm.tolerancePercent / 100);
      const maxAllowed = expectedTotal * (1 + norm.tolerancePercent / 100);
      
      return {
        medicationId: norm.medicationId,
        medicationName: norm.medication.name,
        expectedTotal,
        minAllowed,
        maxAllowed,
        tolerancePercent: norm.tolerancePercent
      };
    });

    return {
      procedureId: proc.id,
      procedureName: proc.name,
      timesPerformed: logsCount,
      expectedUsage: expected
    };
  });

  return comparison;
};
