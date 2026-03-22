const express = require('express')
const app = express()
const dotenv = require('dotenv')
const path = require('path')

//Extrae los datos necesarios de el archivo .env
dotenv.config()

const port = process.env.PORT

//Sirve los archivos de la carpeta Public para poder ser utilizaos en el servidor
app.use(express.static(__dirname +'/Public'))


//Al no especificar direccion alguna cae aqui
app.get('/',(req,res) =>{

    res.sendFile(path.join(__dirname, 'Public','Paginas','login.html'))

})


//Funciona como HANDLER para cuando no se encuentra cierta direccion
app.use((req, res,) => {
    res.type('text/plain')
	res.status(404);
	res.send('404 - not found');
});

app.listen(port, () => {
    console.log(`Escuchando el puerto ${port} 
    Entra a la pagina principal desde aqui http://localhost:3000`)
})