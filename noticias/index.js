import express from "express";
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

  // Resumen (clase "lead")
  const resumenMarker = '<div class="lead">';
  const resumenStart = html.indexOf(resumenMarker);
  let resumen = "";
  if (resumenStart !== -1) {
    const pOpen = html.indexOf(">", resumenStart) + 1;
    const pClose = html.indexOf("</div>", pOpen);
    resumen = html.slice(pOpen, pClose).trim();
  }

  // Imagen (dentro de <meta property="og:image"...>)
  const ogImageMarker = '<meta property="og:image" content="';
  const ogImgStart = html.indexOf(ogImageMarker);
  let imagen = "";
  if (ogImgStart !== -1) {
    const imgUrlStart = ogImgStart + ogImageMarker.length;
    const imgUrlEnd = html.indexOf('"', imgUrlStart);
    imagen = html.slice(imgUrlStart, imgUrlEnd);
  }

  // Cuerpo (puede tener varios párrafos)
  const cuerpo = [];
  let cuerpoPos = html.indexOf('<div class="field--name-body"');
  if (cuerpoPos !== -1) {
    const bodyEnd = html.indexOf("</div>", cuerpoPos);
    const bodyHtml = html.slice(cuerpoPos, bodyEnd);
    let pIndex = 0;
    while (true) {
      const pStart = bodyHtml.indexOf("<p>", pIndex);
      const pEnd = bodyHtml.indexOf("</p>", pStart);
      if (pStart === -1 || pEnd === -1) break;
      const texto = bodyHtml.slice(pStart + 3, pEnd).trim();
      if (texto) cuerpo.push(texto);
      pIndex = pEnd + 4;
    }
  }

  return {
    titulo,
    resumen,
    imagen,
    cuerpo
  };
}

app.listen(port, () => {
  console.log(`📰 Servidor activo en http://localhost:${port}`);
});
