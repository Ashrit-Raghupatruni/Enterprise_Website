import express from 'express';

const router = express.Router();

const site = {
  name: 'Kishor Enterprises',
  tagline: 'Official Electronics Store',
  phone: '9963657799',
  wa: 'https://wa.me/919963657799',
};

const adminUser = {
  username: 'Admin User',
  email: 'admin@enterprisestore.com',
  role: 'ADMIN',
  avatar: 'AU'
};

// Root admin redirects to dashboard
router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

// Dashboard
router.get('/dashboard', (req, res) => {
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
  res.render('pages/admin/orders', {
    title: `Order Management — ${site.name}`,
    pageLabel: 'Orders',
    activeNav: 'orders',
    site,
    adminUser
  });
});

export default router;
