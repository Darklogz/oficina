const express = require('express')
const app = express()
const dotenv = require('dotenv')
const path = require('path')

//Extrae los datos necesarios de el archivo .env
dotenv.config()

const port = process.env.PORT

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
app.get('/login',(req,res)=>{
    const idEmpleado = req.body 
})



//Funciona como HANDLER para cuando no se encuentra cierta direccion
app.use((req, res) => {
    res.type('text/plain')
	res.status(404);
	res.send('Error 404'+
        '\nUps parce que la pagina que buscas no existe intenta con otra');
});

app.listen(port, () => {
    console.log(`Escuchando el puerto ${port} 
    Entra a la pagina principal desde aqui http://localhost:3000`)
})