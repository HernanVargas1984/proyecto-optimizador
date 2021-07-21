const app = require("./src/config/server");
const connection = require("./config/db");

require("./app/routes/login_register")(app);

app.listen(app.get("port"), () => {
  console.log("Servidor en el puerto: ", app.get("port"));
});