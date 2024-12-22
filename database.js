const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialiser la base de données
const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données :', err);
    } else {
        console.log('Base de données SQLite ouverte avec succès.');
        db.run(`
            CREATE TABLE IF NOT EXISTS credentials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                password TEXT NOT NULL
            )
        `);
    }
});

module.exports = db;
