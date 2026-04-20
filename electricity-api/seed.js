const mongoose = require('mongoose');
const fs = require('fs');
const mongoURI = process.env.MONGO_URI ||
    'mongodb://localhost:27017/electricityDB';
mongoose.connect(mongoURI);
const seed = async () => {
    const usages =
        JSON.parse(fs.readFileSync('./electricity_usages_en.json', 'utf-8'));
    const users =
        JSON.parse(fs.readFileSync('./electricity_users_en.json', 'utf-8'));
    await mongoose.connection.collection('usages').insertMany(usages);
    await mongoose.connection.collection('users').insertMany(users);
    console.log("Data Seeded!");
    process.exit();
};
seed();