import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


import Food from './models/Food';

const app = express();
const router = express.Router();
const axios = require('axios');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/foods');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
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
    
    const lookup = axios.get(`https://api.edamam.com/api/food-database/parser?ingr=${encodedTitle}&app_id=c9549d75&app_key=cc1dbe342a7504760425ef22b453e28d`)
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


app.use('/', router);

app.listen(4000, () => console.log('Express server running on port 4000'));