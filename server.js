const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const mysql = require('mysql2/promise')
const session = require('express-session')

//Extrae los datos necesarios de el archivo .env
dotenv.config()

//crea el sevidor
const app = express()


const port = process.env.PORT 

//conexion con la base de datos

async function crearConexion(mysql) {
    let conexion = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    })
    return conexion
}


//Deshabilitamos la transmicion informacion confidencial de el servidor para mas seguridad
app.disable('x-powered-by')
//Para poder manejar formularios html
app.use(express.urlencoded({ extended: true }))

//Manejar la sesion de los usuarios
app.use(session({
    secret: 'mongollongos',
    resave: false,
    saveUninitialized: false
}))
//Sirve los archivos de la carpeta Public para poder ser utilizaos en el servidor
app.use(express.static(__dirname +'/Public'))





//Al no especificar direccion alguna cae aqui
app.get('/',(req,res) =>{
    //tipo de contenido que se envia
    res.contentType('text/html')
    res.sendFile(path.join(__dirname, 'Public','Paginas','login.html'))
})

app.get('/PaginaAdmin',async (req,res) =>{

    //tipo de contenido que se envia
    res.contentType('text/html')
    res.sendFile(path.join(__dirname, 'Public','Paginas','main.html'))
})

//logica para el inicio de sesion
app.post('/login',async (req,res)=>{
    let consultas = await crearConexion(mysql);
    
    //trae los datos de el form
    const { username, password } = req.body
    //extrae solo el arreglo sin metadatos y realiza la consulta
    const [[usuario]] = await consultas.query(
        'SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?',
        [username, password]
    )

    if (!usuario) return res.redirect('/?error=credenciales')
    if (!usuario.admin) return res.redirect('/noadmin')

    req.session.usuario = usuario.usuario
    res.status(303)
    res.redirect('/PaginaAdmin')

})

app.get('/noadmin',(req,res)=>{
    
    res.send('<h1>No tiene acceso a esta pagina , Consulte con su jefe de area</h1>')

})


app.get('/PaginaAdmin/TablaEquipos',async (req,res)=>{
    
    let conexion = await crearConexion(mysql)
    let [tabla] = await conexion.query('SELECT equipos.id_equipos,equipos.nombre_equipo,equipos.marca,equipos.modelo_equipo,equipos.fecha_adquisicion,estado_equipos.nombre AS estado FROM equipos JOIN estado_equipos ON equipos.estado_id = estado_equipos.id_estado;')
    res.json(tabla);
    
    
        res.status(500)
        res.send('Ups... algo fallo en la obtencion de los equipos')
   

})


//envia los datos de la sesion
app.get('/sesion', (req, res) => {
    res.json({ usuario: req.session.usuario })
})

app.get('/logout',(req,res)=>{
    req.session.destroy()
    res.status(303)
    res.redirect('/')
})


//Funciona como HANDLER para cuando no se encuentra cierta direccion
app.use((req, res) => {
    res.type('text/plain')
	res.status(404);
	res.send('Error 404'+
        '\nUps parce que la pagina que buscas no existe intenta con otra');
});


//activa el servidor
app.listen(port, () => {
    console.log(`Escuchando el puerto ${port} 
    Entra a la pagina principal desde aqui http://localhost:3000`)
})

module.exports = {

    crearConexion: crearConexion

}