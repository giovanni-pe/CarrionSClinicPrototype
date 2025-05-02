// app.js - Inicialización principal del sistema

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el sistema
    initSystem();
});

function initSystem() {
    // Configurar usuario
    document.getElementById('user-name').textContent = 'Recepcionista: Ana García';
    
    // Mostrar la aplicación
    document.getElementById('app').style.display = 'block';
    
    // Inicializar módulos
    initMenu();
    initModules();
    
    // Mostrar módulo por defecto
    showModule('calendar-view');
}

function initMenu() {
    // Configurar menús desplegables
    document.querySelectorAll('.has-submenu > .menu-link').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            
            // Cerrar otros submenús
            document.querySelectorAll('.has-submenu').forEach(el => {
                if (el !== parent) {
                    el.classList.remove('active');
                    el.querySelector('.submenu').classList.remove('show');
                }
            });
            
            // Alternar el submenú actual
            parent.classList.toggle('active');
            parent.querySelector('.submenu').classList.toggle('show');
            
            // Si es el submenú de Citas, mostrar el calendario por defecto
            if(parent.id === 'appointments-menu') {
                showModule('calendar-view');
            }
            
            // Si es el submenú de Atención, mostrar registro de pacientes
            if(parent.id === 'attention-menu') {
                showModule('patient-register');
            }
        });
    });
    
    // Configurar eventos de módulos
    document.querySelectorAll('.menu-item[data-module]').forEach(item => {
        item.addEventListener('click', function() {
            const module = this.dataset.module;
            showModule(module);
        });
    });
    
    // Menu toggle para móviles
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });
}

function initModules() {
    // Aquí se inicializarían todos los módulos
    initCalendarModule();
    initAppointmentsModule();
    initPatientsModule();
    initMedicalHistoryModule();
}

function showModule(moduleId) {
    // Ocultar todos los módulos primero
    document.querySelectorAll('.module').forEach(mod => {
        mod.style.display = 'none';
    });
    
    // Mostrar el módulo seleccionado
    const moduleElement = document.getElementById(`${moduleId}-module`);
    if (moduleElement) {
        moduleElement.style.display = 'block';
    } else {
        // Si el módulo no existe, crearlo a partir del template
        loadModuleFromTemplate(moduleId);
    }
    
    // Actualizar título en el header
    const moduleTitles = {
        'calendar-view': 'Calendario de Citas',
        'list-view': 'Lista de Citas',
        'patient-register': 'Registro de Pacientes',
        'attention-control': 'Control de Atención',
        'medical-history': 'Historial Médico'
    };
    
    document.getElementById('current-module').textContent = moduleTitles[moduleId] || 'Recepción';
    
    // Cerrar el menú en móviles
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
}

function loadModuleFromTemplate(moduleId) {
    const template = document.getElementById(`${moduleId}-template`);
    if (!template) return;
    
    const clone = template.content.cloneNode(true);
    document.querySelector('.main-content').appendChild(clone);
    
    // Inicializar el módulo específico
    switch(moduleId) {
        case 'calendar-view':
            initCalendar();
            break;
        case 'list-view':
            loadAppointmentsList();
            break;
        case 'patient-register':
            initPatientForm();
            break;
        case 'attention-control':
            loadAttentionList();
            break;
        case 'medical-history':
            initMedicalHistory();
            break;
    }
}