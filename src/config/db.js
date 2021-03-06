const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.log("El error de conexion a BD es: " + err);
    return;
  }
  console.log("Conectado exitosamente a la BD");
});

module.exports = connection;