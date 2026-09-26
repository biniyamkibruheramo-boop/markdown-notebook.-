import { auth } from '../config/firebaseAdmin.js';

/**
 * Protect routes by verifying Firebase ID Token
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // contains uid, email, etc.
    next();
  } catch (error) {
    console.error('Firebase Auth Verification Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token verification failed or token is expired.',
      error: error.message,
    });
  }
};
