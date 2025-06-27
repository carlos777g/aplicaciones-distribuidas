import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();
const port = 3001;

const url = ["https://www.wise.com/mx/currency-converter/usd-to-mxn-rate?amount=1",
    "https://www.wise.com/mx/currency-converter/gbp-to-mxn-rate?amount=1",
    "https://www.wise.com/mx/currency-converter/aud-to-mxn-rate?amount=1"];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/precios", async function (request, response) {
    let status = 0;

    const resultados = await Promise.all(url.map(async (link) => {
        try {
            const respuesta = await axios.get(link);
            const html = respuesta.data;
            let pos = html.indexOf("Mex$ MXN");
            return html.substring(pos - 13, pos - 8);
        } catch (error) {
            status = 1;
            console.error('Error al descargar la página:', error.message);
            return '';
        }
    }));

    const monedas = ["usd", "gbp", "aud"];
    const res = resultados.map((valor, i) => ({
        moneda: monedas[i],
        precio: valor
    }));
    await main();
    response.json(res);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


async function findComments(client) {
  const cursor = await client.db("sample_mflix").collection("comments").find({ email: "mercedes_tyler@fakegmail.com" });
  const result = await cursor.toArray();

  result.forEach(comment => {
    console.log('ID:', comment._id.toString());
    console.log('Email:', comment.email);
    console.log('Comentario:', comment.text.slice(0, 50));
    console.log('--------------------------------');
  });
}

async function main() {
  const uri = "mongodb+srv://car:1jShLimcHnoEivV4@cluster0.0du5kp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    // Make the appropriate DB calls
    await findComments(client);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}