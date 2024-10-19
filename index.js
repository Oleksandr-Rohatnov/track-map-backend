const express = require('express');
const app = express();
const config = require('./config');
console.log(config.port)
require('dotenv').config();

let objects = [];

const generateObjects = () => {
    objects = Array.from({ length: 100 }, (_, i) => ({
        id: `object_${i + 1}`,
        coordinates: {
            lat: 44.38 + Math.random() * (52.38 - 44.38), // Від 44.38 до 52.38
            lng: 22.14 + Math.random() * (40.23 - 22.14), // Від 22.14 до 40.23
        },
        direction: ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)],
        lastUpdate: Date.now(),
        lost: false,
    }));
};

generateObjects();

app.post('/api/auth', (req, res) => {
    const { authKey } = req.headers; // Очікуємо ключ у заголовку запиту

    if (authKey === process.env.AUTH_KEY) {
        res.status(200).json({ message: 'Authorization successful' });
    } else {
        res.status(403).json({ message: 'Authorization failed' });
    }
});

app.get('/api/objects', (req, res) => {
    const { authKey } = req.headers;

    if (authKey !== process.env.AUTH_KEY) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    objects = objects.filter(obj => Date.now() - obj.lastUpdate < 5 * 60 * 1000);

    // res.json(objects);
    res.status(200).text('Hello World!!!');
});

// Запуск сервера
app.listen(config.port, () => {
    console.log(`Mock server is running`);
});