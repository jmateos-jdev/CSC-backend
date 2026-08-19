import { type Request, type Response, type NextFunction } from 'express';
import { firebaseAdminAuth } from '../services/firebase.service.js';
import { catchAsync } from '../utils/catchAsync.util.js';
import prisma from '../lib/prisma.js';

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: number;
        firebase_uid: string;
        email: string;
        main_company_id: number | null;
      };
    }
  }
}

export const validateAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', statusCode: 401, message: 'No autorizado. Token inexistente.' });
  }

  const token = authHeader.split(' ')[1] as string;

  const decodedToken = await firebaseAdminAuth.verifyIdToken(token);
  const { uid, email } = decodedToken;

  if (!email) {
    return res.status(400).json({ status: 'error', statusCode: 400, message: 'El token de Firebase no contiene un email válido.' });
  }

  let userInDb = await prisma.users.findFirst({
    where: { firebase_uid: uid },
  });

  if (!userInDb) {
    try {
      userInDb = await prisma.users.create({
        data: {
          firebase_uid: uid,
          email,
        },
      });
    } catch (dbError: unknown) {
      console.error('❌ Error al crear el usuario por defecto en MySQL:', dbError);
      return res.status(500).json({
        status: 'error', 
        statusCode: 500,
        message: 'Error al inicializar tu perfil de usuario.',
      });
    }
  }

  req.currentUser = {
    id: userInDb.id,
    firebase_uid: userInDb.firebase_uid,
    email: userInDb.email,
    main_company_id: userInDb.main_company_id,
  };

  return next();
});
