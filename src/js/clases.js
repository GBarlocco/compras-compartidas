// Autores: Joaquín Carrasco (163609) & Gastón Barlocco (241025).

class Sistema {
    constructor(){
        this.listaPersonas=[];
        this.listaCompras =[];
    }

    agregarPersona(unaPersona){
        this.listaPersonas.push(unaPersona);
    }

    agregarCompra(unaCompra){
        this.listaCompras.push(unaCompra);
    }

    darTodasPersonas(){
        return this.listaPersonas;
    }

    darPersonaUnitaria(nombrePersona){
        let todasPersonas = this.darTodasPersonas();

        for (let persona of todasPersonas){
            if (persona.nombre === nombrePersona ){
                return persona;
            } 
        }
    }

    darTodasComprasPorNombre(){
        this.ordenarCompraPorNombre();
        return this.listaCompras;
    }

    darTodasComprasPorNumero(){
        this.ordenarCompraPorNumero();
        return this.listaCompras;
    }

    ordenarCompraPorNombre(){
        this.listaCompras.sort(function compare(a,b){ 
            return a.hechoPor.nombre.localeCompare(b.hechoPor.nombre);
        });
    }

    ordenarCompraPorNumero(){
        this.listaCompras.sort(function compare(a,b){ 
            return a.numeroCompra - b.numeroCompra;
        });
    }

    darTodosNumerosCompras(){
        let listaNumerosCompras =[];
        let todasLasCompras = this.darTodasComprasPorNumero();
        
        for (let compra of todasLasCompras){
            if (compra.estadoCompra === "Pendiente"){
                listaNumerosCompras.push(compra.numeroCompra);
            }
        } 
        return listaNumerosCompras; 
    }

    darTodosLasDescripcionesDeBusqueda(busqueda){
        let listaDescripcionesBusqueda =[];
        let todasLasCompras = this.darTodasComprasPorNumero();

        let busquedaColorRojo = "<span>" + busqueda + "</span>";
        
        for (let compra of todasLasCompras){
            if (compra.descripcion.includes(busqueda) && busqueda != ""){
                listaDescripcionesBusqueda.push(compra.numeroCompra);
                listaDescripcionesBusqueda.push(compra.descripcion.replace(busqueda, busquedaColorRojo));
            }
        }
        return  listaDescripcionesBusqueda;
    }

    personaRepetida(nombre){
        let noEsRepetido =true;
        let todosLasPersonas =this.darTodasPersonas();

        for (let i=0; i<= todosLasPersonas.length-1 && noEsRepetido; i++ ){
            let personaUnitaria = todosLasPersonas[i];

            if ((personaUnitaria.nombre).toUpperCase() === (nombre).toUpperCase()){
                noEsRepetido = false;
            }
        }
        return noEsRepetido;
    }

    validacionParticipantes(responsable, participantes){
        let esCorrecto =true;

        for (let participante of participantes){
            if (participantes.length ===1){
                if (responsable.nombre === participante.nombre){
                    esCorrecto = false;
                }
            }
        }
        return esCorrecto;
    }

    cambiarEstadoCompra(opcionNumeroReintegro){
        let esReintegro =false;
    
        let todosLasCompras = this.darTodasComprasPorNumero();
    
        for (let i=0; i<= todosLasCompras.length-1; i++){
            let comprasUnitarias =todosLasCompras[i];
            if(comprasUnitarias.numeroCompra == opcionNumeroReintegro){
                comprasUnitarias.estadoCompra = "Reintegrado";

                comprasUnitarias.hechoPor.responsableCompra -= comprasUnitarias.monto;

                for (let j=0; j<=comprasUnitarias.correspondeA.length-1; j++){
                    comprasUnitarias.correspondeA[j].participoCompra -= (comprasUnitarias.monto)/(comprasUnitarias.correspondeA.length)
                }   
                esReintegro =true;
            }
        }
        return esReintegro;
    }

    incrementarSaldo(nuevaCompra){
        nuevaCompra.hechoPor.responsableCompra += nuevaCompra.monto;

        for (let i=0; i<=nuevaCompra.correspondeA.length-1; i++){
            nuevaCompra.correspondeA[i].participoCompra += (nuevaCompra.monto)/(nuevaCompra.correspondeA.length);
        }    
    }

    darMaximoValorCompra(){
        let maximaCompra =0;
        let todasLasCompras = this.darTodasComprasPorNombre();
        
        for (let compra of todasLasCompras){
            if (compra.monto >= maximaCompra){
                maximaCompra = compra.monto;
            }
        }
        return  maximaCompra;
    }

    darMontoTodasCompras(){
        let todosLosMontos =[];
        let todasLasCompras = this.darTodasComprasPorNombre();

        for (let compra of todasLasCompras){
            todosLosMontos.push(compra.monto);
        }

        return todosLosMontos;
    }

    darValoresGrafica(){
        let maxCompra=this.darMaximoValorCompra();
        let todasLasCompras = this.darMontoTodasCompras();

        let  ejeXeY = this.generarEjeXeY(maxCompra);
        
        let arrayGrafica = this.datosGrafico(ejeXeY,todasLasCompras);

        let datoFinal = [];
        let arrayAuxiliar=[];

        for (let i=0; i <=arrayGrafica.length-1; i++ ){
            let indiceInferior;
            let indiceSuperior;
            let cantidadCompra =arrayGrafica[i];

            indiceInferior = i*100;
            indiceSuperior = i*100 +99;
            
            arrayAuxiliar.push(indiceInferior+"-"+indiceSuperior);
            arrayAuxiliar.push(cantidadCompra); 
            datoFinal.push(arrayAuxiliar);
            arrayAuxiliar =[];
        }
        return datoFinal;
    }

    
   generarEjeXeY(maximaCompra){
       /*
            Genero la estructura del eje x e y en base a la máxima compra, y lo cargo todo con 0.
            Eje x:Las posiciones serán utilizadas para realizar el indice mínimo y máximo.
            Eje y: el contenido de la posicion para la cantidad de compra.
            Ejemplo: maxima compra = 1500 --> Math.trunc(1500/100) = 15 (genero un array de 16 posiciones)
            Pos0 --> 0-99.
            Pos1 --> 100-199.
            Pos2 --> 200-299.
            .
            .
            Pos15 --> 1500-1599.
        */
        let compras =[];

        for (let i=0; i<= Math.trunc(maximaCompra/100); i++ ){
            compras.push(0);
        }
        return compras;  
    }
    
    datosGrafico(ejeXeY,compras){
        /*
        Cargo el array respecticamente con las compras. Me pasan el eje x e y, y todas las compras.
        Cada posicion del array corresponde a un margen de compra del eje x (mínimo y máximo), entonces, 
        sabiendo la compra (eje y) puedo saber su posicion e incrementar un contador. Ejemplo:
        ejeXeY =[0,0,0,0,0.....]; --> pos0: 0-99 (eje x) cant=0 (eje y). pos1: 100-199(eje x) cant=0 (eje y), etc.
        compras = [150,201,350,400......]; --> Math.trunc(150/100) =1 --> la compra 150 se ubicará 
                                                                        en la posicion 1 del array ejeXeY,
                                                                        incremento ese valor.
        */

        for (let compra of compras){
            ejeXeY[Math.trunc(compra/100)] ++;
        }
        return ejeXeY;
    }
}

class Persona{
    constructor(nombre, seccion, mail){
        this.nombre =nombre;
        this.seccion =seccion;
        this.mail = mail;
        this.responsableCompra =0;
        this.participoCompra =0;
    }

    toString(){
        return this.nombre + " -Sección: " + this.seccion + "-" + this.mail;
    }
}

class Compra{
    constructor (numeroCompra, hechoPor, descripcion, monto, correspondeA){
        this.numeroCompra = numeroCompra;
        this.hechoPor = hechoPor;
        this.descripcion = descripcion;
        this.monto = monto;
        this.correspondeA =correspondeA;
        this.estadoCompra = "Pendiente";
    }

   toString(){
        return "Número de compra:" + this.numeroCompra + "Responsable: " +this.hechoPor + "Descripción: " + this.descripcion + "Monto: " + this.monto;
    }
}

