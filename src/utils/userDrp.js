var cerrar = document.querySelector(".cerrar")
var dd_main = document.querySelector(".dd_main");

dd_main.addEventListener("click", function() {
    this.classList.toggle("active");
})
cerrar.addEventListener("click", function() {
    this.classList.toggle("hidden")
})