const apiUrl = 'http://localhost:8080/paciente';

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("patient-form");
    const patientList = document.getElementById("patient-list");
    const searchPatientBtn = document.getElementById("searchPatientBtn");
    const searchResult = document.getElementById("searchResult");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const patientId = document.getElementById("patientId").value;
        if (patientId) {
            updatePatient(patientId);
        } else {
            addPatient();
        }
    });

    searchPatientBtn.addEventListener("click", function () {
        const searchId = document.getElementById("searchId").value;
        if (searchId) {
            searchPatientById(searchId);
        }
    });

    function addPatient() {
        const patient = {
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            dni: document.getElementById("dni").value,
            fechaIngreso: document.getElementById("fechaIngreso").value,
            domicilio: document.getElementById("domicilio").value
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patient)
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
            loadPatients();
        })
        .catch(error => console.error('Error:', error));
    }

    function loadPatients() {
        fetch(`${apiUrl}/buscarTodos`)
            .then(response => response.json())
            .then(patients => renderPatients(patients))
            .catch(error => console.error('Error:', error));
    }

    function renderPatients(patients) {
        patientList.innerHTML = '';

        patients.forEach(patient => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.apellido}</td>
                <td>${patient.nombre}</td>
                <td>${patient.dni}</td>
                <td>${patient.fechaIngreso}</td>
                <td>${patient.domicilio}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editPatient(${patient.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePatient(${patient.id})">Eliminar</button>
                </td>
            `;

            patientList.appendChild(tr);
        });
    }

    function searchPatientById(id) {
        fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(patient => {
                if (patient) {
                    searchResult.innerHTML = `
                        <div class="alert alert-info">
                            <strong>ID:</strong> ${patient.id}<br>
                            <strong>Apellido:</strong> ${patient.apellido}<br>
                            <strong>Nombre:</strong> ${patient.nombre}<br>
                            <strong>DNI:</strong> ${patient.dni}<br>
                            <strong>Fecha de Ingreso:</strong> ${patient.fechaIngreso}<br>
                            <strong>Domicilio:</strong> ${patient.domicilio}
                        </div>
                    `;
                } else {
                    searchResult.innerHTML = `<div class="alert alert-danger">Paciente no encontrado</div>`;
                }
            })
            .catch(error => console.error('Error:', error));
    }

    window.editPatient = function(id) {
        fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(patient => {
                document.getElementById("patientId").value = patient.id;
                document.getElementById("apellido").value = patient.apellido;
                document.getElementById("nombre").value = patient.nombre;
                document.getElementById("dni").value = patient.dni;
                document.getElementById("fechaIngreso").value = patient.fechaIngreso;
                document.getElementById("domicilio").value = patient.domicilio;
            })
            .catch(error => console.error('Error:', error));
    }

    function updatePatient(id) {
        const patient = {
            apellido: document.getElementById("apellido").value,
            nombre: document.getElementById("nombre").value,
            dni: document.getElementById("dni").value,
            fechaIngreso: document.getElementById("fechaIngreso").value,
            domicilio: document.getElementById("domicilio").value
        };

        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patient)
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
            loadPatients();
        })
        .catch(error => console.error('Error:', error));
    }

    window.deletePatient = function(id) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        })
        .then(() => loadPatients())
        .catch(error => console.error('Error:', error));
    }

    loadPatients();
});
