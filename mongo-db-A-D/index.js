/*const { MongoClient, ServerApiVersion } = require('mongodb');
//import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://car:1jShLimcHnoEivV4@cluster0.0du5kp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function findMovies(client){
  const cursor= await client.db("sample_mflix").collection("movies").find({}).limit(2);
  const result=await cursor.toArray();
  console.log('Title: ', result[0]['title']);
  console.log("movies");
  console.log(JSON.stringify(result, null,2));
}

async function findComments(client) {
  const cursor = await client.db("sample_mflix").collection("comments").find({}).limit(10);
  const result = await cursor.toArray();
  console.log('Text: ', result[0]['text']);
  console.log("comments");
  console.log(JSON.stringify(result, null,2));
}

async function main() {
const uri = "mongodb+srv://car:1jShLimcHnoEivV4@cluster0.0du5kp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await listDatabases(client);
    await findMovies(client);
    await findComments(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);