import { Request, Response, NextFunction } from 'express';

export const roleGuard = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не идентифицирован (добавьте заголовок x-user-id)' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        error: `Доступ запрещен. У вас роль ${user.role}, а требуется одна из: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};
