// appointments.js - Manejo de citas médicas

function initAppointmentsModule() {
    // Registramos las funciones necesarias
}

function loadAppointmentsList() {
    const container = document.getElementById('appointments-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Ordenar citas por fecha
    const sortedAppointments = [...window.appointments].sort((a, b) => 
        new Date(b.start) - new Date(a.start));
    
    if (sortedAppointments.length === 0) {
        container.innerHTML = '<p class="no-appointments">No hay citas programadas.</p>';
        return;
    }
    
    sortedAppointments.forEach(app => {
        const patient = window.patients.find(p => p.id === app.patientId);
        const doctor = window.doctors.find(d => d.id === app.doctorId);
        const statusColor = getStatusColor(app.status);
        
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.dataset.id = app.id;
        card.innerHTML = `
            <div class="appointment-header">
                <span class="appointment-time">
                    ${formatDateTime(app.start)} - ${formatTime(app.end)}
                </span>
                <span class="appointment-status" style="background-color: ${statusColor}; color: white;">
                    ${app.status.toUpperCase()}
                </span>
            </div>
            <div class="appointment-patient">
                <i class="fas fa-user"></i> ${patient.name}
            </div>
            <div class="appointment-doctor">
                <i class="fas fa-user-md"></i> ${doctor.name} - ${app.type}
            </div>
            <div class="appointment-actions">
                <button class="btn-confirm" onclick="changeAppointmentStatus('${app.id}', 'confirmada', 'list-view')">
                    <i class="fas fa-check"></i> Confirmar
                </button>
                <button class="btn-cancel" onclick="changeAppointmentStatus('${app.id}', 'cancelada', 'list-view')">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button onclick="showAppointmentDetailsById('${app.id}')">
                    <i class="fas fa-info-circle"></i> Detalles
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function loadAttentionList() {
    const container = document.getElementById('attention-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Filtrar citas para hoy y ordenar por hora
    const todayAppointments = window.appointments
        .filter(app => isToday(new Date(app.start)))
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    
    if (todayAppointments.length === 0) {
        container.innerHTML = '<p class="no-appointments">No hay citas programadas para hoy.</p>';
        return;
    }
    
    todayAppointments.forEach(app => {
        const patient = window.patients.find(p => p.id === app.patientId);
        const doctor = window.doctors.find(d => d.id === app.doctorId);
        const statusColor = getStatusColor(app.status);
        
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.dataset.id = app.id;
        card.innerHTML = `
            <div class="appointment-header">
                <span class="appointment-time">
                    ${formatTime(app.start)} - ${formatTime(app.end)}
                </span>
                <span class="appointment-status" style="background-color: ${statusColor}; color: white;">
                    ${app.status.toUpperCase()}
                </span>
            </div>
            <div class="appointment-patient