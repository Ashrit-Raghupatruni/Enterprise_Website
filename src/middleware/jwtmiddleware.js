import jwt from "jsonwebtoken";
import "dotenv/config";

// Minimal cookie parser — extracts a single cookie value by name
export function getCookie(req, name) {
  const header = req.headers.cookie || '';
  const match  = header.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

// Extracts JWT token from Cookie or Authorization header
export function extractToken(req) {
  const cookieToken = getCookie(req, 'authToken');
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  return null;
}

// Helper to determine if the request expects a JSON API response
function isApiRequest(req) {
  return (
    req.originalUrl?.startsWith('/api') ||
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('application/json'))
  );
}

// Authentication middleware — verifies JWT and attaches decoded user to req.user
export const requireLogin = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    if (isApiRequest(req)) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Authentication required. Please log in.",
      });
    }
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.locals.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      if (isApiRequest(req)) {
        return res.status(401).json({
          success: false,
          code: "TOKEN_EXPIRED",
          message: "Your session has expired. Please log in again.",
        });
      }
      return res.redirect('/login?error=session_expired');
    }

    if (isApiRequest(req)) {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid or malformed authentication token.",
      });
    }
    return res.redirect('/login?error=invalid_token');
  }
};

// Strict User-Only Authorization Middleware
export const requireUser = (req, res, next) => {
  if (!req.user) {
    if (isApiRequest(req)) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Authentication required. Please log in.",
      });
    }
    return res.redirect('/login');
  }

  if (req.user.role !== 'USER') {
    if (isApiRequest(req)) {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN_USER_ONLY",
        message: "Access restricted to user accounts only. Administrators cannot access this endpoint.",
      });
    }
    return res.status(403).render('pages/stub', {
      title: '403 Forbidden',
      pageLabel: 'Access Restricted to User Accounts Only',
      currentPath: req.originalUrl,
      site: { name: 'Enterprise Store' },
    });
  }

  next();
};

// Strict Admin-Only Authorization Middleware
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    if (isApiRequest(req)) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Authentication required. Please log in.",
      });
    }
    return res.redirect('/login');
  }

  if (req.user.role !== 'ADMIN') {
    if (isApiRequest(req)) {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN_ADMIN_ONLY",
        message: "Access restricted to administrators only. Standard users cannot access this endpoint.",
      });
    }
    return res.status(403).render('pages/stub', {
      title: '403 Forbidden',
      pageLabel: 'Access Restricted to Administrators Only',
      currentPath: req.originalUrl,
      site: { name: 'Enterprise Store' },
    });
  }

  next();
};

// Helper middleware for custom role combinations if needed
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      if (isApiRequest(req)) {
        return res.status(401).json({
          success: false,
          code: "UNAUTHORIZED",
          message: "Authentication required. Please log in.",
        });
      }
      return res.redirect('/login');
    }

    if (!allowedRoles.includes(req.user.role)) {
      if (isApiRequest(req)) {
        return res.status(403).json({
          success: false,
          code: "FORBIDDEN_ROLE",
          message: `Access forbidden for role ${req.user.role}.`,
        });
      }
      return res.status(403).render('pages/stub', {
        title: '403 Forbidden',
        pageLabel: 'Access Denied',
        currentPath: req.originalUrl,
        site: { name: 'Enterprise Store' },
      });
    }

    next();
  };
};

// Passive context middleware: attaches user info if logged in without blocking
export const attachUserContext = (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded;
    } catch (_) {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
};

// Backward-compatibility alias
export const jwtAuthenticate = requireLogin;
export default jwtAuthenticate;

