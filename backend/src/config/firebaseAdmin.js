import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = getApps().length === 0
  ? initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'new-project-bini12',
    })
  : getApps()[0];

export const auth = getAuth(app);
export default app;
