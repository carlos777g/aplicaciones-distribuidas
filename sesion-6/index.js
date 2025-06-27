var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const axios = require('axios');
const url="https://wise.com/mx/currency-converter/gbp-to-mxn-rate?amount=1";

app.get("/", async function (request, response) {

    r ={
      'message':'Server is alive...'
    };

    response.json(r);
});

app.get("/libra/precio", async function (request, response) {

    status = 0;
    let resultado = '';
    try {
        const respuesta = await axios.get(url);
        
        const html = respuesta.data; // Aquí tienes el HTML como string
        console.log(html);
        let pos = html.indexOf("Mex$ MXN");

        console.log("Pos: ",pos);

        resultado=html.substring(pos-13, pos-8);
        
        console.log("Subs: ",resultado);

    } catch (error) {
        resultado = '';
        status = 1;
        console.error('Error al descargar la página:', error.message);
    }

    r ={
        'status':status,
        'libra':resultado
    };

    response.json(r);
});

app.listen(4500, function() {
    console.log('MiniServer is listening in port 4500!');
});
