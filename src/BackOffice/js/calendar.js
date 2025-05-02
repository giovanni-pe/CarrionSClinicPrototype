// calendar.js - Manejo del calendario de citas

let calendar;

function initCalendarModule() {
    // Registramos las funciones necesarias
}

function initCalendar() {
    const calendarEl = document.getElementById('reception-calendar');
    if (!calendarEl) return;
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        events: getCalendarEvents(),
        eventClick: function(info) {
            showAppointmentDetails(info.event);
        },
        dateClick: function(info) {
            if(info.view.type === 'timeGridDay' || info.view.type === 'timeGridWeek') {
                showNewAppointmentForm(info.date);
            }
        }
    });

    calendar.render();
    
    // Configurar botones de vista
    document.querySelectorAll('.view-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.view-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            calendar.changeView(this.dataset.view);
        });
    });
}

function getCalendarEvents() {
    // Obtener citas y transformarlas para FullCalendar
    return window.appointments.map(app => {
        const patient = window.patients.find(p => p.id === app.patientId);
        const doctor = window.doctors.find(d => d.id === app.doctorId);
        
        return {
            id: app.id,
            title: `${patient.name} - ${doctor.name}`,
            start: app.start,
            end: app.end,
            extendedProps: {
                patient: patient.name,
                patientId: patient.id,
                doctor: doctor.name,
                doctorId: doctor.id,
                status: app.status,
                type: app.type,
                notes: app.notes
            },
            color: getStatusColor(app.status)
        };
    });
}

function refreshCalendar() {
    if (calendar) {
        calendar.removeAllEvents();
        calendar.addEventSource(getCalendarEvents());
    }
}