const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

function readData() {
    const data = fs.readFileSync('restaurants.json');
    return JSON.parse(data);
}

function saveData(data) {
    fs.writeFileSync('restaurants.json', JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
    const message = "Welcome to my server 🦾";
    res.send(message);
});

// 
app.get('/restaurants', (req, res) => {
    const restaurants = readData();
    res.json(restaurants);
});

// 
app.get('/restaurants/:name', (req, res) => {
    const restaurants = readData();
    const restaurant = restaurants.find(rst => rst.name.toLowerCase() === req.params.name.toLowerCase())

    if (!restaurant) return res.status(404).send('Restaurant not found');
    res.json(restaurant);
});

// 
app.post('/restaurants', (req, res) => {
    const restaurants = readData();
    const existingRestaurant = restaurants.find(rst => rst.name.toLowerCase() === req.body.name.toLowerCase());

    if (existingRestaurant) {
        return res.status(400).send('Restaurant already exists');
    }

    const newRestaurant = {
        name: req.body.name,
        address: req.body.address,
        cover: req.body.cover,
        specialty: req.body.specialty,
        rating: req.body.rating,
        reviews: req.body.reviews || [],
        site: req.body.site,
        tel: req.body.tel,
        email: req.body.email
    };

    if (typeof newRestaurant.rating !== 'number' || newRestaurant.rating < 1 || newRestaurant.rating > 5) {
        return res.status(400).send('Invalid rating value');
    }

    restaurants.push(newRestaurant);
    saveData(restaurants);
    res.status(201).json(newRestaurant);
});

// 
app.put('/restaurants/:name', (req, res) => {
    const restaurants = readData();
    const restaurant = restaurants.find(rst => rst.name.toLowerCase() === req.params.name.toLowerCase());

    if (!restaurant) return res.status(404).send('Restaurant not found');

    restaurant.name = req.body.name || restaurant.name;
    restaurant.address = req.body.address || restaurant.address;
    restaurant.cover = req.body.cover || restaurant.cover;
    restaurant.specialty = req.body.specialty || restaurant.specialty;
    restaurant.rating = req.body.rating || restaurant.rating;
    restaurant.reviews = req.body.reviews || restaurant.reviews;
    restaurant.site = req.body.site || restaurant.site;
    restaurant.tel = req.body.tel || restaurant.tel;
    restaurant.email = req.body.email || restaurant.email;

    saveData(restaurants);
    res.json(restaurant);
});

// 
app.delete('/restaurants/:name', (req, res) => {
    let restaurants = readData();
    restaurants = restaurants.filter(rst => rst.name.toLowerCase() !== req.params.name.toLowerCase());

    if (restaurants.length === readData().length) return res.status(404).send('Restaurant not found');

    saveData(restaurants);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

