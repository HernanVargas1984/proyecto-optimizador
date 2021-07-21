const connection = require("../../config/db.js");
const bcryptjs = require("bcryptjs");

module.exports = (app) => {
  // app.get("/", (req, res) => {
  //   res.render("../views/.ejs");
  // });

  app.get("/inicioSesion", (req, res) => {
    res.render("../views/inicioSesion.ejs");
  });

  app.get("/registro", (req, res) => {
    res.render("../views/registro.ejs");
  });

  app.get("/longitud", (req, res) => {
    if(req.session.loggedin) {
      res.render("../views/longitud.ejs", {
        login:true,
        name: req.session.nombre
      });
    }else {
      res.render("../views/inicioSesion.ejs", {
        login: false,
        name: "Por favor inicie sesion"
      });
    }
  });

  app.get("/add", (req, res) => {
    res.render("../views/longitud.ejs");
  });

  app.get("/add", (req, res) => {
    res.render("./login_register/add");
  });

  app.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    })
  })

  app.post("/registro", async (req, res) => {
    const { cedula, nombre, email, contrasena, perfil } = req.body;
    console.log(req.body);
    let passwordHash = await bcryptjs.hash(contrasena, 8);
    connection.query('INSERT INTO usuarios SET ?',
      {
        cedula: cedula,
        nombre: nombre,
        email: email,
        contrasena: passwordHash,
        perfil: perfil
      },
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.render("../views/registro.ejs", {
            alert: true,
            alertTitle: "Registration",
            alertMessage: "Successful Registration",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 15000,
            ruta: "/login",
          });
        }
      }
    );
  });

  app.post("/auth", async(req, res) => {
    const { cedula, contrasena } = req.body;
    if(cedula && contrasena) {
      connection.query('SELECT * FROM usuarios WHERE Cedula = ?', [cedula], async(err, results) => {
        if(results.length === 0 || !(await bcryptjs.compare(contrasena, results[0].contrasena))){
          res.render("../views/registro.ejs", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o contraseña incorrecta",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "login"

          });
        }else {
          req.session.loggedin = true;
          req.session.nombre = results[0].nombre;
          res.render("../views/login.ejs", {
            alert: true,
            alertTitle: ":)",
            alertMessage: "¡Login correcto!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "/longitud"

          })
        } 
      })
    }
  })

  app.post("/add", async(req, res) => {
    const {descripcion_material, longitud_material, unidades_medida, despunteIzq, despunteDer, grosorHta, referencia, longitud, cantidad } = req.body;
    console.log(req.body); 
      
        connection.query('INSERT INTO especificaciones set ?', 
      {
        descripcion_material: descripcion_material,
        longitud_material: longitud_material,
        unidades_medida: unidades_medida,
        despunteIzq: despunteIzq,
        despunteDer: despunteDer, 
        grosorHta: grosorHta,
        referencia: referencia,
        longitud: longitud,
        cantidad: cantidad
      },
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.render("../views/longitud.ejs", {
            alert: true,
            alertTitle: "Registration",
            alertMessage: "Successful Registration",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 15000,
            ruta: "/longitud",
          });
        }
      });
  });
 
};

