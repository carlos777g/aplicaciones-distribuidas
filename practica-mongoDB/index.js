// Guillén González Carlos Jael
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


// 1.- comentarios por el correo "mercedes_tyler@fakegmail.com":
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

// 2.- Peliculas año 2000:
async function findMovies2000(client) {
  const cursor = await client.db("sample_mflix").collection("movies").find({ year: 2000 });
  const result = await cursor.toArray();

  result.forEach(movie => {
    console.log('ID:', movie._id.toString());
    console.log('Titulo:', movie.title);
    console.log('PLot:', movie.plot);
    console.log('Año:', movie.year);
    console.log('-------------------------------');
  });
}

// 3.- Recuperar el título y el póster de las películas del año 2001.
async function findMovies2001(client) {
  const cursor = await client.db("sample_mflix").collection("movies").find({ year: 2001 });
  const result = await cursor.toArray();

  result.forEach(movie => {
    console.log('Titulo:', movie.title);
    console.log('Año:', movie.year);
    console.log('Poster:', movie.poster);
    console.log('-------------------------------');
  });
}


async function runQueries(client) {
  const collection = client.db("sample_mflix").collection("movies");

  // 1. Películas dirigidas por "Donald MacKenzie"
  let result = await collection.find({ "embedded_movies.directors": "Donald MacKenzie" }).toArray();
  console.log("1. Donald MacKenzie:", result.length);

  // 2. Dirigidas por "Donald MacKenzie" y año 2005
  result = await collection.find({
    $and: [
      { "embedded_movies.directors": "Donald MacKenzie" },
      { year: 2005 }
    ]
  }).toArray();
  console.log("2. Donald MacKenzie AND año 2005:", result.length);

  // 3. Dirigidas por "Donald MacKenzie" o "James Cameron"
  result = await collection.find({
    $or: [
      { "embedded_movies.directors": "Donald MacKenzie" },
      { "embedded_movies.directors": "James Cameron" }
    ]
  }).toArray();
  console.log("3. Donald MacKenzie OR James Cameron:", result.length);

  // 4. NO dirigidas por "Donald MacKenzie"
  result = await collection.find({
    "embedded_movies.directors": { $not: { $eq: "Donald MacKenzie" } }
  }).toArray();
  console.log("4. NOT Donald MacKenzie:", result.length);

  // 5. Películas del año 2000 o 2010
  result = await collection.find({
    $or: [
      { year: 2000 },
      { year: 2010 }
    ]
  }).toArray();
  console.log("5. Año 2000 OR 2010:", result.length);

  // 6. Películas que NO sean del 2005
  result = await collection.find({
    year: { $not: { $eq: 2005 } }
  }).toArray();
  console.log("6. NOT año 2005:", result.length);

  // 7. Año 2000 y clasificación PG
  result = await collection.find({
    $and: [
      { year: 2000 },
      { genres: "Action" }
    ]
  }).toArray();
  console.log("7. Año 2000 AND genero de acción", result.length);

  // 8. Duración > 120 min y director Donald MacKenzie
  result = await collection.find({
    $and: [
      { runtime: { $gt: 120 } },
      { "embedded_movies.directors": "Donald MacKenzie" }
    ]
  }).toArray();
  console.log("8. Duración > 120 AND Donald MacKenzie:", result.length);

  // 9. Donald MacKenzie OR duración < 90 min
  result = await collection.find({
    $or: [
      { "embedded_movies.directors": "Donald MacKenzie" },
      { runtime: { $lt: 90 } }
    ]
  }).toArray();
  console.log("9. Donald MacKenzie OR duración < 90:", result.length);

  // 10. Donald MacKenzie pero NO en 2005
  result = await collection.find({
    $and: [
      { "embedded_movies.directors": "Donald MacKenzie" },
      { year: { $not: { $eq: 2005 } } }
    ]
  }).toArray();
  console.log("10. Donald MacKenzie AND NOT 2005:", result.length);
}



async function main() {
  const uri = "mongodb+srv://car:1jShLimcHnoEivV4@cluster0.0du5kp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";



  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await (client);
    // 1.- comentarios por el correo "mercedes_tyler@fakegmail.com":
    await findComments(client);
    // 2.- Peliculas año 2000:
    await findMovies2000(client);
    // 3.- Recuperar el título y el póster de las películas del año 2001.
    await findMovies2001(client);
    // 4.- 10 consultas combiandas o con valores de campos compuestos
    await runQueries(client);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);