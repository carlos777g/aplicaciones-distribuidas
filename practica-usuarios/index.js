const express = require('express');
const app = express();
app.use(express.json()); // para leer JSON
app.use(express.urlencoded({ extended: true })); // para leer x-www-form-urlencoded

// Variables de estado
let numUsuarios = 0;
let usuarios = [];
const MAX_USUARIOS = 13;

// Función para generar un número primo aleatorio (simple, entre 100 y 999)
function generarNumeroPrimo() {
    function esPrimo(n) {
        if (n <= 1) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }

    let primo;
    do {
        primo = Math.floor(Math.random() * 900) + 100; // 100–999
    } while (!esPrimo(primo));

    return primo;
}

// RUTA: /login (POST)
app.post('/login', (req, res) => {
    const nombre = req.body.nombre;

    if (!nombre) return res.status(400).json({ error: 'Falta el nombre del usuario.' });
    if (numUsuarios >= MAX_USUARIOS) return res.status(403).json({ error: 'Límite de usuarios alcanzado.' });

    // Buscar si ya existe
    const yaExiste = usuarios.find(u => u.nombre === nombre);
    if (yaExiste) return res.status(409).json({ error: 'Usuario ya existe.' });

    const password = generarNumeroPrimo();
    usuarios.push({ nombre, password });
    numUsuarios++;

    res.json({ mensaje: 'Usuario creado', usuario: { nombre, password }, numUsuarios });
});

// RUTA: /logout (POST)
app.post('/logout', (req, res) => {
    const nombre = req.body.nombre;

    const index = usuarios.findIndex(u => u.nombre === nombre);
    if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado.' });

    usuarios.splice(index, 1);
    numUsuarios--;

    res.json({ mensaje: 'Usuario eliminado', numUsuarios });
});

// RUTA: /reset (POST)
app.post('/reset', (req, res) => {
    const { usuario, password } = req.body;

    if (usuario === 'root' && password === '132177') {
        usuarios = [];
        numUsuarios = 0;
        return res.json({ mensaje: 'Sistema reseteado.', numUsuarios });
    }

    res.status(401).json({ error: 'Credenciales incorrectas.' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
