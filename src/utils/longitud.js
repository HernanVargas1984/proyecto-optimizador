let InputsHeadersCorte = Array.from(document.querySelectorAll(".longInputs"));
let tablaListaCorte = document.getElementById("listaCorte");
let botonAgregar = document.getElementById("botonAgregar");
let descripcionMaterial = document.getElementById("descripcionMaterial");
let longitudMaterial = document.getElementById("longitudMaterial");
let unidadesMedida = document.getElementById("unidadesMedida");
let grosorHta = document.getElementById("grosorHta");
let longitudCorte = document.getElementById("longCorte");
let despunteIzq = document.getElementById("despunteIzq");
let despunteDer = document.getElementById("despunteDer");
let botonCalcular = document.getElementById("botonCalcular");
let referencia = document.getElementById("refCorte");
let divMensajeModal = document.getElementById("mensajeModal");
let botonEnsayo = document.getElementById("ensayoModal");
let arrayCortes = [];
let cantMaterial = 0
let sumaCantidades = 0
let contador = 0
let arrayTrabajo = []

let mostrarMensaje = function(mensaje) {
    divMensajeModal.innerHTML = mensaje
    $('#modalAlert').modal('show');
}

let compararValorInputs = function(inputMayor, inputMenor) {

    let mayor = parseFloat(inputMayor.value);
    let menor = parseFloat(inputMenor.value);

    if (menor > mayor) {

        mostrarMensaje(`${inputMenor.name} no puede ser mayor que ${inputMayor.name}`);

        // let mensajeModal = `${inputMenor.name} no puede ser mayor que ${inputMayor.name}`
        // mostrarMensaje(mensajeModal);
        inputMenor.value = "";
        return
    }
}

longitudCorte.onchange = function() {
    //parametros: inpunMayor , input menor
    compararValorInputs(longitudMaterial, longitudCorte)
}

despunteIzq.onchange = function() {
    //parametros: inpunMayor , input menor
    compararValorInputs(longitudMaterial, despunteIzq)
}

despunteDer.onchange = function() {
    //parametros: inpunMayor , input menor
    compararValorInputs(longitudMaterial, despunteDer)
}

grosorHta.onchange = function() {
    //parametros: inpunMayor , input menor
    compararValorInputs(longitudMaterial, grosorHta)
}

function validar_corte() {
    if (descripcionMaterial.value == "") {
        mostrarMensaje("falta ingresar la descripción del material");
        return false;
    }
    if (longitudMaterial.value == "") {
        mostrarMensaje("falta ingresar la Longitud del material");
        return false;
    }
    if (unidadesMedida.value == "") {
        mostrarMensaje("falta ingresar las unidades de medida");
        return false;
    }
    if (grosorHta.value == "") {
        mostrarMensaje("falta ingresar el grosor de la herramienta");
        return false;
    }

    let esVacio = InputsHeadersCorte.some(function(item) {
        return item.value == "";
    });

    if (esVacio == true) {
        mostrarMensaje("debe llenar todos los campos");
        return false;
    }

    if (arrayCortes.length > 0) {

        let ref = referencia.value

        let filterRef = arrayCortes.filter(function(item) {
            return item.referencia == ref
        })

        if (filterRef.length > 0) {
            mostrarMensaje(`La referencia ${filterRef[0].referencia} ya ha sido agregada
      con una longitud de ${filterRef[0].longitud}
      si requiere agregar mas cortes de ésta misma referencia, 
      elimine la referencia y agreguela de nuevo con la cantidad deseada`)
            return false
        }

    }

}

let crearPlantilla = function() {
    const row = tablaListaCorte.insertRow();

    let idConsecutivo = new Date().getTime();
    let idFila = `fila-${idConsecutivo}`;
    let objCortes = {}

    objCortes.referencia = InputsHeadersCorte[0].value
    objCortes.longitud = parseFloat(InputsHeadersCorte[1].value)
    objCortes.cantidad = parseInt(InputsHeadersCorte[2].value)

    let newObjCortes = {...objCortes }

    arrayCortes.push(newObjCortes)

    row.innerHTML = `
  <tr>
    <td>${InputsHeadersCorte[0].value}</td>
    <td>${InputsHeadersCorte[1].value}</td>
    <td>${InputsHeadersCorte[2].value}</td>
  </tr>
  `

    const botonEliminar = document.createElement("button")
    botonEliminar.innerHTML = "X"
    row.id = idFila
    botonEliminar.onclick = function() {
        document.getElementById(idFila).remove();
        let indexOfCorte = arrayCortes.findIndex(i => i.id === idFila);
        arrayCortes.splice(indexOfCorte, 1)
    }
    row.appendChild(botonEliminar);
};

function agregar_corte() {

    crearPlantilla();

    InputsHeadersCorte.forEach(function(element) {
        element.value = "";
    });

};

let ordenarCortes = function() {

    let copyAarrayCortes = [...arrayCortes]

    cortesOrdenado = copyAarrayCortes.sort(function(a, b) {

        return b.longitud - a.longitud

    })

    return cortesOrdenado

}

let calcularCobinaciones = function(cortesOrdenado) {

    let longMaterial = parseFloat(longitudMaterial.value);
    let objComb = {};
    let combinaciones = [];

    cortesOrdenado.forEach((item) => {
        item.cantMax = Math.trunc(longMaterial / item.longitud);
        item.cantMax = Math.min(item.cantMax, item.cantidad);
    })

    cortesOrdenado.forEach((item, num) => {

        let cantInicial = item.cantMax

        for (var i = cantInicial; i > 0; i--) {

            let desperdicio = longMaterial;
            let arrayConbinacion = [];
            let objCombinacion = {};

            item.cantComb = i;
            objComb = {...item };
            arrayConbinacion.push(objComb);

            desperdicio -= (i * item.longitud);

            for (var j = num + 1; j < cortesOrdenado.length; j++) {

                if (cortesOrdenado[j].longitud <= desperdicio && cortesOrdenado[j].cantidad > 0) {

                    cortesOrdenado[j].cantComb = Math.trunc(desperdicio / cortesOrdenado[j].longitud)
                    cortesOrdenado[j].cantComb = Math.min(cortesOrdenado[j].cantComb, cortesOrdenado[j].cantidad);

                    desperdicio -= (cortesOrdenado[j].cantComb * cortesOrdenado[j].longitud)

                    objComb = {...cortesOrdenado[j] }

                    arrayConbinacion.push(objComb);

                }

            }

            objCombinacion.desperdicio = desperdicio
            objCombinacion.combinacion = [...arrayConbinacion]


            let newCombinacion = {...objCombinacion }
            combinaciones.push(newCombinacion)

        }

    })

    return combinaciones

}

let elegirMejorCombinacion = function(combinaciones) {

    let combMenorDesperdicio = combinaciones.sort((a, b) => a.desperdicio - b.desperdicio)[0];

    combMenorDesperdicio.combinacion.forEach((item) => {

        arrayCortes.find(function(corte) {

            if (corte.referencia == item.referencia) {

                corte.cantidad -= item.cantComb

            }

        })

    })

    sumaCantidades = 0

    cantMaterial += 1

    arrayCortes.forEach(function(ref) {
        sumaCantidades += ref.cantidad;
    });

    return combMenorDesperdicio

}

let printDiv = function(divToPrint, cssPath) {

    let newWin = window.open("", "Print-Window");

    newWin.document.open();


    newWin.document.write(
        `
  <html>
      <head>
      <title>Listado de Cortes</title>
      <link rel="stylesheet" href="${cssPath}"/>
      <link rel="shortcut icon" href="../assets/iconos/favicon.ico" type="image/x-icon" sizes="16x16">
      </head>
      <body>
      <header>
      <section class="header__container">
          <a class="container__logo" href="../HTML/home.html"><img src="/public/assets/img/logotipo.svg" alt=""></a>

          <div class="header__container--user">

              <a class="header__resgistrarse" href="/public/HTML/registro.html">Registrarse</a>
              <span class="header__login"><a  href="/public/HTML/inicioSesion.html">Login</a></span>

              <div class="nav_right">
                  <ul>
                      <li class="nr_li dd_main">
                          <div>
                              <img src="../assets/img/user.svg" alt="profile_img">

                          </div>


                          <div class="dd_menu">
                              <div class="dd_right">
                                  <ul>
                                      <li class="cerrar">X</li>
                                      <li><b>Usuario :</b>Hernan Giraldo</li>
                                      <li>Historial</li>
                                      <li>Cerrar sesión / Logout</li>
                                  </ul>
                              </div>
                          </div>
                      </li>
                  </ul>
              </div>

          </div>

      </section>

  </header>
        <main class="main__resultados">
            ${divToPrint}

        </main>

      
      <footer class="footer__container">
        <div class="footer__information">
            <img src="../assets/img/registrada.svg" alt="">
            <div>
                <p>Politicas</p>
                <p>PQRS</p>
                <p>Privacidad</p>

            </div>

        </div>
        <div class="footer__location">
            <img src="../assets/img/location.svg" alt="">
            <p>Calle 4 # 34 - 45 Medellín (A.)</p>
        </div>
        <div class="footer__social">
            <img src="../assets/img/facebook.svg" alt="">
            <img src="../assets/img/instagram.svg" alt="">
            <img src="../assets/img/gmail.svg" alt="">

        </div>
    </footer>


      </body>
  </html>
  `
    );

    newWin.document.close();
    newWin.print();

};

botonAgregar.onclick = function() {
    if (validar_corte() == false) {
        return;
    }
    agregar_corte();

};

botonCalcular.onclick = function() {

    if (arrayCortes.length == 0) {
        mostrarMensaje("No hay cortes para calcular")
        return
    }


    do {

        const arrayOrdenado = ordenarCortes();

        const combinaciones = calcularCobinaciones(arrayOrdenado);

        const combElegida = elegirMejorCombinacion(combinaciones);

        arrayTrabajo.push(combElegida);


    } while (sumaCantidades > 0)

    let tablaResumen = document.getElementById("tablaResumen");

    arrayTrabajo.forEach(function(corte) {
        contador += 1;
        let cantidadCortes = corte.combinacion.length;
        let cadenaCortes = "";

        cadenaCortes = `
    <tr>
      <td rowspan=${cantidadCortes}>${contador}</td>
      <td>${corte.combinacion[0].referencia}</td>
      <td>${corte.combinacion[0].longitud}</td>
      <td>${corte.combinacion[0].cantComb}</td>
      <td rowspan=${cantidadCortes}>${corte.desperdicio}</td>
    </tr>
    `
        if (cantidadCortes > 1) {

            for (let i = 1; i < cantidadCortes; i++) {

                cadenaCortes += `
      <tr>
        <td>${corte.combinacion[i].referencia}</td>
        <td>${corte.combinacion[i].longitud}</td>
        <td>${corte.combinacion[i].cantComb}</td>
      </tr>
      `

            }

        }

        console.log(cadenaCortes)

        tablaResumen.innerHTML += cadenaCortes;

    })

    let descripcion = document.getElementById("descripcionMaterial");
    let longitud = document.getElementById("longitudMaterial");

    tablaResumen.innerHTML += `
    
  <tfoot>
    <tr class="foot__tabla--container">
      <td colspan=4>Total material ${descripcion.value} de <b>${longitud.value}</b></td>
      <td><b>Total: </b> ${cantMaterial} unidades</td>
    </tr>
    
  </tfoot>
  <div class="list__download">
    <div>
        <button></button>
        <p>Descargar</p>
    </div>
    </div>
  
    
  
  `

    tablaResumen.hidden = false;

    let divToPrint = document.getElementById("resumenCorte")
    let divHtml = divToPrint.innerHTML
    let divCss = "../css/longitud.css"

    printDiv(divHtml, divCss);

    console.log(`cantidad de material = ${cantMaterial} unidades`)
    console.log(arrayTrabajo)

};


var cerrar = document.querySelector(".cerrar")
var dd_main = document.querySelector(".dd_main");

dd_main.addEventListener("click", function() {
    this.classList.toggle("active");
})
cerrar.addEventListener("click", function() {
    this.classList.toggle("hidden")
})

// botonEnsayo.onclick = function () {

//   console.log("aquí llego al modal")
//   let mensajeModal = `Mensaje Funcionó el modal`
//   divMensajeModal.innerHTML = mensajeModal
//   $('#modalAlert').modal('show');
// }