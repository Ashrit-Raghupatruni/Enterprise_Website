/**
 * admin.js — Enterprise Store Admin Panel Interactive Logic
 * Handles real-time search, filters, modals, drawers, status updates, and mock mutations.
 */

(function () {
  'use strict';

  // Ensure mock data is loaded
  const data = window.adminMockData || {
    stats: {},
    banners: [],
    products: [],
    categories: [],
    users: [],
    orders: []
  };

  /* =========================================================================
     1. UTILITIES & TOAST NOTIFICATIONS
     ========================================================================= */

  function formatRupees(num) {
    if (typeof num !== 'number') num = Number(num) || 0;
    return '₹' + num.toLocaleString('en-IN');
  }

  function showAdminToast(message, type = 'success') {
    const container = document.getElementById('adminToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast--${type}`;
    
    let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));

    // Remove after 3.5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* =========================================================================
     2. MOBILE SIDEBAR NAVIGATION
     ========================================================================= */

  const sidebarToggleBtn = document.getElementById('adminSidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  const sidebarBackdrop = document.getElementById('adminSidebarBackdrop');

  function toggleSidebar(open) {
    if (!sidebar) return;
    const shouldOpen = open !== undefined ? open : !sidebar.classList.contains('open');
    if (shouldOpen) {
      sidebar.classList.add('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
    } else {
      sidebar.classList.remove('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
    }
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => toggleSidebar());
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => toggleSidebar(false));
  }

  // Admin Logout button handler
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      showAdminToast('Logging out from admin session...', 'warning');
      setTimeout(() => {
        window.location.href = '/home';
      }, 800);
    });
  }

  /* =========================================================================
     3. MODAL & DRAWER CONTROLS
     ========================================================================= */

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Close triggers
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close-modal');
      closeModal(targetId);
    });
  });

  // Open triggers
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-open-modal');
      if (targetId === 'productModal') resetProductForm();
      if (targetId === 'bannerModal') resetBannerForm();
      openModal(targetId);
    });
  });

  // Global ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.admin-modal-backdrop.open').forEach(m => closeModal(m.id));
      closeUserDrawer();
      closeOrderDrawer();
      toggleSidebar(false);
    }
  });

  /* =========================================================================
     4. DASHBOARD VIEW CONTROLLER
     ========================================================================= */

  function initDashboard() {
    const ordersTbody = document.getElementById('dashboardOrdersTableBody');
    const lowStockTbody = document.getElementById('dashboardLowStockTableBody');

    if (ordersTbody) {
      const recent = data.orders.slice(0, 5);
      ordersTbody.innerHTML = recent.map(o => `
        <tr>
          <td><strong style="font-family:var(--font-mono); color:var(--color-primary-700);">${o.shortId}</strong></td>
          <td>
            <div style="font-weight:var(--font-semibold);">${o.customer.name}</div>
            <div style="font-size:var(--text-xs); color:var(--color-text-muted);">${o.customer.phone}</div>
          </td>
          <td><strong>${formatRupees(o.totalAmount)}</strong></td>
          <td>
            <span class="order-status order-status--${o.status}">
              <span class="order-status__dot"></span>
              ${capitalize(o.status.replace(/_/g, ' '))}
            </span>
          </td>
          <td style="font-size:var(--text-xs); color:var(--color-text-muted);">${o.date}</td>
          <td>
            <button type="button" class="admin-btn-action" data-view-order="${o.id}">
              <span>View</span>
            </button>
          </td>
        </tr>
      `).join('');

      // Wire up view order buttons
      ordersTbody.querySelectorAll('[data-view-order]').forEach(btn => {
        btn.addEventListener('click', () => openOrderDrawer(btn.dataset.viewOrder));
      });
    }

    if (lowStockTbody) {
      const lowStock = data.products.filter(p => p.stock <= p.minStockThreshold);
      lowStockTbody.innerHTML = lowStock.map(p => `
        <tr>
          <td>
            <div style="font-weight:var(--font-semibold); line-height:1.2;">${p.name}</div>
            <div style="font-size:var(--text-xs); color:var(--color-text-muted);">${p.category}</div>
          </td>
          <td>
            <span style="font-weight:var(--font-bold); color:${p.stock === 0 ? 'var(--color-error-600)' : '#d97706'};">
              ${p.stock} units
            </span>
          </td>
          <td>
            <span class="badge ${p.stock === 0 ? 'badge--accent' : 'badge--primary'}" style="${p.stock === 0 ? 'background:#fee2e2; color:#991b1b;' : 'background:#fef3c7; color:#b45309;'}">
              ${p.status}
            </span>
          </td>
          <td>
            <button type="button" class="admin-btn-action" data-stock-product="${p.id}">
              <span>Restock</span>
            </button>
          </td>
        </tr>
      `).join('');

      lowStockTbody.querySelectorAll('[data-stock-product]').forEach(btn => {
        btn.addEventListener('click', () => openStockModal(btn.dataset.stockProduct));
      });
    }
  }

  /* =========================================================================
     5. BANNER MANAGEMENT VIEW CONTROLLER
     ========================================================================= */

  function renderBanners() {
    const grid = document.getElementById('bannersGrid');
    const emptyState = document.getElementById('bannersEmptyState');
    const searchInput = document.getElementById('bannerSearchInput');
    const statusFilter = document.getElementById('bannerStatusFilter');

    if (!grid) return;

    const query = (searchInput?.value || '').trim().toLowerCase();
    const filterStatus = statusFilter?.value || 'all';

    const filtered = data.banners.filter(b => {
      const matchSearch = b.title.toLowerCase().includes(query) ||
                          b.eyebrow.toLowerCase().includes(query) ||
                          b.slug.toLowerCase().includes(query);
      const matchStatus = filterStatus === 'all' || b.status === filterStatus;
      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = filtered.map(b => `
      <div class="admin-banner-card" data-id="${b.id}">
        <!-- Visual Banner Header Preview -->
        <div class="admin-banner-preview" style="background:${b.bgGradient};">
          <div>
            <span class="admin-banner-preview__eyebrow">${b.eyebrow}</span>
            <h3 class="admin-banner-preview__title">${b.title}</h3>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            ${b.badge ? `<span class="admin-banner-preview__badge">${b.badge}</span>` : '<span></span>'}
            <span style="font-size:var(--text-xs); background:rgba(0,0,0,0.4); padding:2px 8px; border-radius:var(--radius-sm);">
              CTA: ${b.ctaText}
            </span>
          </div>
        </div>

        <!-- Banner Card Body -->
        <div class="admin-banner-card__details">
          <p style="font-size:var(--text-xs); color:var(--color-text-muted); line-height:var(--leading-relaxed); margin:0;">
            ${b.subtitle}
          </p>

          <div class="admin-banner-card__slug-row">
            <span style="color:var(--color-text-muted);">Destination Slug:</span>
            <span class="admin-banner-slug-pill">/${b.slug}</span>
          </div>

          <div class="admin-banner-card__slug-row">
            <span style="color:var(--color-text-muted);">Visibility Status:</span>
            <span class="badge ${b.status === 'Active' ? 'badge--success' : ''}" style="${b.status === 'Inactive' ? 'background:#f4f4f5; color:#71717a;' : ''}">
              ${b.status}
            </span>
          </div>

          <!-- Footer Actions -->
          <div class="admin-banner-card__footer">
            <button type="button" class="admin-btn-action" data-toggle-banner="${b.id}">
              ${b.status === 'Active' ? 'Deactivate' : 'Activate'}
            </button>
            <div style="display:flex; gap:var(--space-2);">
              <button type="button" class="admin-btn-action" data-edit-banner="${b.id}">Edit</button>
              <button type="button" class="admin-btn-action admin-btn-action--danger" data-delete-banner="${b.id}">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach listeners
    grid.querySelectorAll('[data-edit-banner]').forEach(btn => {
      btn.addEventListener('click', () => editBanner(btn.dataset.editBanner));
    });

    grid.querySelectorAll('[data-toggle-banner]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = data.banners.find(x => x.id === btn.dataset.toggleBanner);
        if (item) {
          item.status = item.status === 'Active' ? 'Inactive' : 'Active';
          renderBanners();
          showAdminToast(`Banner "${item.title}" marked as ${item.status}.`);
        }
      });
    });

    grid.querySelectorAll('[data-delete-banner]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = data.banners.findIndex(x => x.id === btn.dataset.deleteBanner);
        if (idx !== -1) {
          const removed = data.banners.splice(idx, 1)[0];
          renderBanners();
          showAdminToast(`Banner "${removed.title}" deleted.`);
        }
      });
    });
  }

  function resetBannerForm() {
    const form = document.getElementById('bannerForm');
    if (form) form.reset();
    const idInput = document.getElementById('bannerFormId');
    if (idInput) idInput.value = '';
    const title = document.getElementById('bannerModalTitle');
    if (title) title.textContent = 'Add New Banner';
  }

  function editBanner(id) {
    const banner = data.banners.find(b => b.id === id);
    if (!banner) return;

    document.getElementById('bannerFormId').value = banner.id;
    document.getElementById('bannerEyebrow').value = banner.eyebrow;
    document.getElementById('bannerTitle').value = banner.title;
    document.getElementById('bannerSubtitle').value = banner.subtitle;
    document.getElementById('bannerCtaText').value = banner.ctaText;
    document.getElementById('bannerSlug').value = banner.slug;
    document.getElementById('bannerBadge').value = banner.badge || '';
    document.getElementById('bannerStatus').value = banner.status;

    document.getElementById('bannerModalTitle').textContent = 'Edit Banner';
    openModal('bannerModal');
  }

  const saveBannerBtn = document.getElementById('saveBannerBtn');
  if (saveBannerBtn) {
    saveBannerBtn.addEventListener('click', () => {
      const id = document.getElementById('bannerFormId').value;
      const title = document.getElementById('bannerTitle').value.trim();
      const eyebrow = document.getElementById('bannerEyebrow').value.trim();
      const subtitle = document.getElementById('bannerSubtitle').value.trim();
      const ctaText = document.getElementById('bannerCtaText').value.trim();
      const slug = document.getElementById('bannerSlug').value.trim();
      const badge = document.getElementById('bannerBadge').value.trim();
      const status = document.getElementById('bannerStatus').value;

      if (!title || !slug) {
        alert('Please provide a banner title and target slug.');
        return;
      }

      if (id) {
        // Edit existing
        const banner = data.banners.find(b => b.id === id);
        if (banner) {
          Object.assign(banner, { title, eyebrow, subtitle, ctaText, slug, badge, status });
          showAdminToast('Banner updated successfully.');
        }
      } else {
        // Add new
        const newBanner = {
          id: 'BNR-' + String(data.banners.length + 1).padStart(3, '0'),
          title,
          eyebrow,
          subtitle,
          ctaText,
          slug,
          badge,
          status,
          bgGradient: 'linear-gradient(135deg, #0d1e4d 0%, #1e3d8f 60%, #2f52a0 100%)',
          accentColor: '#f58500',
          clicks: 0
        };
        data.banners.unshift(newBanner);
        showAdminToast('New banner added successfully.');
      }

      closeModal('bannerModal');
      renderBanners();
    });
  }

  /* =========================================================================
     6. PRODUCT & STOCK MANAGEMENT CONTROLLER
     ========================================================================= */

  function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    const emptyState = document.getElementById('productsEmptyState');
    const searchInput = document.getElementById('productSearchInput');
    const catFilter = document.getElementById('productCategoryFilter');
    const stockFilter = document.getElementById('productStockFilter');
    const countDisplay = document.getElementById('productsCountDisplay');

    if (!tbody) return;

    const query = (searchInput?.value || '').trim().toLowerCase();
    const cat = catFilter?.value || 'all';
    const stockStatus = stockFilter?.value || 'all';

    const filtered = data.products.filter(p => {
      const matchQuery = p.name.toLowerCase().includes(query) ||
                         p.brand.toLowerCase().includes(query) ||
                         p.category.toLowerCase().includes(query) ||
                         p.slug.toLowerCase().includes(query);
      const matchCat = cat === 'all' || p.category === cat;
      const matchStock = stockStatus === 'all' || p.status === stockStatus;
      return matchQuery && matchCat && matchStock;
    });

    if (countDisplay) countDisplay.textContent = filtered.length;

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = filtered.map(p => {
      let stockBadgeClass = 'badge--success';
      let stockColor = '#16a34a';
      if (p.status === 'Low Stock') {
        stockBadgeClass = 'badge--accent';
        stockColor = '#d97706';
      } else if (p.status === 'Out of Stock') {
        stockBadgeClass = '';
        stockColor = '#dc2626';
      }

      return `
        <tr data-product-id="${p.id}">
          <td>
            <div class="admin-cell-product">
              <div class="admin-cell-product__img">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              </div>
              <div class="admin-cell-product__info">
                <div class="admin-cell-product__name">${p.name}</div>
                <div class="admin-cell-product__brand">Brand: ${p.brand} &bull; /${p.slug}</div>
              </div>
            </div>
          </td>
          <td>
            <span style="font-weight:var(--font-medium); color:var(--color-text-secondary);">${p.category}</span>
          </td>
          <td>
            <strong>${formatRupees(p.price)}</strong>
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:var(--space-2);">
              <span style="width:8px; height:8px; border-radius:50%; background:${stockColor};"></span>
              <span style="font-weight:var(--font-bold);">${p.stock} units</span>
            </div>
          </td>
          <td>
            <span class="badge ${stockBadgeClass}" style="${p.status === 'Out of Stock' ? 'background:#fee2e2; color:#991b1b;' : ''}">
              ${p.status}
            </span>
          </td>
          <td>
            <button type="button" class="admin-btn-action" data-toggle-avail="${p.id}" style="font-size:11px;">
              ${p.availability === 'AVAILABLE' ? '🟢 Visible' : '🔴 Hidden'}
            </button>
          </td>
          <td>
            <div class="admin-actions-cell">
              <button type="button" class="admin-btn-action" data-edit-product="${p.id}">Edit</button>
              <button type="button" class="admin-btn-action" data-stock-product="${p.id}">Stock</button>
              <button type="button" class="admin-btn-action admin-btn-action--danger" data-delete-product="${p.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Wire action buttons
    tbody.querySelectorAll('[data-edit-product]').forEach(btn => {
      btn.addEventListener('click', () => editProduct(btn.dataset.editProduct));
    });

    tbody.querySelectorAll('[data-stock-product]').forEach(btn => {
      btn.addEventListener('click', () => openStockModal(btn.dataset.stockProduct));
    });

    tbody.querySelectorAll('[data-toggle-avail]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = data.products.find(x => x.id === btn.dataset.toggleAvail);
        if (prod) {
          prod.availability = prod.availability === 'AVAILABLE' ? 'NOT_AVAILABLE' : 'AVAILABLE';
          renderProducts();
          showAdminToast(`Product availability updated for ${prod.name}`);
        }
      });
    });

    tbody.querySelectorAll('[data-delete-product]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = data.products.findIndex(x => x.id === btn.dataset.deleteProduct);
        if (idx !== -1) {
          const removed = data.products.splice(idx, 1)[0];
          renderProducts();
          showAdminToast(`Product "${removed.name}" removed.`);
        }
      });
    });
  }

  function resetProductForm() {
    const form = document.getElementById('productForm');
    if (form) form.reset();
    const idInput = document.getElementById('productFormId');
    if (idInput) idInput.value = '';
    const title = document.getElementById('productModalTitle');
    if (title) title.textContent = 'Add New Product';
  }

  function editProduct(id) {
    const prod = data.products.find(p => p.id === id);
    if (!prod) return;

    document.getElementById('productFormId').value = prod.id;
    document.getElementById('productName').value = prod.name;
    document.getElementById('productBrand').value = prod.brand;
    document.getElementById('productCategory').value = prod.category;
    document.getElementById('productPrice').value = prod.price;
    document.getElementById('productStock').value = prod.stock;
    document.getElementById('productSlug').value = prod.slug;
    document.getElementById('productAvailability').value = prod.availability;
    document.getElementById('productDescription').value = prod.description || '';

    document.getElementById('productModalTitle').textContent = 'Edit Product Details';
    openModal('productModal');
  }

  const saveProductBtn = document.getElementById('saveProductBtn');
  if (saveProductBtn) {
    saveProductBtn.addEventListener('click', () => {
      const id = document.getElementById('productFormId').value;
      const name = document.getElementById('productName').value.trim();
      const brand = document.getElementById('productBrand').value.trim();
      const category = document.getElementById('productCategory').value;
      const price = Number(document.getElementById('productPrice').value) || 0;
      const stock = Number(document.getElementById('productStock').value) || 0;
      const slug = document.getElementById('productSlug').value.trim();
      const availability = document.getElementById('productAvailability').value;
      const description = document.getElementById('productDescription').value.trim();

      if (!name || !brand || !slug || price <= 0) {
        alert('Please fill in product name, brand, price and slug.');
        return;
      }

      let status = 'In Stock';
      if (stock === 0) status = 'Out of Stock';
      else if (stock < 5) status = 'Low Stock';

      if (id) {
        const prod = data.products.find(p => p.id === id);
        if (prod) {
          Object.assign(prod, { name, brand, category, price, stock, slug, availability, description, status });
          showAdminToast(`Product "${prod.name}" updated successfully.`);
        }
      } else {
        const newProduct = {
          id: 'PRD-' + String(100 + data.products.length + 1),
          name,
          brand,
          category,
          price,
          originalPrice: price,
          stock,
          minStockThreshold: 4,
          status,
          availability,
          slug,
          rating: 5.0,
          description
        };
        data.products.unshift(newProduct);
        showAdminToast(`New product "${name}" added to catalogue.`);
      }

      closeModal('productModal');
      renderProducts();
    });
  }

  // Stock Modal operations
  function openStockModal(id) {
    const prod = data.products.find(p => p.id === id);
    if (!prod) return;

    document.getElementById('stockProductId').value = prod.id;
    document.getElementById('stockProductName').textContent = `${prod.name} (${prod.brand})`;
    document.getElementById('stockQuantityInput').value = prod.stock;
    document.getElementById('stockStatusSelect').value = prod.status;

    openModal('stockModal');
  }

  const stockIncBtn = document.getElementById('stockIncBtn');
  const stockDecBtn = document.getElementById('stockDecBtn');
  const stockQtyInput = document.getElementById('stockQuantityInput');

  if (stockIncBtn && stockQtyInput) {
    stockIncBtn.addEventListener('click', () => {
      stockQtyInput.value = Number(stockQtyInput.value) + 1;
      updateStockStatusAuto();
    });
  }
  if (stockDecBtn && stockQtyInput) {
    stockDecBtn.addEventListener('click', () => {
      const val = Number(stockQtyInput.value);
      if (val > 0) stockQtyInput.value = val - 1;
      updateStockStatusAuto();
    });
  }

  function updateStockStatusAuto() {
    const val = Number(stockQtyInput.value) || 0;
    const select = document.getElementById('stockStatusSelect');
    if (!select) return;
    if (val === 0) select.value = 'Out of Stock';
    else if (val < 5) select.value = 'Low Stock';
    else select.value = 'In Stock';
  }

  if (stockQtyInput) {
    stockQtyInput.addEventListener('input', updateStockStatusAuto);
  }

  const saveStockBtn = document.getElementById('saveStockBtn');
  if (saveStockBtn) {
    saveStockBtn.addEventListener('click', () => {
      const id = document.getElementById('stockProductId').value;
      const stock = Number(document.getElementById('stockQuantityInput').value) || 0;
      const status = document.getElementById('stockStatusSelect').value;

      const prod = data.products.find(p => p.id === id);
      if (prod) {
        prod.stock = stock;
        prod.status = status;
        if (stock === 0) prod.availability = 'NOT_AVAILABLE';
        showAdminToast(`Stock updated to ${stock} units for "${prod.name}"`);
        closeModal('stockModal');
        renderProducts();
        initDashboard();
      }
    });
  }

  /* =========================================================================
     7. REGISTERED USERS CONTROLLER
     ========================================================================= */

  function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('usersEmptyState');
    const searchInput = document.getElementById('userSearchInput');
    const roleFilter = document.getElementById('userRoleFilter');
    const countDisplay = document.getElementById('usersCountDisplay');

    if (!tbody) return;

    const query = (searchInput?.value || '').trim().toLowerCase();
    const role = roleFilter?.value || 'all';

    const filtered = data.users.filter(u => {
      const matchQuery = u.name.toLowerCase().includes(query) ||
                         u.email.toLowerCase().includes(query) ||
                         u.phone.toLowerCase().includes(query);
      const matchRole = role === 'all' || u.role === role;
      return matchQuery && matchRole;
    });

    if (countDisplay) countDisplay.textContent = filtered.length;

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = filtered.map(u => {
      const initials = u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      return `
        <tr data-user-id="${u.id}">
          <td>
            <div class="admin-cell-user">
              <div class="admin-cell-user__avatar">${initials}</div>
              <div>
                <strong style="color:var(--color-text-primary);">${u.name}</strong>
                <div style="font-size:var(--text-xs); color:var(--color-text-muted);">${u.gender || 'Not specified'}</div>
              </div>
            </div>
          </td>
          <td><span style="font-family:var(--font-mono); font-size:var(--text-xs);">${u.email}</span></td>
          <td>${u.phone}</td>
          <td>
            <span class="badge ${u.role === 'ADMIN' ? 'badge--accent' : 'badge--primary'}">
              ${u.role}
            </span>
          </td>
          <td style="font-size:var(--text-xs); color:var(--color-text-muted);">${u.joinedDate}</td>
          <td><strong>${u.ordersCount}</strong> orders</td>
          <td>
            <span class="badge badge--success">${u.status}</span>
          </td>
          <td>
            <button type="button" class="admin-btn-action" data-view-user="${u.id}">
              <span>View Profile</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-view-user]').forEach(btn => {
      btn.addEventListener('click', () => openUserDrawer(btn.dataset.viewUser));
    });
  }

  function openUserDrawer(userId) {
    const user = data.users.find(u => u.id === userId);
    if (!user) return;

    const drawerBody = document.getElementById('userDrawerBody');
    const drawer = document.getElementById('userDrawer');
    const overlay = document.getElementById('userDrawerOverlay');

    if (!drawerBody || !drawer || !overlay) return;

    const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    drawerBody.innerHTML = `
      <!-- User Summary Card -->
      <div style="display:flex; align-items:center; gap:var(--space-4); padding:var(--space-4); background:var(--color-bg-secondary); border-radius:var(--radius-xl); border:1px solid var(--color-border-light);">
        <div style="width:52px; height:52px; border-radius:50%; background:var(--color-primary-700); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:var(--font-bold); font-size:var(--text-lg);">
          ${initials}
        </div>
        <div>
          <h4 style="font-size:var(--text-lg); font-weight:var(--font-bold); margin:0;">${user.name}</h4>
          <span style="font-size:var(--text-xs); color:var(--color-text-muted);">Customer ID: ${user.id}</span>
        </div>
      </div>

      <!-- Account Details -->
      <div>
        <h5 style="font-size:var(--text-xs); font-weight:var(--font-bold); color:var(--color-text-muted); text-transform:uppercase; letter-spacing:var(--tracking-wider); margin-bottom:var(--space-3);">
          Contact & Profile
        </h5>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-3); font-size:var(--text-sm);">
          <div>
            <span style="color:var(--color-text-muted); font-size:var(--text-xs); display:block;">Email Address</span>
            <strong>${user.email}</strong>
          </div>
          <div>
            <span style="color:var(--color-text-muted); font-size:var(--text-xs); display:block;">Phone Number</span>
            <strong>${user.phone}</strong>
          </div>
          <div>
            <span style="color:var(--color-text-muted); font-size:var(--text-xs); display:block;">Account Role</span>
            <span class="badge ${user.role === 'ADMIN' ? 'badge--accent' : 'badge--primary'}">${user.role}</span>
          </div>
          <div>
            <span style="color:var(--color-text-muted); font-size:var(--text-xs); display:block;">Date Registered</span>
            <strong>${user.joinedDate}</strong>
          </div>
        </div>
      </div>

      <!-- Purchasing Activity -->
      <div>
        <h5 style="font-size:var(--text-xs); font-weight:var(--font-bold); color:var(--color-text-muted); text-transform:uppercase; letter-spacing:var(--tracking-wider); margin-bottom:var(--space-3);">
          Purchasing Activity
        </h5>
        <div style="display:flex; gap:var(--space-4);">
          <div style="flex:1; padding:var(--space-4); background:var(--color-bg-secondary); border-radius:var(--radius-lg); border:1px solid var(--color-border-light);">
            <span style="font-size:var(--text-xs); color:var(--color-text-muted);">Total Completed Orders</span>
            <div style="font-size:var(--text-2xl); font-weight:var(--font-extrabold); color:var(--color-primary-700);">${user.ordersCount}</div>
          </div>
          <div style="flex:1; padding:var(--space-4); background:var(--color-bg-secondary); border-radius:var(--radius-lg); border:1px solid var(--color-border-light);">
            <span style="font-size:var(--text-xs); color:var(--color-text-muted);">Lifetime Spend</span>
            <div style="font-size:var(--text-2xl); font-weight:var(--font-extrabold); color:var(--color-accent-600);">${user.totalSpent}</div>
          </div>
        </div>
      </div>

      <!-- Saved Delivery Addresses -->
      <div>
        <h5 style="font-size:var(--text-xs); font-weight:var(--font-bold); color:var(--color-text-muted); text-transform:uppercase; letter-spacing:var(--tracking-wider); margin-bottom:var(--space-3);">
          Saved Addresses (${user.addresses.length})
        </h5>
        ${user.addresses.length === 0 ? '<p style="font-size:var(--text-xs); color:var(--color-text-muted);">No addresses saved yet.</p>' : user.addresses.map(a => `
          <div style="padding:var(--space-3) var(--space-4); background:var(--color-bg-secondary); border-radius:var(--radius-lg); border:1px solid var(--color-border-light); margin-bottom:var(--space-2); font-size:var(--text-sm);">
            <strong style="color:var(--color-primary-700);">${a.name}</strong>
            <p style="margin:4px 0 0 0; color:var(--color-text-secondary);">${a.line1}, ${a.city}, ${a.state} — ${a.pincode}</p>
          </div>
        `).join('')}
      </div>
    `;

    drawer.classList.add('open');
    overlay.classList.add('open');
  }

  function closeUserDrawer() {
    const drawer = document.getElementById('userDrawer');
    const overlay = document.getElementById('userDrawerOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  const userDrawerCloseBtn = document.getElementById('userDrawerClose');
  const userDrawerOverlay = document.getElementById('userDrawerOverlay');
  if (userDrawerCloseBtn) userDrawerCloseBtn.addEventListener('click', closeUserDrawer);
  if (userDrawerOverlay) userDrawerOverlay.addEventListener('click', closeUserDrawer);

  /* =========================================================================
     8. ORDER MANAGEMENT CONTROLLER
     ========================================================================= */

  let currentOrderFilter = 'all';

  function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    const emptyState = document.getElementById('ordersEmptyState');
    const searchInput = document.getElementById('orderSearchInput');
    const countDisplay = document.getElementById('ordersCountDisplay');

    if (!tbody) return;

    const query = (searchInput?.value || '').trim().toLowerCase();

    const filtered = data.orders.filter(o => {
      const matchQuery = o.id.toLowerCase().includes(query) ||
                         o.shortId.toLowerCase().includes(query) ||
                         o.customer.name.toLowerCase().includes(query) ||
                         o.customer.phone.includes(query);
      const matchFilter = currentOrderFilter === 'all' || o.status === currentOrderFilter;
      return matchQuery && matchFilter;
    });

    if (countDisplay) countDisplay.textContent = filtered.length;

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = filtered.map(o => {
      const itemsSummary = o.items.map(i => `${i.name} (x${i.quantity})`).join(', ');

      return `
        <tr data-order-id="${o.id}">
          <td>
            <strong style="font-family:var(--font-mono); color:var(--color-primary-700);">${o.shortId}</strong>
            <div style="font-size:11px; color:var(--color-text-muted);">${o.id}</div>
          </td>
          <td>
            <strong>${o.customer.name}</strong>
            <div style="font-size:var(--text-xs); color:var(--color-text-muted);">${o.customer.phone}</div>
          </td>
          <td style="max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${itemsSummary}">
            ${itemsSummary}
          </td>
          <td><strong>${formatRupees(o.totalAmount)}</strong></td>
          <td>
            <span style="font-size:var(--text-xs);">${o.paymentMethod}</span>
            <div style="font-size:11px; color:${o.paymentStatus === 'Paid' ? 'var(--color-success-600)' : 'var(--color-accent-600)'}; font-weight:var(--font-bold);">
              ${o.paymentStatus}
            </div>
          </td>
          <td>
            <span class="order-status order-status--${o.status}">
              <span class="order-status__dot"></span>
              ${capitalize(o.status.replace(/_/g, ' '))}
            </span>
          </td>
          <td style="font-size:var(--text-xs); color:var(--color-text-muted);">${o.date}</td>
          <td>
            <button type="button" class="admin-btn-action" data-view-order="${o.id}">
              <span>View & Manage</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-view-order]').forEach(btn => {
      btn.addEventListener('click', () => openOrderDrawer(btn.dataset.viewOrder));
    });
  }

  function openOrderDrawer(orderId) {
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return;

    const drawerBody = document.getElementById('orderDrawerBody');
    const drawer = document.getElementById('orderDrawer');
    const overlay = document.getElementById('orderDrawerOverlay');

    if (!drawerBody || !drawer || !overlay) return;

    drawerBody.innerHTML = `
      <!-- Order Top Summary -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; padding:var(--space-4); background:var(--color-bg-secondary); border-radius:var(--radius-xl); border:1px solid var(--color-border-light);">
        <div>
          <span style="font-family:var(--font-mono); font-weight:var(--font-extrabold); font-size:var(--text-lg); color:var(--color-primary-700);">${order.shortId}</span>
          <div style="font-size:var(--text-xs); color:var(--color-text-muted);">Placed on ${order.date}</div>
        </div>
        <span class="order-status order-status--${order.status}">
          <span class="order-status__dot"></span>
          ${capitalize(order.status.replace(/_/g, ' '))}
        </span>
      </div>

      <!-- Quick Status Updater -->
      <div style="padding:var(--space-4); border:1.5px dashed var(--color-primary-300); border-radius:var(--radius-xl); background:var(--color-primary-50);">
        <label class="admin-label" for="drawerStatusSelect" style="color:var(--color-primary-700);">Update Fulfillment Status</label>
        <div style="display:flex; gap:var(--space-3);">
          <select id="drawerStatusSelect" class="admin-form-select" style="background:#fff;">
            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="out_for_delivery" ${order.status === 'out_for_delivery' ? 'selected' : ''}>Out for Delivery</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
          <button type="button" class="btn btn--primary btn--sm" id="updateOrderStatusBtn" data-order-id="${order.id}">
            Update
          </button>
        </div>
      </div>

      <!-- Customer & Shipping -->
      <div>
        <h5 style="font-size:var(--text-xs); font-weight:var(--font-bold); color:var(--color-text-muted); text-transform:uppercase; letter-spacing:var(--tracking-wider); margin-bottom:var(--space-3);">
          Customer & Delivery Address
        </h5>
        <div style="padding:var(--space-4); background:var(--color-bg-secondary); border-radius:var(--radius-lg); border:1px solid var(--color-border-light); font-size:var(--text-sm);">
          <strong>${order.customer.name}</strong>
          <div style="color:var(--color-text-secondary); margin:4px 0;">Phone: ${order.customer.phone} &bull; ${order.customer.email}</div>
          <div style="color:var(--color-text-muted); margin-top:var(--space-2);">
            📍 ${order.shippingAddress}
          </div>
        </div>
      </div>

      <!-- Items Breakdown -->
      <div>
        <h5 style="font-size:var(--text-xs); font-weight:var(--font-bold); color:var(--color-text-muted); text-transform:uppercase; letter-spacing:var(--tracking-wider); margin-bottom:var(--space-3);">
          Order Items (${order.items.length})
        </h5>
        ${order.items.map(item => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:var(--space-3) 0; border-bottom:1px solid var(--color-border-light);">
            <div>
              <strong style="font-size:var(--text-sm);">${item.name}</strong>
              <div style="font-size:var(--text-xs); color:var(--color-text-muted);">${item.variant} &bull; Qty: ${item.quantity}</div>
            </div>
            <strong>${formatRupees(item.subtotal)}</strong>
          </div>
        `).join('')}
      </div>

      <!-- Financial Calculation -->
      <div style="background:var(--color-bg-secondary); padding:var(--space-4); border-radius:var(--radius-lg); border:1px solid var(--color-border-light); font-size:var(--text-sm);">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="color:var(--color-text-muted);">Subtotal</span>
          <span>${formatRupees(order.subtotal)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="color:var(--color-text-muted);">Shipping Fee</span>
          <span style="color:var(--color-success-600); font-weight:var(--font-semibold);">FREE</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding-top:var(--space-2); border-top:1px solid var(--color-border-light); font-weight:var(--font-extrabold); font-size:var(--text-base);">
          <span>Total Paid</span>
          <span style="color:var(--color-primary-700);">${formatRupees(order.totalAmount)}</span>
        </div>
      </div>
    `;

    // Hook up update status button
    const updateStatusBtn = document.getElementById('updateOrderStatusBtn');
    if (updateStatusBtn) {
      updateStatusBtn.addEventListener('click', () => {
        const newStatus = document.getElementById('drawerStatusSelect').value;
        order.status = newStatus;
        showAdminToast(`Order ${order.shortId} status updated to "${capitalize(newStatus.replace(/_/g, ' '))}".`);
        renderOrders();
        initDashboard();
        openOrderDrawer(order.id); // re-render drawer
      });
    }

    drawer.classList.add('open');
    overlay.classList.add('open');
  }

  function closeOrderDrawer() {
    const drawer = document.getElementById('orderDrawer');
    const overlay = document.getElementById('orderDrawerOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  const orderDrawerCloseBtn = document.getElementById('orderDrawerClose');
  const orderDrawerOverlay = document.getElementById('orderDrawerOverlay');
  if (orderDrawerCloseBtn) orderDrawerCloseBtn.addEventListener('click', closeOrderDrawer);
  if (orderDrawerOverlay) orderDrawerOverlay.addEventListener('click', closeOrderDrawer);

  // Status Filter Chips
  const filterChipsContainer = document.getElementById('adminOrderFilterChips');
  if (filterChipsContainer) {
    filterChipsContainer.querySelectorAll('.orders-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        filterChipsContainer.querySelectorAll('.orders-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentOrderFilter = chip.dataset.filter;
        renderOrders();
      });
    });
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* =========================================================================
     9. SEARCH & FILTER ATTACHMENTS
     ========================================================================= */

  // Global search redirect / filter
  const globalSearch = document.getElementById('adminGlobalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = globalSearch.value.trim();
        if (q) {
          // If on products page, filter products, otherwise jump to products
          if (window.location.pathname.includes('/admin/products')) {
            const prodInput = document.getElementById('productSearchInput');
            if (prodInput) {
              prodInput.value = q;
              renderProducts();
            }
          } else {
            window.location.href = `/admin/products?q=${encodeURIComponent(q)}`;
          }
        }
      }
    });
  }

  // Banner filters
  const bannerSearch = document.getElementById('bannerSearchInput');
  const bannerStatus = document.getElementById('bannerStatusFilter');
  if (bannerSearch) bannerSearch.addEventListener('input', renderBanners);
  if (bannerStatus) bannerStatus.addEventListener('change', renderBanners);

  // Product filters
  const prodSearch = document.getElementById('productSearchInput');
  const prodCat = document.getElementById('productCategoryFilter');
  const prodStock = document.getElementById('productStockFilter');
  const prodReset = document.getElementById('resetProductFiltersBtn');
  if (prodSearch) prodSearch.addEventListener('input', renderProducts);
  if (prodCat) prodCat.addEventListener('change', renderProducts);
  if (prodStock) prodStock.addEventListener('change', renderProducts);
  if (prodReset) {
    prodReset.addEventListener('click', () => {
      if (prodSearch) prodSearch.value = '';
      if (prodCat) prodCat.value = 'all';
      if (prodStock) prodStock.value = 'all';
      renderProducts();
    });
  }

  // User filters
  const userSearch = document.getElementById('userSearchInput');
  const userRole = document.getElementById('userRoleFilter');
  const userReset = document.getElementById('resetUserFiltersBtn');
  if (userSearch) userSearch.addEventListener('input', renderUsers);
  if (userRole) userRole.addEventListener('change', renderUsers);
  if (userReset) {
    userReset.addEventListener('click', () => {
      if (userSearch) userSearch.value = '';
      if (userRole) userRole.value = 'all';
      renderUsers();
    });
  }

  // Order filters
  const orderSearch = document.getElementById('orderSearchInput');
  const orderReset = document.getElementById('resetOrderFiltersBtn');
  if (orderSearch) orderSearch.addEventListener('input', renderOrders);
  if (orderReset) {
    orderReset.addEventListener('click', () => {
      if (orderSearch) orderSearch.value = '';
      currentOrderFilter = 'all';
      if (filterChipsContainer) {
        filterChipsContainer.querySelectorAll('.orders-filter-chip').forEach(c => c.classList.remove('active'));
        const firstChip = filterChipsContainer.querySelector('[data-filter="all"]');
        if (firstChip) firstChip.classList.add('active');
      }
      renderOrders();
    });
  }

  /* =========================================================================
     10. INITIALIZATION
     ========================================================================= */

  document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    renderBanners();
    renderProducts();
    renderUsers();
    renderOrders();
  });

}());
