(function (){

  let idCliente;

    const nombreinput =  document.querySelector('#nombre');
    const emailinput =  document.querySelector('#email');
     const telefonoinput =  document.querySelector('#telefono');
      const empresainput =  document.querySelector('#empresa');

      const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded',  () => {
           conectarDB()

            formulario.addEventListener('submit', actulizarcliente)
        //verificar el id de la url 
            const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');


            if (idCliente) {
                setTimeout(() => {
                    obtenerCliente(idCliente);
                }, 100);
            }

    });

    function actulizarcliente(e){
        e.preventDefault();

        if (nombreinput.value === '' || emailinput.value === ''|| telefonoinput.value === '' || empresainput.value === '') {
            
            imprimirAlerta('Todos los campos son Obligatorios', 'error')
        }
            //actualizar cliente de
            const clienteActualizado ={
                nombre : nombreinput.value,
                email : emailinput.value,
                telefono: telefonoinput.value,
                empresainput: empresainput.value,
                id : Number(idCliente)
            };
            console.log(clienteActualizado)

            const transaction = DB.transaction(['crm'], 'readwrite');

          const objectStore = transaction.objectStore('crm');

           objectStore.put(clienteActualizado);

            transaction.oncomplete = () => {
            imprimirAlerta('Editado Correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };

        transaction.onerror = (error) => {
            console.log(error);
            console.log('Hubo un errorr.');
        };
    }

    function obtenerCliente(id) {
         const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        var request = objectStore.openCursor();
        request.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                if(cursor.value.id  == Number(id) ) {
                    // pasar el que estamos editando...
                    llenarFormulario(cursor.value);
                }
                cursor.continue();          
            }
        };
    }

    function llenarFormulario(datosCliente) {

        const {nombre,email,telefono,empresa} = datosCliente;

            nombreinput.value = nombre;
            emailinput.value = email;
            telefonoinput.value = telefono;
            empresainput.value =empresa;

    }

   
} )();