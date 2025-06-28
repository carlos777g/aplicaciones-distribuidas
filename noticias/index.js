import express, { text } from "express";
import axios from "axios";

const app = express();
const port = 3002;

app.get("/noticia-principal", async (req, res) => {
  try {
    // Paso 1: Obtener el link de la noticia principal
    const link = await obtenerLinkNoticiaPrincipal();

    if (!link) {
      return res.status(404).json({ error: "No se encontró el link de la noticia principal" });
    }

    // Paso 2: Obtener el contenido de la noticia
    const datos = await obtenerContenidoNoticia(link);

    res.json(datos);

  } catch (error) {
    console.error("❌ Error general:", error.message);
    res.status(500).json({ error: "Error interno" });
  }
});

// 🧩 Función para obtener el link de la noticia principal
async function obtenerLinkNoticiaPrincipal() {
  const url = "https://www.eluniversal.com.mx/";
  const respuesta = await axios.get(url);
  const html = respuesta.data;

  const aTagMarker = '<a class="event-cards cards-story-opener-fr';
  const aTagPos = html.indexOf(aTagMarker);

  if (aTagPos === -1) return null;

  const htmlRecorte = html.slice(aTagPos, aTagPos + 3000);

  const hrefStart = htmlRecorte.indexOf('href="') + 6;
  const hrefEnd = htmlRecorte.indexOf('"', hrefStart);
  const hrefRelativo = htmlRecorte.slice(hrefStart, hrefEnd);

  return "https://www.eluniversal.com.mx" + hrefRelativo;
}

// 🧩 Función para obtener el contenido completo de la noticia
async function obtenerContenidoNoticia(link) {
  const respuesta = await axios.get(link);
  const html = respuesta.data;

  // Título
  const h1Start = html.indexOf("<h1");
  const h1Open = html.indexOf(">", h1Start) + 1;
  const h1Close = html.indexOf("</h1>", h1Open);
  const titulo = html.slice(h1Open, h1Close).trim();

  // Imagen (dentro de <meta property="og:image"...>)
  const ogImageMarker = '<meta property="og:image" content="';
  const ogImgStart = html.indexOf(ogImageMarker);
  let imagen = "";
  if (ogImgStart !== -1) {
    const imgUrlStart = ogImgStart + ogImageMarker.length;
    const imgUrlEnd = html.indexOf('"', imgUrlStart);
    imagen = html.slice(imgUrlStart, imgUrlEnd);
  }
  // Cuerpo 
  const parrafos = extraerCuerpoDesdeDiv(html);
  // respuesta
  const resumen = extraerResumen(html);
  return {
    titulo,
    resumen,
    imagen,
    parrafos
  };
}


function extraerResumen(html) {
  const marker = '<h2 class="subTitle text-2xl mb-5">';
  const start = html.indexOf(marker);
  if (start === -1) return "";

  const open = html.indexOf(">", start) + 1;
  const close = html.indexOf("</h2>", open);
  if (close === -1) return "";

  return html.slice(open, close).trim();
}

function extraerCuerpoDesdeDiv(html) {
  const cuerpo = [];

  // 1. Buscar el <div class="sc pl-3">
  const divStart = html.indexOf('<div class="sc pl-3">');
  if (divStart === -1) return cuerpo;
  console.log(divStart);
  
  const divEnd = html.indexOf('</div>', divStart);
  if (divEnd === -1) return cuerpo;
  console.log(divEnd);
  
  const divContenido = html.slice(divStart, divEnd);
  
  
  // Una expresión regex para filtrar el cuerpo de la noticia
  const regex = /<p[^>]*itemprop=["']description["'][^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = regex.exec(divContenido)) !== null) {
    let texto = match[1].trim();
    
    // Limpiar etiquetas internas (como <a>, <b>, etc.)
    texto = texto.replace(/<[^>]+>/g, "").trim();
    console.log(texto);

    if (texto) cuerpo.push(texto);
  }

  return cuerpo;
}



app.listen(port, () => {
  console.log(`📰 Servidor activo en http://localhost:${port}`);
});
