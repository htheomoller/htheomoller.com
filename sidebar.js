// Sidebar folder toggle
document.querySelectorAll('.sidebar-folder-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('collapsed');
  });
});

// Sidebar expand/collapse (only for headers without href)
document.querySelectorAll('.sidebar-section-header[data-section]').forEach(header => {
  header.addEventListener('click', (e) => {
    e.preventDefault();
    header.parentElement.classList.toggle('expanded');
  });
});

// Sidebar resize + mobile hamburger
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const backdrop = document.querySelector('.sidebar-backdrop');
const handle = document.querySelector('.sidebar-resize-handle');
const isDesktop = () => window.innerWidth > 768;

const SIDEBAR_MIN = 40;
const SIDEBAR_MAX = 300;

function setSidebarWidth(w) {
  sidebar.style.width = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, w)) + 'px';
}

// Drag resize (pointer events)
if (handle) {
  let dragging = false, startX, startW;

  handle.addEventListener('pointerdown', (e) => {
    if (!isDesktop()) return;
    dragging = true;
    startX = e.clientX;
    startW = sidebar.getBoundingClientRect().width;
    handle.classList.add('dragging');
    document.body.classList.add('sidebar-resizing');
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    setSidebarWidth(startW + (e.clientX - startX));
  });

  handle.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    document.body.classList.remove('sidebar-resizing');
    if (sidebar.getBoundingClientRect().width < SIDEBAR_MIN + 20) {
      setSidebarWidth(SIDEBAR_MIN);
    }
  });

  // Double-click: toggle min <-> max
  handle.addEventListener('dblclick', () => {
    if (!isDesktop()) return;
    const w = sidebar.getBoundingClientRect().width;
    sidebar.style.transition = 'width 0.25s ease';
    setSidebarWidth(w > SIDEBAR_MIN + 10 ? SIDEBAR_MIN : SIDEBAR_MAX);
    setTimeout(() => { sidebar.style.transition = ''; }, 260);
  });
}

// Mobile: Hamburger toggle
function openMobileSidebar() {
  sidebar.classList.add('open');
  backdrop.classList.add('visible');
  document.body.style.overflow = 'hidden';
  if (menuToggle) menuToggle.classList.add('active');
}

function closeMobileSidebar() {
  sidebar.classList.remove('open');
  backdrop.classList.remove('visible');
  document.body.style.overflow = '';
  if (menuToggle) menuToggle.classList.remove('active');
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    if (isDesktop()) return;
    sidebar.classList.contains('open') ? closeMobileSidebar() : openMobileSidebar();
  });
}

// Backdrop click closes mobile sidebar
if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

// Sidebar link click closes mobile sidebar
sidebar.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', () => {
    if (!isDesktop()) closeMobileSidebar();
  });
});

// Escape: collapse to min (desktop) or close drawer (mobile)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!isDesktop() && sidebar.classList.contains('open')) {
      closeMobileSidebar();
    } else if (isDesktop() && sidebar.getBoundingClientRect().width > SIDEBAR_MIN + 10) {
      sidebar.style.transition = 'width 0.25s ease';
      setSidebarWidth(SIDEBAR_MIN);
      setTimeout(() => { sidebar.style.transition = ''; }, 260);
    }
  }
});

// Resize: clear inline width on mobile
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    sidebar.style.width = '';
    sidebar.style.transition = '';
  }
  sidebar.classList.remove('open');
  backdrop.classList.remove('visible');
  document.body.style.overflow = '';
  if (menuToggle) menuToggle.classList.remove('active');
});
