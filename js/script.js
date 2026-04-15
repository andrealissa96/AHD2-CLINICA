let datosCita = [];
let horasBase = ["8:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

$(document).ready(function(){

AOS.init();


$('#servicio').select2({
    placeholder: "Seleccine el servicio"

    


})

flatpickr("#fecha", {
    dateFormat: "d/m/Y",
    minDate: "today",

    disable: [
        function(date) {
            let d = flatpickr.formatDate(date, "d/m/Y");
            return diaLleno(d);
        }
    ],

    onChange: function(selectedDates, dateStr) {
        actualizarHoras(dateStr);
    }
});

$('#hora').select2({
    placeholder: "Hora"

    


})



})


$('#formRegistro').submit(function(e){
    e.preventDefault();

    let nombre = $('#nombre').val();
    let numero= $('#numero').val();
    let correo = $('#correo').val();
    let fecha =$('#fecha').val();
    let hora= $('#hora').val();
    let servicio = $('#servicio').val();


if(nombre === ""|| numero===""||correo === "" || fecha===""|| hora==="" || servicio === "" ){
    Swal.fire({
        icon:'error',
        title: 'Campos vacios',
        text: 'Debe completar todos los campos'
    });

    return;
}

if (numero.length !== 8) {
    Swal.fire({
        icon: 'error',
        title: 'Número inválido',
        text: 'Debe tener 8 dígitos'
    });
    return;
}

guardarDatos(nombre, numero, correo, fecha, hora, servicio);
})


function guardarDatos(nombre, numero, correo, fecha, hora, servicio){

    $.ajax({
 url:'https://jsonplaceholder.typicode.com/posts', type: 'POST',
 data:{
    nombre: nombre,
    numero: numero,
    correo: correo,
    fecha: fecha,
    hora:hora,
    servicio: servicio
    
     },
     success: function (respuesta){

          HistorialdeCitas(nombre, numero, correo, fecha, hora, servicio);
          actualizarHoras(fecha);
          
        Swal.fire({
            icon: 'success',
            title: 'Su cita ha sido agendada',
            html: `
            <div style="text-align:left">
                <p> Se le contactará vía whatsapp</p>
                <hr>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Número:</strong> ${numero}</p>
                <p><strong>Correo:</strong> ${correo}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <p><strong>Hora:</strong> ${hora}</p>
                <p><strong>Servicio:</strong> ${servicio}</p>
            </div>
        `
        });
     }

    })
}




  function HistorialdeCitas(nombre, numero, correo, fecha, hora, servicio){

    let cita = {
        nombre,
        numero,
        correo,
        fecha,
        hora,
        servicio
    };

    datosCita.push(cita); 
    mostrarCita();
}

function mostrarCita() {
    
    let tabla = document.getElementById("tablaHistorial");
    let body = document.getElementById("bodyTabla");
    let titulo = document.getElementById("tituloHistorial");

    body.innerHTML = "";

    if (datosCita.length > 0) {
        tabla.style.display = "table";
        titulo.innerHTML = "Historial de Citas Confirmadas";
    } else {
        tabla.style.display = "none";
        titulo.innerHTML = "";
    }

    for (let i = 0; i < datosCita.length; i++) {

        let fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${datosCita[i].nombre}</td>
            <td>${datosCita[i].numero}</td>
            <td>${datosCita[i].correo}</td>
            <td>${datosCita[i].fecha}</td>
            <td>${datosCita[i].hora}</td>
            <td>${datosCita[i].servicio}</td>
            <td><button class="btnEliminar">Eliminar</button></td>
        `;

        body.appendChild(fila);

        let botonEliminar = fila.querySelector(".btnEliminar");

        botonEliminar.onclick = function () {
            datosCita.splice(i, 1);
            mostrarCita();
        };
    }
}


function obtenerHorasDisponibles(fecha) {

    let ocupadas = datosCita
        .filter(c => c.fecha === fecha)
        .map(c => c.hora);

    return horasBase.filter(h => !ocupadas.includes(h));

    
}

function diaLleno(fecha) {
    return obtenerHorasDisponibles(fecha).length === 0;
}

function actualizarHoras(fecha) {

    let select = document.getElementById("hora");
    select.innerHTML = "";

    let disponibles = obtenerHorasDisponibles(fecha);

    if (disponibles.length === 0) {
        select.innerHTML = "<option>No hay horarios</option>";
        return;
    }

   

    disponibles.forEach(h => {
        let option = document.createElement("option");
        option.value = h;
        option.textContent = h;
        select.appendChild(option);
    });
}

