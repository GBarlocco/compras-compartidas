// Autores: Joaquín Carrasco (163609) & Gastón Barlocco (241025).

window.addEventListener("load",inicio);
var miSistema = new Sistema();

//Variables genericas 
var conteoNumeroCompra =1;
var sePresionoConsultaCompra = false;
var sePresionoGraficar = false;


//Funcion inicio para escuchar a todos los botones de la web.
function inicio(){
    document.getElementById("agregarPersona").addEventListener("click", registrarPersonas);
    document.getElementById("agregarCompra").addEventListener("click", registrarCompras);

    document.getElementById("reintegrarCompra").addEventListener("click", reintegrarCompras);

    document.getElementById("ordenarTablaNumero").addEventListener("click", actualizarSeccionCompras);
    document.getElementById("ordenarTablaNombre").addEventListener("click", actualizarSeccionCompras);

    document.getElementById("consultarCompras").addEventListener("click", consultarCompras);
    document.getElementById("consultarDescripcion").addEventListener("click", consultarComprasDescripcion);

    document.getElementById("graficar").addEventListener("click", graficar);
}


//Funcion para registrar personas en el sistema.
function registrarPersonas(){
    let formulario = document.getElementById("formRegistroPersonas");

    if (formulario.reportValidity()){
        let nombre = document.getElementById("nombrePersona").value;
        let seccion = document.getElementById("seccionPersona").value;
        let mail = document.getElementById("mailPersona").value;

        if (miSistema.personaRepetida(nombre)){
            let nuevaPersona = new Persona (nombre, seccion, mail.toLowerCase());
            miSistema.agregarPersona(nuevaPersona);
            actualizarCargarValores();
            formulario.reset();
        }else{
            alert ("El nombre: " + nombre + " ya existe, ingrese otro nombre.")
        }  
    } 
}


//Funcion para actualizar carga de valores relacionados a personas.
function actualizarCargarValores(){
    agregarPersonaLista();
    cargarComboBoxNomPersonas("registroHechaPor");
    cargarComboBoxNomPersonas("consultaSaldos");
    cargarCheckBoxCorespondeA();
}


//Funcion agregar en lista de las personas registradas.
function agregarPersonaLista(){
    let lista = document.getElementById("listaRegistroPersonas");
    lista.innerHTML="";

    let todosLasPersonas = miSistema.darTodasPersonas();
    
    for (let personaUnitaria of todosLasPersonas){
        agregarLista("listaRegistroPersonas", personaUnitaria);
    }
}


//Funcion para cargar en todos los comboBox de la web el nombre de las personas (Hecha por, busqueda).
function cargarComboBoxNomPersonas(id){
    let select = document.getElementById(id);
    select.innerHTML="";

    let todosLasPersonas = miSistema.darTodasPersonas();

    for (let persona of todosLasPersonas ){
        agregarOption(id, persona.nombre);
    }
}


//Funcion para cargar el checkBox con los nombres de las personas registradas en el sistema.
function cargarCheckBoxCorespondeA(){
    let contenedorCorrespondeA = document.getElementById("contenedorRegistro");
    contenedorCorrespondeA.innerHTML="";

    let todosLasPersonas = miSistema.darTodasPersonas();

    for (let persona of todosLasPersonas){
        let nodoDiv = document.createElement("div");
        let nodoLabel = document.createElement("label");
        let nodoSpan = document.createElement("span");
        let nodoText = document.createTextNode(persona.nombre);
        
        let nodoInput = document.createElement("input");
        nodoInput.setAttribute("type", "checkbox");
        nodoInput.setAttribute("name", "nombreCheck");
        nodoInput.setAttribute("value", persona.nombre);
  
        nodoSpan.appendChild(nodoText);
        nodoLabel.appendChild(nodoInput);
        nodoLabel.appendChild(nodoSpan);
        nodoDiv.appendChild(nodoLabel);
        contenedorCorrespondeA.appendChild(nodoDiv);

    }
}


//Funcion para registrar compras en el sistema.
function registrarCompras(){
    let formulario = document.getElementById("formRegistroCompras");

    if (formulario.reportValidity()){
        let numeroItemCompra =conteoNumeroCompra;

        let selectComprador = document.getElementById("registroHechaPor");
        let opcionComprador= selectComprador.options[selectComprador.selectedIndex].value;
    
        let registroDescripcion = document.getElementById("registroDescricpionCompra").value;
        let registroMontoCompra = parseInt(document.getElementById("registroMontoCompra").value);
        let correspondeA = selectCheckCorrespondeA();

        let responsableCompra = miSistema.darPersonaUnitaria(opcionComprador);

        if(miSistema.validacionParticipantes(responsableCompra,correspondeA) && correspondeA.length !=0 ){
            conteoNumeroCompra++;

            let nuevaCompra = new Compra (numeroItemCompra, responsableCompra ,registroDescripcion,registroMontoCompra, correspondeA );
            miSistema.agregarCompra(nuevaCompra);
            miSistema.incrementarSaldo(nuevaCompra);
            actualizarSeccionCompras();
            formulario.reset();
        }
        if(!(miSistema.validacionParticipantes(responsableCompra,correspondeA))){
            alert("Error: el responsable no puede ser el único participante. "); 
        }
        if(correspondeA.length == 0 ){
            alert("Error: debe seleccionar algun participante de la compra. "); 
        }   
    }
}


//Funcion para retornar las personas seleccionadas en el checkBox.
function selectCheckCorrespondeA(){
    let items=document.getElementsByName("nombreCheck")
    let seleccionItems=[];
    let persona ="";

    for(let i=0; i<= items.length-1; i++){
        if(items[i].checked==true){
            persona=items[i].value;
            seleccionItems.push(miSistema.darPersonaUnitaria(persona));
        }
    }
    return(seleccionItems);   
}


//Funcion para actualizar seccion compras (tabla, combobox).
function actualizarSeccionCompras(){
    agregarTabla();
    agregarReintegroComboBox();
    graficarValores();
}


//Funcion para agregar todas las compras a la tabla.
function agregarTabla(){
    let tabla = document.getElementById("tablaVisualizacion");
    tabla.innerHTML=""; 

    let todasLasCompras;

    if (document.getElementById("ordenarTablaNombre").checked){
        todasLasCompras= miSistema.darTodasComprasPorNombre();
    }else{
        todasLasCompras=miSistema.darTodasComprasPorNumero();
    }
    
    for (let compra of todasLasCompras) {
        let fila =tabla.insertRow();
        let celda = fila.insertCell();
        celda.innerHTML = compra.numeroCompra;
        
        celda = fila.insertCell();
        celda.innerHTML = compra.hechoPor.nombre;

        celda = fila.insertCell();
        celda.innerHTML = compra.descripcion;

        celda = fila.insertCell();
        celda.innerHTML = compra.monto;

        let participantesCompra =[];

        for (let persona of compra.correspondeA){
            participantesCompra.push(persona.nombre); 
        }
        celda = fila.insertCell();
        celda.innerHTML = participantesCompra;
        
        celda = fila.insertCell();
        celda.innerHTML = compra.estadoCompra;
    } 
}


//Funcion que agrega el número de compra en el comboBox de reintegro.
function agregarReintegroComboBox(){ 
    let numerosCompra = miSistema.darTodosNumerosCompras();
    let select = document.getElementById("numeroReintegro");
    select.innerHTML="";

    for (let numero of numerosCompra ){
        agregarOption("numeroReintegro", numero);
    }
}


//Funcion para reintegrar compras en el sistema.
function reintegrarCompras(){
    let selectNumeroReintegro= document.getElementById("numeroReintegro");
    let opcionNumeroReintegro= selectNumeroReintegro.options[selectNumeroReintegro.selectedIndex].value;

    if (miSistema.cambiarEstadoCompra(opcionNumeroReintegro)){
        actualizarSeccionCompras();
    }
    consultarComprasPersona();
}


//Funcion para consultar las compras en base a la descripcion ingresada.
function consultarComprasDescripcion(){
    let descripcionBusqueda = document.getElementById("palabraBuscar").value;
    let resultadonBusqueda = miSistema.darTodosLasDescripcionesDeBusqueda(descripcionBusqueda);
    // resultadonBusqueda = [numeroDeCompra,descripcion,numeroDeCompra,descripcion,etc].
    
    let lista = document.getElementById("busquedaPalabra");
    lista.innerHTML="";
    
    for (let i=0; i<resultadonBusqueda.length; i+=2 ){
        lista.innerHTML += "<li>" +"Compra " + resultadonBusqueda[i] + " " + resultadonBusqueda[i+1] + "</li>";
    }  
}


//Funcion para consultar compras.
function consultarCompras(){
    sePresionoConsultaCompra = true;
    consultarComprasPersona();
}


//Funcion para consultar compras de personas.
function consultarComprasPersona(){

    if (sePresionoConsultaCompra){
        let selectPersona = document.getElementById("consultaSaldos");
        let opcionPersona= selectPersona.options[selectPersona.selectedIndex].value;

        let persona = miSistema.darPersonaUnitaria(opcionPersona);

        let participoEnCompras = persona.participoCompra.toFixed(2);
        let responsableDeCompra = persona.responsableCompra.toFixed(2);

        let nodoParrafo = document.getElementById("participoPor");
        nodoParrafo.innerHTML="";

        let contenidoParrafo = "Participó en total por $" + participoEnCompras;
        agregarParrafo("participoPor",contenidoParrafo);

        nodoParrafo = document.getElementById("responsablePor");
        nodoParrafo.innerHTML="";

        contenidoParrafo = "Responsable de compras por $" + responsableDeCompra;
        agregarParrafo("responsablePor",contenidoParrafo); 
    }    
}


//Funcion para graficar.
function graficar(){
    sePresionoGraficar = true;
    graficarValores();
}


//Funcion para graficar valores.
function graficarValores(){
    if (sePresionoGraficar){
        google.load("visualization", "1", {packages:["corechart"]});

        google.setOnLoadCallback(dibujarGrafico);
    
        function dibujarGrafico() {
            let datosGrafica = miSistema.darValoresGrafica();

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Margen de compras');
            data.addColumn('number', 'Cantidad de compras');

            
            data.addRows(datosGrafica);
            
            var options = { "title": "Rangos",
                
            vAxis: {
                    format: "0",
                }
            };

            var grafica = new google.visualization.ColumnChart(document.getElementById('grafico'));
            grafica.draw(data, options);
        }   
    }  
}


//Funciones genericas

//Crear lista, crear opcion en select
function agregarLista(id, texto){
    let lista = document.getElementById(id);
    let nodoLi =document.createElement("li");
    let nodoText = document.createTextNode(texto);
    
    nodoLi.appendChild(nodoText);
    lista.appendChild(nodoLi); 
}


//Agregar option en select. Le pasamos a la funcion el ID del select + el texto a ingresa.
function agregarOption(id, texto){
    let select = document.getElementById(id);
    let nodoOption =document.createElement("option");
    let nodoText = document.createTextNode(texto);

    nodoOption.appendChild(nodoText);
    select.appendChild(nodoOption); 
}


function agregarParrafo(id,texto){
    let nodoParrafo = document.getElementById(id);
    let nodoText = document.createTextNode(texto);

    nodoParrafo.appendChild(nodoText);
}




