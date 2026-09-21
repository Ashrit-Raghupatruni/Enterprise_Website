import jwt from "jsonwebtoken";
import "dotenv/config";
import prisma from "../config/prisma.js";

/**
 * Minimal cookie parser — extracts a single cookie value by name
 */
function getCookie(req, name) {
  const header = req.headers.cookie || '';
  const match  = header.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/**
 * adminAuthenticate middleware:
 * 1. Checks for 'authToken' cookie.
 * 2. Decrypts/verifies JWT using JWT_SECRET.
 * 3. Checks if role is 'ADMIN'.
 * 4. If role is 'USER' (not 'ADMIN'), blocks access and displays the
 *    "No admin access since you are a user" pop-up modal view (or 403 JSON).
 * 5. If role is 'ADMIN', grants access via next().
 */
export const adminAuthenticate = async (req, res, next) => {
  const isApi = req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));
  const token = getCookie(req, 'authToken');

  // Case 1: Unauthenticated visitor (no token)
  if (!token) {
    if (isApi) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in.'
      });
    }
    return res.redirect(`/login?pendingRoute=${encodeURIComponent(req.originalUrl || '/admin/dashboard')}`);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let role = decoded.role;
    let username = decoded.username;
    let email = decoded.email;

    // Fallback: check database if role not present in token
    if (!role && decoded.userId) {
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true, email: true, role: true }
      });
      if (dbUser) {
        role = dbUser.role;
        username = dbUser.username;
        email = dbUser.email;
      }
    }

    // Case 2: User is NOT ADMIN (i.e. role is USER)
    if (role !== 'ADMIN') {
      if (isApi) {
        return res.status(403).json({
          success: false,
          message: 'No admin access since you are a user.'
        });
      }

      // Render the Access Denied pop-up modal page with HTTP 403
      return res.status(403).render('pages/admin/access-denied', {
        title: 'Access Denied — Kishor Enterprises',
        site: {
          name: 'Kishor Enterprises',
          tagline: 'Official Electronics Store',
          phone: '9963657799',
          wa: 'https://wa.me/919963657799',
        },
        user: {
          id: decoded.userId,
          username: username || 'User',
          email: email || '',
          role: role || 'USER'
        },
        attemptedUrl: req.originalUrl || '/admin/dashboard'
      });
    }

    // Case 3: User IS an ADMIN -> Grant full admin access
    req.user = {
      ...decoded,
      role: 'ADMIN',
      username: username || decoded.username,
      email: email || decoded.email
    };
    return next();
  } catch (err) {
    res.clearCookie('authToken', { path: '/' });
    if (isApi) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid. Please sign in again.'
      });
    }
    return res.redirect(`/login?pendingRoute=${encodeURIComponent(req.originalUrl || '/admin/dashboard')}`);
  }
};

export default adminAuthenticate;
