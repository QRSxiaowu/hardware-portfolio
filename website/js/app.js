/* ===========================================
   Hardware Portfolio - Main Application
   吴学纯 - 嵌入式硬件工程师
   =========================================== */

const el = {
  header:       document.querySelector('.header'),
  projectsGrid: document.getElementById('projectsGrid'),
  filterBtns:   document.querySelectorAll('.filter-btn'),
  lightbox:     document.getElementById('lightbox'),
  lightboxImg:  document.getElementById('lightboxImg'),
  lightboxClose: document.querySelector('.lightbox-close'),
  lightboxPrev: document.querySelector('.lightbox-nav.prev'),
  lightboxNext: document.querySelector('.lightbox-nav.next'),
  modal:        document.getElementById('projectModal'),
  modalClose:   document.querySelector('.modal-close'),
  modalBody:    document.querySelector('.modal-body'),
  countEl:      document.getElementById('projectsCount'),
  yearEl:       document.getElementById('yearEl')
};

let projects = [];
let categories = [];
let activeFilter = 'all';
let lightboxImages = [];
let lightboxIndex = 0;

function init() {
  if (!PROJECTS_DATA) return;
  projects = PROJECTS_DATA.projects;
  categories = PROJECTS_DATA.categories;
  if (el.yearEl) el.yearEl.textContent = new Date().getFullYear();
  renderProjects(projects);
  setupFilters();
  setupLightbox();
  setupModal();
  setupScrollAnimations();
  updateStats();
}

function renderProjects(projectList) {
  if (!el.projectsGrid) return;
  el.projectsGrid.innerHTML = projectList.map(project => { const idx = projects.indexOf(project);
    const thumb = project.images.find(i => /3D/i.test(i)) || project.images[0] || '';
    return `
      <div class="project-card" data-index="${idx}" style="--delay: ${idx * 0.05}s">
        <div class="project-card-image">
          <img src="../${thumb}" alt="${escapeHtml(project.name)}" loading="lazy"
            onerror="this.parentElement.innerHTML='<div class=no-image><span>\u{1F4CB}</span><p>${escapeHtml(project.name)}</p></div>'">
          <div class="project-card-overlay">
            <div class="project-card-actions">
              <button class="btn-view" onclick="openProjectDetail(${idx})" title="查看详情">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>
              </button>
            </div>
          </div>
          <div class="project-badge">${escapeHtml(project.category)}</div>
        </div>
        <div class="project-card-info">
          <h3>${escapeHtml(project.name)}</h3>
          <div class="project-meta">
            <span>${project.images.length} 张图片</span>
            <span>${project.schPdf.length + project.pcbPdf.length} 份图纸</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

// ---- Filters ----
function setupFilters() {
  el.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      el.filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);
      renderProjects(filtered);
    });
  });
}

// ---- Lightbox ----
function setupLightbox() {
  el.lightboxClose.addEventListener('click', closeLightbox);
  el.lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  el.lightboxNext.addEventListener('click', () => navigateLightbox(1));
  document.addEventListener('keydown', (e) => {
    if (!el.lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
  el.lightbox.addEventListener('click', (e) => { if (e.target === el.lightbox) closeLightbox(); });
}

function openLightbox(images, index) {
  lightboxImages = images;
  lightboxIndex = index;
  updateLightboxImage();
  el.lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  el.lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  if (!lightboxImages.length) return;
  const src = '../' + lightboxImages[lightboxIndex];
  el.lightboxImg.src = src;
  let counter = el.lightbox.querySelector('.lightbox-counter');
  if (!counter) {
    counter = document.createElement('div');
    counter.className = 'lightbox-counter';
    el.lightbox.querySelector('.lightbox-content').appendChild(counter);
  }
  counter.textContent = (lightboxIndex + 1) + ' / ' + lightboxImages.length;
  const nextSrc = '../' + lightboxImages[(lightboxIndex + 1) % lightboxImages.length];
  const prevSrc = '../' + lightboxImages[(lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length];
  const p1 = new Image(); p1.src = nextSrc;
  const p2 = new Image(); p2.src = prevSrc;
}

// ---- Modal ----
function setupModal() {
  el.modalClose.addEventListener('click', closeModal);
  el.modal.addEventListener('click', (e) => { if (e.target === el.modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && el.modal.classList.contains('active')) closeModal(); });
}

function openProjectDetail(index) {
  const project = projects[index];
  if (!project) return;
  window.currentProjectImages = project.images;

  let html = '<div class="modal-header-section">' +
    '<div class="modal-category-badge">' + escapeHtml(project.category) + '</div>' +
    '<h2>' + escapeHtml(project.name) + '</h2>' +
    '<p class="modal-subtitle">' + (project.schPdf.length + project.pcbPdf.length + project.otherPdf.length) +
    ' 份设计文件 &middot; ' + project.images.length + ' 张预览图</p></div>';

  if (project.images.length > 0) {
    html += '<div class="modal-section"><h3 class="modal-section-title">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><circle cx="12" cy="12" r="3"/></svg>' +
      '3D 预览图</h3><div class="gallery-grid">';
    project.images.forEach(function(img, i) {
      html += '<div class="gallery-item" onclick="openLightbox(window.currentProjectImages, ' + i + ')">' +
        '<img src="../' + img + '" alt="3D View ' + (i+1) + '" loading="lazy">' +
        '<div class="gallery-item-overlay"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg></div></div>';
    });
    html += '</div></div>';
  }

  function pdfGroup(title, icon, pdfs) {
    if (!pdfs || !pdfs.length) return '';
    let h = '<div class="modal-section"><h3 class="modal-section-title">' + icon + escapeHtml(title) + '</h3><div class="pdf-list">';
    pdfs.forEach(function(p) {
      const name = p.replace(/^.*[\\/\\\\]/, '');
      h += '<a href="../' + p + '" target="_blank" class="pdf-link">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' +
        escapeHtml(name) + '<span class="pdf-badge">查看</span></a>';
    });
    h += '</div></div>';
    return h;
  }

  html += pdfGroup('原理图 (Schematic)',
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v7m0 6v7M2 12h7m6 0h7"/></svg>',
    project.schPdf);

  html += pdfGroup('PCB 设计图',
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    project.pcbPdf);

  html += pdfGroup('技术文档',
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    [...project.otherPdf, ...project.docFiles]);

  el.modalBody.innerHTML = html;
  el.modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  el.modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ---- Stats ----
function updateStats() {
  const elP = document.getElementById('statProjects');
  const elF = document.getElementById('statPdfs');
  const elI = document.getElementById('statImages');
  if (elP) { const n = elP.querySelector('.stat-number'); if (n) n.textContent = projects.length; }
  if (elF) {
    let t = 0; projects.forEach(function(p) { t += p.schPdf.length + p.pcbPdf.length + p.otherPdf.length; });
    const n = elF.querySelector('.stat-number'); if (n) n.textContent = t;
  }
  if (elI) {
    let t = 0; projects.forEach(function(p) { t += p.images.length; });
    const n = elI.querySelector('.stat-number'); if (n) n.textContent = t;
  }
}

// ---- Scroll ----
function setupScrollAnimations() {
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-on-scroll').forEach(function(e) { obs.observe(e); });
  window.addEventListener('scroll', function() {
    document.querySelector('.header').classList.toggle('scrolled', window.pageYOffset > 100);
  });
}

document.addEventListener('DOMContentLoaded', init);
