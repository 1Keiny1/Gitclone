const express = require("express")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
var app=express()
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Kike1212_',
    database:'5IV8'
})
con.connect();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.static('public'))

app.post('/agregarUsuario', (req, res) => {
    let id = req.body.id;
    let nombre = req.body.nombre;

    // Validamos que ambos campos lleguen
    if (!id || !nombre) {
        return res.status(400).send("Faltan datos: se requiere ID y nombre.");
    }

    // Ejecutamos la consulta con ID y nombre
    con.query('INSERT INTO usuario (id_usuario, nombre) VALUES (?, ?)', [id, nombre], (err, respuesta, fields) => {
        if (err) {
            console.log("Error al insertar:", err);
            return res.status(500).send("Error al insertar usuario (El ID ya existe)");
        }

        return res.send(`<h1>Usuario agregado:</h1><p>ID: ${id}</p><p>Nombre: ${nombre}</p>`);
    });
});

app.listen(10000,()=>{
    console.log('Servidor escuchando en el puerto 10000')
})

//fun consultar


app.get('/obtenerUsuario',(req,res)=>{
    con.query('select * from usuario', (err,respuesta, fields)=>{
        if(err)return console.log('ERROR: ', err);
        var userHTML=``;
        var i=0;

        respuesta.forEach(user => {
            i++;
            userHTML+= `<tr><td>${i}</td><td>${user.nombre}</td></tr>`;


        });

        return res.send(`<table>
                <tr>
                    <th>id</th>
                    <th>Nombre:</th>
                <tr>
                ${userHTML}
                </table>`
        );


    });
});

app.post('/actualizarUsuario', (req, res) => {
    // Obtener datos del body
    const id = req.body.id;
    const nuevoNombre = req.body.nombre;

    // Log para verificar que llega la petición
    console.log('Llegó petición a actualizarUsuario:', req.body);

    // Ejecutar consulta UPDATE dentro del callback de la ruta
    con.query('UPDATE usuario SET nombre = ? WHERE id_usuario = ?', [nuevoNombre, id], (err, resultado) => {
        if (err) {
            console.error('Error al actualizar:', err);
            return res.status(500).send("Error al actualizar");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} actualizado correctamente a nombre "${nuevoNombre}"`);
    });
});




app.post('/borrarUsuario', (req, res) => {
    const id = req.body.id; // El ID del usuario a eliminar viene en el cuerpo de la solicitud
    console.log("hola")
    con.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, resultado, fields) => {

        if (err) {
            console.error('Error al borrar el usuario:', err);
            return res.status(500).send("Error al borrar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} borrado correctamente`);
    });
});