const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados SQLite');
        createTables();
    }
});

// Create tables
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            isAdmin INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clientName TEXT NOT NULL,
            clientEmail TEXT NOT NULL,
            serviceType TEXT NOT NULL,
            serviceDate TEXT NOT NULL,
            nextMaintenance TEXT NOT NULL,
            notes TEXT,
            createdBy TEXT NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

// API Routes

// Users
app.post('/api/users/register', (req, res) => {
    const { username, password, isAdmin } = req.body;
    db.run(
        'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)',
        [username, password, isAdmin ? 1 : 0],
        function(err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    db.get(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, row) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            if (row) {
                res.json(row);
            } else {
                res.status(401).json({ error: 'Usuário ou senha inválidos' });
            }
        }
    );
});

// Services
app.post('/api/services', (req, res) => {
    const { clientName, clientEmail, serviceType, serviceDate, nextMaintenance, notes, createdBy } = req.body;
    db.run(
        `INSERT INTO services 
        (clientName, clientEmail, serviceType, serviceDate, nextMaintenance, notes, createdBy) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [clientName, clientEmail, serviceType, serviceDate, nextMaintenance, notes, createdBy],
        function(err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

app.get('/api/services', (req, res) => {
    db.all('SELECT * FROM services ORDER BY serviceDate DESC', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.delete('/api/services/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM services WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 