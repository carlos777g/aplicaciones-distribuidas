import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rutas de scraping
const urls = [
  {
    nombre: "usd",
    url: "https://www.wise.com/mx/currency-converter/usd-to-mxn-rate?amount=1"
  },
  {
    nombre: "gbp",
    url: "https://www.wise.com/mx/currency-converter/gbp-to-mxn-rate?amount=1"
  },
  {
    nombre: "aud",
    url: "https://www.wise.com/mx/currency-converter/aud-to-mxn-rate?amount=1"
  }
];

// MongoDB URI (usa tu contraseña y usuario reales)
const uri = "mongodb+srv://car:1jShLimcHnoEivV4@cluster0.0du5kp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectamos a Mongo una sola vez
let conectado = false;
async function conectarMongo() {
  if (!conectado) {
    try {
      await client.connect();
      conectado = true;
      console.log("Conectado a MongoDB");
    } catch (error) {
      console.error("Error conectando a MongoDB:", error.message);
    }
  }
}

// Scraping + Insertar en Mongo
async function scrapearYGuardar() {
  await conectarMongo();

  for (const { nombre, url } of urls) {
    try {
      const respuesta = await axios.get(url);
      const html = respuesta.data;
      const pos = html.indexOf("Mex$ MXN");

      // Extraer y limpiar el valor
      const valorRaw = html.substring(pos - 13, pos - 8);
      const valorLimpio = parseFloat(valorRaw.replace(/[^0-9.]/g, ""));

      if (!isNaN(valorLimpio)) {
        const doc = {
          valor: valorLimpio,
          fecha: new Date()
        };
        await client.db("monedasDB").collection(nombre).insertOne(doc);
        console.log(`Insertado ${nombre.toUpperCase()}: ${valorLimpio}`);
      } else {
        console.error(`No se pudo extraer número válido para ${nombre}`);
      }
    } catch (error) {
      console.error(`Error con ${nombre.toUpperCase()}:`, error.message);
    }
  }
}

// Endpoint para revisar estado
app.get("/precios", async (req, res) => {
  await conectarMongo();

  try {
    const resultados = {};
    for (const { nombre } of urls) {
      const ult = await client.db("monedasDB").collection(nombre)
        .find().sort({ fecha: -1 }).limit(1).toArray();

      resultados[nombre] = ult[0] || { valor: "N/A", fecha: "No registrado" };
    }
    res.json({ resultado: resultados });
  } catch (error) {
    res.status(500).json({ error: "Error al recuperar datos." });
  }
});

// Graficar los datos guardados al momento
app.get("/grafica/:moneda", async (req, res) => {
  const { moneda } = req.params;
  if (!["usd", "gbp", "aud"].includes(moneda)) {
    return res.status(400).send("Moneda no válida");
  }

  await conectarMongo();
  const datos = await client.db("monedasDB").collection(moneda)
    .find().sort({ fecha: 1 }).toArray();

  const labels = datos.map(d => new Date(d.fecha).toLocaleTimeString());
  const valores = datos.map(d => d.valor);

  res.render("index", {
    moneda: moneda.toUpperCase(),
    labels: JSON.stringify(labels),
    valores: JSON.stringify(valores)
  });
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor activo en http://localhost:${port}`);
});

// Para ejecutar cads 50 segundos
setInterval(scrapearYGuardar, 50000);
