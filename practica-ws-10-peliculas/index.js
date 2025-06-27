import express from "express";
//const { MongoClient, ServerApiVersion } = require('mongodb');
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://car:1jShLimcHnoEivV4@cluster0.0du5kp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
  
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
  };




async function main() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
   // await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");

    //await listDatabases(client);

    const result = await makeArray(client);
    return result;
  } catch(e) {
    console.error(`Hubo un error: ${e}`);
  }
    finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

const app = express();
const port = 3000;

// 1.- 10 pelis
async function makeArray(client) {
    const cursor = await client.db("sample_mflix").collection("movies").find().limit(10);
    const result = await cursor.toArray();
  
    result.forEach(movie => {
      console.log('ID:', movie._id.toString());
      console.log('Title:', movie.title);
      console.log('Plot:', movie.plot);
      console.log('--------------------------------');
    });
    return result;
  }

app.get("/practica1", async (req, res) => {
    try {
      // Conectar al cliente y obtener las películas
      await client.connect();
      const cursor = await client.db("sample_mflix").collection("movies").find().limit(10);
      const movies = await cursor.toArray();
  
      // Enviar las películas como respuesta JSON
      res.json(movies);
    } catch (e) {
      console.error(`Hubo un error: ${e}`);
      res.status(500).send("Error al recuperar las películas.");
    } finally {
      // Cerrar la conexión al cliente
      await client.close();
    }
  });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});





//main().catch(console.dir);
