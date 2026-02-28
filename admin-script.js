function initSidebarToggle() {
    const sidebar = document.querySelector('.admin-sidebar');
    const mainContent = document.querySelector('.admin-main');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');

    const toggleSidebar = () => {
        sidebar.classList.toggle('open');
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleSidebar);
    }

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                sidebar.classList.add('collapsed');
            }
        }
    });
}

function initTableSorting() {
    const tables = document.querySelectorAll('.admin-table.sortable');

    tables.forEach(table => {
        const headers = table.querySelectorAll('th[data-sortable]');

        headers.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const isAscending = header.classList.contains('sort-asc');

                headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
                header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');

                rows.sort((a, b) => {
                    const aValue = a.querySelector(`td:nth-child(${header.cellIndex + 1})`).textContent;
                    const bValue = b.querySelector(`td:nth-child(${header.cellIndex + 1})`).textContent;

                    if (isAscending) {
                        return bValue.localeCompare(aValue, undefined, { numeric: true });
                    } else {
                        return aValue.localeCompare(bValue, undefined, { numeric: true });
                    }
                });

                rows.forEach(row => tbody.appendChild(row));
            });
        });
    });
}

const initProgressBars = () => {
    const animateProgressBar = (bar) => {
        const targetWidth = bar.dataset.progress || '0';
        bar.style.width = '0%';

        setTimeout(() => {
            bar.style.width = targetWidth + '%';
        }, 100);
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
    }, { threshold: 0.1 });

    document.querySelectorAll('.progress-container').forEach(container => {
        observer.observe(container);
    });
};

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

const initDataRefresh = () => {
    const refreshButtons = document.querySelectorAll('[data-refresh]');

    refreshButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.refresh;
            const targetElement = document.querySelector(target);

            if (targetElement) {
                button.disabled = true;
                button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Actualizando...';

                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = 'Actualizar';
                    alert('Datos actualizados correctamente');
                }, 1500);
            }
        });
    });
};

const initDeleteConfirmations = () => {
    const deleteButtons = document.querySelectorAll('[data-delete]');

    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const itemName = button.dataset.delete;
            const confirmed = confirm(`¿Está seguro de que desea eliminar "${itemName}"?`);

            if (confirmed) {
                const row = button.closest('tr');
                if (row) {
                    row.style.opacity = '0';
                    setTimeout(() => row.remove(), 300);
                }
            }
        });
    });
};

const initStatsCounters = () => {
    const animateCounter = (element, target) => {
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
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
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card').forEach(card => {
        observer.observe(card);
    });
};

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

document.addEventListener('DOMContentLoaded', () => {
    initSidebarToggle();
    initTableSorting();
    initProgressBars();
    initTooltips();
    initPopovers();
    initDataRefresh();
    initDeleteConfirmations();
    initStatsCounters();
    initTableFilter();
});
