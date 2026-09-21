import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import adminAuthenticate from '../../../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Site config
const site = {
  name: 'Kishor Enterprises',
  tagline: 'Official Electronics Store',
  phone: '9963657799',
  wa: 'https://wa.me/919963657799',
};

// Protect all admin routes with JWT admin authentication
router.use(adminAuthenticate);

function getAdminUser(req) {
  const user = req.user || {};
  const name = user.username || (user.email ? user.email.split('@')[0] : 'Admin User');
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AU';
  return {
    id: user.userId || user.id || 'USR-ADMIN',
    username: name,
    email: user.email || 'admin@enterprisestore.com',
    role: user.role || 'ADMIN',
    avatar: initials
  };
}

// Root admin redirects to dashboard
router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

// Dashboard
router.get('/dashboard', (req, res) => {
  const adminUser = getAdminUser(req);
  res.render('pages/admin/dashboard', {
    title: `Admin Dashboard — ${site.name}`,
    pageLabel: 'Dashboard',
    activeNav: 'dashboard',
    site,
    adminUser
  });
});

// Banner Management
router.get('/banners', (req, res) => {
  const adminUser = getAdminUser(req);
  res.render('pages/admin/banners', {
    title: `Banner Management — ${site.name}`,
    pageLabel: 'Banners',
    activeNav: 'banners',
    site,
    adminUser
  });
});

// Product & Stock Management
router.get('/products', (req, res) => {
  const adminUser = getAdminUser(req);
  res.render('pages/admin/products', {
    title: `Product & Stock Management — ${site.name}`,
    pageLabel: 'Products',
    activeNav: 'products',
    site,
    adminUser
  });
});

// Registered Users
router.get('/users', (req, res) => {
  const adminUser = getAdminUser(req);
  res.render('pages/admin/users', {
    title: `Registered Users — ${site.name}`,
    pageLabel: 'Users',
    activeNav: 'users',
    site,
    adminUser
  });
});

// Order Management
router.get('/orders', (req, res) => {
  const adminUser = getAdminUser(req);
  res.render('pages/admin/orders', {
    title: `Order Management — ${site.name}`,
    pageLabel: 'Orders',
    activeNav: 'orders',
    site,
    adminUser
  });
});

// Admin Profile
router.get('/profile', (req, res) => {
  const adminUser = getAdminUser(req);
  res.render('pages/admin/profile', {
    title: `Admin Profile — ${site.name}`,
    pageLabel: 'Admin Profile',
    activeNav: 'profile',
    site,
    adminUser
  });
});

export default router;
