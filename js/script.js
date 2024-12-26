// Establece la fecha del evento (Reemplaza con la fecha de tu evento)
const fechaEvento = new Date('Feb 08, 2025 14:00:00').getTime();

const actualizarCuentaRegresiva = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = fechaEvento - ahora;

    // Cálculos de tiempo
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    // Muestra los resultados
    document.getElementById('diasTiempo').innerText = dias;
    document.getElementById('horasTiempo').innerText = horas;
    document.getElementById('minutosTiempo').innerText = minutos;
    document.getElementById('segundosTiempo').innerText = segundos;

    // Si la cuenta regresiva ha terminado
    if (distancia < 0) {
        clearInterval(actualizarCuentaRegresiva);
        document.querySelector('.cuenta-regresiva').innerHTML = '<h2>¡El gran día ha llegado!</h2>';
    }
}, 1000);



document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.getElementById('overlay');
    var abrirInvitacion = document.getElementById('abrirInvitacion');
    var contenidoPrincipal = document.getElementById('contenidoPrincipal');

    // Variables para almacenar la posición del scroll
    var scrollPosition = 0;

    // Función para bloquear el scroll
    function disableScroll() {
      // Guarda la posición actual del scroll
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      // Aplica estilos para bloquear el scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    }

    // Función para habilitar el scroll
    function enableScroll() {
      // Elimina los estilos que bloquean el scroll
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      // Restaura la posición del scroll
      window.scrollTo(0, scrollPosition);
    }

    // Bloquear el scroll al cargar la página
    disableScroll();

    // Evento al hacer clic en el sobre
    abrirInvitacion.addEventListener('click', function() {
        overlay.style.display = 'none'; // Oculta el overlay
        contenidoPrincipal.style.display = 'block'; // Muestra el contenido principal
        enableScroll(); // Habilita el scroll
    });
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCybFf0oRcOjSrZdrke5o9n-5SRNj3KbDI",
  authDomain: "invitacionxv-c42e5.firebaseapp.com",
  databaseURL: "https://invitacionxv-c42e5-default-rtdb.firebaseio.com",
  projectId: "invitacionxv-c42e5",
  storageBucket: "invitacionxv-c42e5.appspot.com",
  messagingSenderId: "989387191156",
  appId: "1:989387191156:web:b1b0d817553c3bf5963221",
  measurementId: "G-E20ZX7DGEZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// Manejar el envío del formulario
document.getElementById("confirmForm").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  // Capturar datos del formulario
  const asistira = document.getElementById("asistira").value;
  const nombre = document.getElementById("nombre").value;
  const nombreAcompanante = document.getElementById("nombre_acompanante").value;

  // Validar campos requeridos
  if (!asistira || !nombre) {
    alert("Por favor, completa todos los campos requeridos.");
    return;
  }

  // Crear objeto para almacenar en Firebase
  const confirmacion = {
    asistira,
    nombre,
    nombreAcompanante: nombreAcompanante || null, // Si está vacío, guardar como null
    fecha: new Date().toISOString()
  };

  // Guardar datos en Firebase
  push(ref(db, "confirmaciones"), confirmacion)
    .then(() => {
      alert("Confirmación enviada exitosamente.");
      document.getElementById("confirmForm").reset(); // Limpiar el formulario
    })
    .catch((error) => {
      console.error("Error al guardar la confirmación:", error);
      alert("Hubo un error al enviar la confirmación. Intenta nuevamente.");
    });
});

// Función para descargar la lista en PDF con autenticación
document.getElementById('descargarLista').addEventListener('click', function() {
  // Pedir código de autenticación
  let code = prompt('Por favor, introduce el código de autenticación:');

  // Código de autenticación correcto
  const validCode = 'demo'; // Reemplaza 'claveSecreta' por el código que desees usar

  if (code !== validCode) {
      alert('Código incorrecto. No tienes permiso para descargar la lista.');
      return;
  }

  // Si el código es correcto, obtener los datos de Firebase
  const dbRef = ref(db);

  get(child(dbRef, 'confirmaciones')).then((snapshot) => {
      if (snapshot.exists()) {
          // Procesar los datos y generar el PDF
          const data = snapshot.val();
          const entries = Object.values(data);

          // Crear un nuevo documento PDF
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF();

          doc.setFontSize(16);
          doc.text('Lista de Confirmaciones', 14, 20);

          let y = 30;

          entries.forEach((entry, index) => {
              doc.setFontSize(12);
              doc.text(`Registro ${index + 1}`, 14, y);
              y += 6;
              doc.text(`Asistirá: ${entry.asistira}`, 14, y);
              y += 6;
              doc.text(`Nombre: ${entry.nombre}`, 14, y);
              y += 6;
              if (entry.nombreAcompanante) {
                  doc.text(`Nombre Acompañante: ${entry.nombreAcompanante}`, 14, y);
                  y += 6;
              }
              doc.text(`Fecha Confirmación: ${new Date(entry.fecha).toLocaleString()}`, 14, y);
              y += 10; // Espacio adicional entre registros
          });

          // Descargar el PDF
          doc.save('lista_confirmaciones.pdf');

      } else {
          alert('No hay datos disponibles.');
      }
  }).catch((error) => {
      console.error(error);
      alert('Error al obtener los datos.');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var overlay = document.getElementById('overlay');
  var abrirInvitacion = document.getElementById('abrirInvitacion');
  var contenidoPrincipal = document.getElementById('contenidoPrincipal');
  var audioInvitacion = document.getElementById('audioInvitacion');

  // Variables para almacenar la posición del scroll
  var scrollPosition = 0;

  // Función para bloquear el scroll
  function disableScroll() {
      // Guarda la posición actual del scroll
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      // Aplica estilos para bloquear el scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
  }

  // Función para habilitar el scroll
  function enableScroll() {
      // Elimina los estilos que bloquean el scroll
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      // Restaura la posición del scroll
      window.scrollTo(0, scrollPosition);
  }

  // Bloquear el scroll al cargar la página
  disableScroll();

  // Evento al hacer clic en el sobre
  abrirInvitacion.addEventListener('click', function() {
      overlay.style.display = 'none'; // Oculta el overlay
      contenidoPrincipal.style.display = 'block'; // Muestra el contenido principal
      enableScroll(); // Habilita el scroll

      // Reproducir el audio
      audioInvitacion.play().catch(function(error) {
          console.error('No se pudo reproducir el audio:', error);
      });
  });
});
