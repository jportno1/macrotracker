// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';


// import Food from './models/Food';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Food = require('./models/Food');

const path = require('path');


const app = express();
const router = express.Router();
const axios = require('axios');



app.use(cors());
app.use(bodyParser.json());



mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/foods');

const connection = mongoose.connection;


connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
    
    Food.collection.drop();
    
    Food.create([{
        "meal" : "Snack",
        "protein" : 6.43,
        "calories" : 221.43,
        "carbs" : 24.29,
        "fat" : 10.71,
        "title" : "mac and cheese",
        "servings" : 2,
        "diet" : "Vegetarian"
    },
    {
        "meal" : "Snack",
        "protein" : 0.82,
        "calories" : 60,
        "carbs" : 14.98,
        "fat" : 0.38,
        "title" : "mango",
        "servings" : 1,
        "diet" : "GF",
    },
    {
        "meal" : "Dinner",
        "protein" : 4.18,
        "calories" : 284,
        "carbs" : 46.02,
        "fat" : 9.2,
        "title" : "chocolate pudding",
        "servings" : 2,
        "diet" : "Kosher",
    },
    {
        "meal" : "Lunch",
        "protein" : 0.26,
        "calories" : 52,
        "carbs" : 13.81,
        "fat" : 0.17,
        "title" : "apple",
        "servings" : 1,
        "diet" : "Vegetarian",
    },
    {
        "meal" : "Breakfast",
        "protein" : 6.4,
        "calories" : 227,
        "carbs" : 28.3,
        "fat" : 9.7,
        "title" : "pancake",
        "servings" : 1,
        "diet" : "Kosher",
    }])
    .then(() => {
        console.log('Database has been seeded!');
    })
    .catch((err) => {
        console.log('Something went wrong while seeding ', err);
    })
});



router.route('/foods').get((req, res) => {
    Food.find((err, foods) => {
        if (err)
        console.log(err);
        else
        res.json(foods);
    });
});

router.route('/foods/:id').get((req, res) => {
    Food.findById(req.params.id, (err, food) => {
        if (err)
        console.log(err);
        else
        res.json(food);
    });
});

router.route('/foods/add').post((req, res) => {
    const encodedTitle = encodeURI(req.body.title)
    
    const lookup = axios.get(`https://api.edamam.com/api/food-database/parser?ingr=${encodedTitle}&app_id=c9549d75&app_key=${process.env.API_KEY}`)
    .then((lookup) => {
        req.body.protein = Math.round(req.body.servings * lookup.data.hints[0].food.nutrients.PROCNT * 100) / 100;;
        req.body.calories = Math.round(req.body.servings * lookup.data.hints[0].food.nutrients.ENERC_KCAL * 100) / 100;;
        req.body.carbs = Math.round(req.body.servings * lookup.data.hints[0].food.nutrients.CHOCDF * 100) / 100;;
        req.body.fat = Math.round(req.body.servings * lookup.data.hints[0].food.nutrients.FAT * 100) / 100;;
        
        let food = new Food(req.body);
        food.save()
        .then((food) => {
            res.status(200).json({'food': 'Added successfully'});
        })
        .catch((err) => {
            res.status(400).send('Failed to create new record');
        });
    })
    .catch(((err) => {console.log(err)}))
    
    
});

router.route('/foods/update/:id').post((req, res) => {
    Food.findById(req.params.id, (err, food) => {
        if (!food)
        return next(new Error('Could not load document'));
        else {
            food.title = req.body.title;
            food.servings = req.body.servings;
            food.diet = req.body.diet;
            food.meal = req.body.meal;
            food.protein = Math.round(req.body.servings * req.body.protein * 100) / 100;
            food.fat = Math.round(req.body.servings * req.body.fat * 100) / 100;
            food.carbs = Math.round(req.body.servings * req.body.carbs * 100) / 100;
            food.calories = Math.round(req.body.servings * req.body.calories * 100) / 100;
            
            
            
            
            
            
            food.save().then(food => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/foods/delete/:id').get((req, res) => {
    Food.findByIdAndRemove({_id: req.params.id}, (err, food) => {
        if (err)
        res.json(err);
        else
        res.json('Remove successfully');
    })
})

// router.route('/').get((req, res) => {
    //     res.sendFile('./frontend/dist/frontend/index.html')
    // })
    
    app.use(express.static(path.join(__dirname, './frontend/dist/frontend/')));
    app.use('/', router);

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, './frontend/dist/frontend/'));
    });
    const port = process.env.PORT || 3300;

    app.listen(port, () => console.log('Express server running on port: ', port));