import prisma from '../config/prisma.js';

export default async function adminGuard(req, res, next) {
  if (!req.user) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden : Admin access only.'
    });
  }

  let role = req.user.role;
  const userId = req.user.userId || req.user.id;

  if (role !== 'ADMIN' && userId) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, username: true, email: true }
      });
      if (dbUser && dbUser.role === 'ADMIN') {
        req.user.role = 'ADMIN';
        role = 'ADMIN';
      }
    } catch (e) { }
  }

  if (role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden : Admin access only.'
    });
  }
  next();
}

