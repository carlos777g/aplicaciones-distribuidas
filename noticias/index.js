import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const port = 3002;

app.get("/noticia-principal", async (req, res) => {
  try {
    const url = "https://www.eluniversal.com.mx/";
    const respuesta = await axios.get(url);
    const html = respuesta.data;

    // 🔍 Buscar la imagen
    const imgMarker = '<picture class="cards-story-opener-fr__pic';
    const imgPos = html.indexOf(imgMarker);

    if (imgPos === -1) {
      return res.status(404).json({ error: "No se encontró la noticia principal" });
    }

    const htmlRecorte = html.slice(imgPos, imgPos + 2000); // recortamos 2000 caracteres aprox.

    // 🖼️ Extraer imagen (buscar atributo src)
    const srcStart = htmlRecorte.indexOf('src="') + 5;
    const srcEnd = htmlRecorte.indexOf('"', srcStart);
    const imagen = htmlRecorte.slice(srcStart, srcEnd);

    // 📰 Extraer título
    const titleStart = htmlRecorte.indexOf('<h2') + 1;
    const h2Start = htmlRecorte.indexOf('>', titleStart) + 1;
    const h2End = htmlRecorte.indexOf('</h2>', h2Start);
    const titulo = htmlRecorte.slice(h2Start, h2End).trim();

    res.json({
      titulo,
      imagen
    });

  } catch (error) {
    console.error("❌ Error al hacer scraping:", error.message);
    res.status(500).json({ error: "Error interno" });
  }
});

app.listen(port, () => {
  console.log(`📰 Servidor activo en http://localhost:${port}`);
});
