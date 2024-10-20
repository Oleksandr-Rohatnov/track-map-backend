const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config');
require('dotenv').config();

let objects = [];

const generateObjects = () => {
    objects = Array.from({ length: 100 }, (_, i) => ({
        id: `object_${i + 1}`,
        coordinates: [
            44.38 + Math.random() * (52.38 - 44.38), // Широта
            22.14 + Math.random() * (40.23 - 22.14)  // Довгота
        ],
        direction: ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)],
        lastUpdate: Date.now(),
        lost: false,
    }));
};

generateObjects();

const corsOptions = {
    credentials: true,
    origin: "*"
};

app.use(cors(corsOptions));

app.post('/api/auth', (req, res) => {
    const authKey = req.headers['authorization'];

    if (authKey === process.env.AUTH_KEY) {
        res.status(200).json({ message: 'Authorization successful' });
    } else {
        res.status(403).json({ message: 'Invalid key' });
    }
});

app.get('/api/objects', (req, res) => {
    const authKey = req.headers['authorization'];

    if (authKey !== process.env.AUTH_KEY) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(objects);
});

// Запуск сервера
app.listen(config.port, () => {
    console.log(`Mock server is running`);
});