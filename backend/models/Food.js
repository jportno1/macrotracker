import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Food = new Schema({
    title: {
        type: String
    },
    servings: {
        type: Number
    },
    diet: {
        type: String
    },
    meal: {
        type: String,
        default: 'Snack'
    },
    protein: {
        type: Number,
        default: 0
    },
    calories: {
        type: Number,
        default: 0
    },
    carbs: {
        type: Number,
        default: 0
    },
    fat: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Food', Food);