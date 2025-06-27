const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json()); // JSON body parser

// Utilidad para SHA256
function sha256(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

// Ruta: /mascaracteres
app.post('/mascaracteres', (req, res) => {
    const { str1, str2 } = req.body;

    if (!str1 || !str2) {
        return res.json({ error: 'Se requieren los parámetros str1 y str2' });
    }

    const resultado = str1.length >= str2.length ? str1 : str2;
    res.json({ resultado });
});

// Ruta: /menoscaracteres
app.post('/menoscaracteres', (req, res) => {
    const { str1, str2 } = req.body;

    if (!str1 || !str2) {
        return res.json({ error: 'Se requieren los parámetros str1 y str2' });
    }

    const resultado = str1.length <= str2.length ? str1 : str2;
    res.json({ resultado });
});

// Ruta: /numcaracteres
app.post('/numcaracteres', (req, res) => {
    const { str } = req.body;

    if (!str) {
        return res.json({ error: 'Se requiere el parámetro str' });
    }

    const resultado = str.length;
    res.json({ resultado });
});

// Ruta: /palindroma
app.post('/palindroma', (req, res) => {
    const { str } = req.body;

    if (!str) {
        return res.json({ error: 'Se requiere el parámetro str' });
    }

    const normalizada = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const esPalindroma = normalizada === normalizada.split('').reverse().join('');

    res.json({ resultado: esPalindroma });
});

// Ruta: /concat
app.post('/concat', (req, res) => {
    const { str1, str2 } = req.body;

    if (!str1 || !str2) {
        return res.json({ error: 'Se requieren los parámetros str1 y str2' });
    }

    const resultado = str1 + str2;
    res.json({ resultado });
});

// Ruta: /applysha256
app.post('/applysha256', (req, res) => {
    const { str } = req.body;

    if (!str) {
        return res.json({ error: 'Se requiere el parámetro str' });
    }

    const hash = sha256(str);
    res.json({ resultado: { original: str, hash } });
});

// Ruta: /verifysha256
app.post('/verifysha256', (req, res) => {
    const { original, hash } = req.body;

    if (!original || !hash) {
        return res.json({ error: 'Se requieren los parámetros original y hash' });
    }

    const generado = sha256(original);
    const resultado = generado === hash;

    res.json({ resultado });
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
