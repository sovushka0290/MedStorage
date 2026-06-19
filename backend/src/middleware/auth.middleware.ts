import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.API_KEY || 'MedSkladSecretKey123';

  // 1. Проверка API Key (Для внешних систем или дев-скриптов)
  if (apiKey && apiKey === expectedApiKey) {
    // В MVP можно замокать юзера при использовании API ключа
    const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (user) {
      (req as any).user = user;
    }
    return next();
  }

  // 2. Проверка JWT токена (Для мобильного приложения и веба)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Доступ запрещен: отсутствует JWT токен или API-ключ',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
};
