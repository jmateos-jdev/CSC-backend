import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const serviceAccountPath = join(process.cwd(), 'firebase-service-account.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8')) as Record<string, unknown>;

const app = initializeApp({
  credential: cert(serviceAccount),
});

export const firebaseAdminAuth = getAuth(app);
