import express from 'express';
import jwtAuthenticate from '../../../middleware/jwtmiddleware.js';
import adminGuard from '../../../middleware/adminguard.js';

const router = express.Router();

// Site config
const site = {
  name: 'Kishor Enterprises',
  tagline: 'Official Electronics Store',
  phone: '9963657799',
  wa: 'https://wa.me/919963657799',
};

// ─── Admin Page Routes (Protected by JWT + Admin Guard) ─────────────────────

// Dashboard
router.get(
  '/dashboard',
  jwtAuthenticate,
  adminGuard,
  (req, res) => {
    res.render('pages/admin/dashboard', {
      title: `Admin Dashboard — ${site.name}`,
      useApi: true,
      site,
      user: req.user,
    });
  }
);

// Banners Management
router.get(
  '/banners',
  jwtAuthenticate,
  adminGuard,
  (req, res) => {
    res.render('pages/admin/banners', {
      title: `Manage Banners — ${site.name}`,
      useApi: true,
      site,
      user: req.user,
    });
  }
);

// Products Management
router.get(
  '/products',
  jwtAuthenticate,
  adminGuard,
  (req, res) => {
    res.render('pages/admin/products', {
      title: `Manage Products — ${site.name}`,
      useApi: true,
      site,
      user: req.user,
    });
  }
);

// Users Management
router.get(
  '/users',
  jwtAuthenticate,
  adminGuard,
  (req, res) => {
    res.render('pages/admin/users', {
      title: `Manage Users — ${site.name}`,
      useApi: true,
      site,
      user: req.user,
    });
  }
);

// Orders Management
router.get(
  '/orders',
  jwtAuthenticate,
  adminGuard,
  (req, res) => {
    res.render('pages/admin/orders', {
      title: `Manage Orders — ${site.name}`,
      useApi: true,
      site,
      user: req.user,
    });
  }
);

// Redirect /admin to dashboard
router.get(
  '/',
  jwtAuthenticate,
  adminGuard,
  (req, res) => {
    res.redirect('/admin/dashboard');
  }
);

export default router;
