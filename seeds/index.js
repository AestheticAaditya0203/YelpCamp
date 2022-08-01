const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            author: '629986dc814906318e6f8bf4',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Navigation in navbars will also grow to occupy as much horizontal space as possible to keep your navbar contents securely aligned.',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/appiness-world-interactive-pvt-ltd/image/upload/v1654581367/YelpCamp/n3glkqpfkcuhqehmymtf.jpg',
                    filename: 'YelpCamp/n3glkqpfkcuhqehmymtf'
                },
                {
                    url: 'https://res.cloudinary.com/appiness-world-interactive-pvt-ltd/image/upload/v1654660813/YelpCamp/onpth1z3kqlxaqae5udf.jpg',
                    filename: 'YelpCamp/onpth1z3kqlxaqae5udf'
                }
            ]
        });
        await camp.save();
    }
}
seedDB();