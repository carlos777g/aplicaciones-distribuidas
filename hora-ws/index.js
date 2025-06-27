/* 
Construya un WS restful que realice:
1. Implementación GET
2. No recibe parametros
3. Debe recuperar la hora actual
4. Convertir la hora actual a texto nominal hasta los segundos
5. Regresar un JSON
*/

const express = require('express');
const app = express();
const port = 3000;

function horaANominal(date){
    const horas = ["cero", "una", "dos", "tres", "cuatro", "cinco", 
        "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece",
        "catorce", "quince", "dieciséis", "diecisiete", "diesiocho", "diecinueve",
        "veinte", "veintiuno", "veintidos", "veintitrés"];

    const minutosSegundos = ["cero", "una", "dos", "tres", "cuatro", "cinco", 
        "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece",
        "catorce", "quince", "dieciséis", "diecisiete", "diesiocho", "diecinueve",
        "veinte", "veintiuno", "veintidos", "veintitrés", "veinticuatro", "veinticinco",
        "veintiséis", "veintisiete", "veintiocho", "veintinueve","treinta", "treinta y uno",
        "treinta y dos", "treinta y tres", "treinta y cuatro", "treinta y cinco",
        "treinta y seis", "treinta y siete", "treinta y ocho", "treinta y nueve",
        "cuarenta", "cuarenta y uno", "cuarenta y dos", "cuarenta y tres", "cuarenta y cuatro",
        "cuarenta y cinco", "cuarenta y seis", "cuarenta y siete", "cuarenta y ocho",
        "cuarenta y nueve", "cincuenta", "cincuenta y uno", "cincuenta y dos", "cincuenta y tres",
        "cincuenta y cuatro", "cincuenta y cinco, ", "cincuenta y seis", "cincuenta y siete",
        "cincuenta y ocho", "cincuenta y nueve"];  

        const hora = horas[date.getHours()];
        const minuto = minutosSegundos[date.getMinutes()];
        const segundo = minutosSegundos[date.getSeconds()];

        return `Son las ${hora} horas, con ${minuto} minutos y ${segundo} segundos`;
}

app.get('/hora', (req, res) => {
    const ahora = new Date();
    const horaNominal = horaANominal(ahora);
    res.json({
        hora_nominal: horaNominal
    })
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})