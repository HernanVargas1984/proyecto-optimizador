let Inputsregistro = Array.from(document.querySelectorAll(".input"));
let boton_agregar = document.getElementById("btn-agregar");
let datosUsuario = {};
let arrayUsuarios = [];

let validar_vacios = function () {

 let esvacio = Inputsregistro.some(function (input) {
  return input.value == ""
 })

 return esvacio
  
}

let crearUsuario = function () {

Inputsregistro.forEach(function (input) {

    datosUsuario[input.name]=input.value
    
})

let nuevoUsuario = {...datosUsuario}

arrayUsuarios.push(nuevoUsuario)

console.log(arrayUsuarios)
    
}

let limpiarcampos = function () {

    Inputsregistro.forEach(function (input) {

       input.value = ""
        
    })
    
}

boton_agregar.onclick = function () {

    if (validar_vacios()== true) {
        alert("debe llenar todos los campos")
        return
    }

    crearUsuario()

    limpiarcampos()

    alert("registro exitoso")

    location.href="home.html";

}
