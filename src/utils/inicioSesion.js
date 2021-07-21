var usuario = document.getElementById("usuario")
var password = document.getElementById("password")
var btnSesion = document.getElementById("boton_iniciar_sesion")

var usuarios = ["hernan","mauricio","juan"];
var contraseñas = ["1234","5678","0123"];

function validacion_campos_vacios(us,pw)
{
  if(us == "")
  {
      return  false;
  }
  else if ( pw == "")
  {
      return  false;
  }else{
      return true
  }
}

let validacion_login = (us, pw) =>
{
    if(usuarios.indexOf(us) == -1 || contraseñas.indexOf(pw) == -1)
    {
        return false
    }
    
}

btnSesion.onclick = function () {

    let newUsuario = usuario.value
    let newContraseña = password.value


    if(validacion_campos_vacios(newUsuario,newContraseña)== false){
        alert("debe llenar todos los campos")
        return
    }

    if (validacion_login(newUsuario,newContraseña)==false) {
        alert("Usuario o contraseña invalido")
        return
    }

    usuarios.push(newUsuario)
    contraseñas.push(newContraseña)

    console.log(usuarios);
    console.log(contraseñas);
    
    location.href="home.html";
}