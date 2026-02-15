// Toggle del sidebar - funciona tanto en desktop como móvil
function initSidebarToggle() {
    const sidebar = document.querySelector('.admin-sidebar');
    const mainContent = document.querySelector('.admin-main');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');

    const toggleSidebar = () => {
        sidebar.classList.toggle('open');
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
        console.log('Sidebar toggled'); // debug
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleSidebar);
    }

    // Cerrar sidebar al hacer click fuera (solo móvil)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                sidebar.classList.add('collapsed');
            }
        }
    });
}

// Ordenar tablas al hacer click en headers
function initTableSorting() {
    const tables = document.querySelectorAll('.admin-table.sortable');

    tables.forEach(table => {
        const headers = table.querySelectorAll('th[data-sortable]');

        headers.forEach(header => {
            header.style.cursor = 'pointer'; // cursor pointer para que se vea clickeable
            header.addEventListener('click', () => {
                const column = header.dataset.sortable;
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));

                const isAscending = header.classList.contains('sort-asc');

                // limpiar clases de sort de todas las columnas
                headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));

                // añadir la clase apropiada
                header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');

                // ordenar filas
                rows.sort((a, b) => {
                    const aValue = a.querySelector(`td:nth-child(${header.cellIndex + 1})`).textContent;
                    const bValue = b.querySelector(`td:nth-child(${header.cellIndex + 1})`).textContent;

                    if (isAscending) {
                        return bValue.localeCompare(aValue, undefined, { numeric: true });
                    } else {
                        return aValue.localeCompare(bValue, undefined, { numeric: true });
                    }
                });

                // reordenar el DOM con las filas ordenadas
                rows.forEach(row => tbody.appendChild(row));
            });
        });
    });
}

// Los modales los maneja Bootstrap, aquí solo agregamos logging
function initModals() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', (e) => {
            // console.log('Abriendo modal:', modal.id); // descomentado para debug
        });

        modal.addEventListener('hide.bs.modal', (e) => {
            // console.log('Cerrando modal:', modal.id);
        });
    });
}

// Barras de progreso con animación
const initProgressBars = () => {
    const animateProgressBar = (bar) => {
        const targetWidth = bar.dataset.progress || '0';
        bar.style.width = '0%';

        setTimeout(() => {
            bar.style.width = targetWidth + '%';
        }, 100);
    };

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar-fill');
                if (progressBar && !progressBar.classList.contains('animated')) {
                    animateProgressBar(progressBar);
                    progressBar.classList.add('animated');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.progress-container').forEach(container => {
        observer.observe(container);
    });
};

// Inicializar Tooltips
const initTooltips = () => {
    const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    tooltipTriggerList.map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            boundary: 'window',
            customClass: 'admin-tooltip'
        });
    });
};

// Inicializar Popovers
const initPopovers = () => {
    const popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
    );

    popoverTriggerList.map(popoverTriggerEl => {
        return new bootstrap.Popover(popoverTriggerEl, {
            html: true,
            customClass: 'admin-popover'
        });
    });
};

// Actualizar breadcrumb dinámicamente
const updateBreadcrumb = (items) => {
    const breadcrumbElement = document.querySelector('.breadcrumb');

    if (!breadcrumbElement) return;

    breadcrumbElement.innerHTML = items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast) {
            return `<li class="breadcrumb-item active" aria-current="page">${item.label}</li>`;
        } else {
            return `<li class="breadcrumb-item"><a href="${item.url || '#'}">${item.label}</a></li>`;
        }
    }).join('');
};

// Simular refresh de datos
const initDataRefresh = () => {
    const refreshButtons = document.querySelectorAll('[data-refresh]');

    refreshButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.refresh;
            const targetElement = document.querySelector(target);

            if (targetElement) {
                // loading state
                button.disabled = true;
                button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Actualizando...';

                // simular llamada al servidor
                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = '🔄 Actualizar';
                    console.log('Datos actualizados:', target);

                    // TODO: aquí iría la llamada real a la API
                    alert('Datos actualizados correctamente');
                }, 1500);
            }
        });
    });
};

// Confirmación de borrado
const initDeleteConfirmations = () => {
    const deleteButtons = document.querySelectorAll('[data-delete]');

    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const itemName = button.dataset.delete;
            const confirmed = confirm(`¿Está seguro de que desea eliminar "${itemName}"?`);

            if (confirmed) {
                console.log('Eliminando:', itemName);
                // TODO: implementar lógica real de borrado
                const row = button.closest('tr');
                if (row) {
                    row.style.opacity = '0';
                    setTimeout(() => row.remove(), 300);
                }
            }
        });
    });
};

// Contador animado para las stats
const initStatsCounters = () => {
    const animateCounter = (element, target) => {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    };

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('.stat-value');
                if (statValue && !statValue.classList.contains('counted')) {
                    const target = parseInt(statValue.dataset.value || statValue.textContent.replace(/,/g, ''));
                    animateCounter(statValue, target);
                    statValue.classList.add('counted');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card').forEach(card => {
        observer.observe(card);
    });
};

// Buscar/Filtrar en la tabla
const initTableFilter = () => {
    const searchInputs = document.querySelectorAll('[data-table-search]');

    searchInputs.forEach(input => {
        const tableId = input.dataset.tableSearch;
        const table = document.querySelector(`#${tableId}`);

        if (!table) return;

        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    });
};

// Inicializar todo cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('Cargando panel admin...');

    initSidebarToggle();
    initTableSorting();
    initModals();
    initProgressBars();
    initTooltips();
    initPopovers();
    initDataRefresh();
    initDeleteConfirmations();
    initStatsCounters();
    initTableFilter();

    console.log('✓ Panel admin listo');
});

// Exportar funciones por si las necesitamos después
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSidebarToggle,
        initTableSorting,
        initModals,
        initProgressBars,
        initTooltips,
        initPopovers,
        updateBreadcrumb,
        initDataRefresh,
        initDeleteConfirmations,
        initStatsCounters,
        initTableFilter
    };
}
