const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const mysql = require('mysql2/promise')

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

//variable para los queries


//Deshabilitamos la transmicion informacion confidencial de el servidor para mas seguridad
app.disable('x-powered-by')
//Para poder manejar formularios html
app.use(express.urlencoded({ extended: true }))
//Sirve los archivos de la carpeta Public para poder ser utilizaos en el servidor
app.use(express.static(__dirname +'/Public'))


//Al no especificar direccion alguna cae aqui
app.get('/',(req,res) =>{
    //tipo de contenido que se envia
    res.contentType('text/html')
    res.sendFile(path.join(__dirname, 'Public','Paginas','login.html'))
})

app.get('/PaginaAdmin',(req,res) =>{
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
    if (!usuario.admin) return res.redirect('/nouser')
    res.redirect('/PaginaAdmin')

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