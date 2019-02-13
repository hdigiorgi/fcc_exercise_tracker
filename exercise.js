const mongoose = require('mongoose');

const ExerciseSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    description: {type: String, default: ''},
    duration: {type: Number, required: true},
    date: {type: Date, required: true}
})

const Exercise = mongoose.model('tracker_exercise', ExerciseSchema);

function addExercise(user, exercise) {
    if(!user || !exercise.date || isNaN(exercise.date.getDay()) ||
       !exercise.duration || isNaN(exercise.duration)) {
        return new Promise((res, rej) => {
            rej({error: 'invalid input', user, exercise})
        })
    };
    return Exercise.create(exercise);
}

function getLimitOption(limit) {
    if(!limit) return null;
    const number = parseInt(limit);
    return !isNaN(number)? {limit: number}: null;
}

function getExercises(user, fromDate, toDate, limit) {
    if(!user) return;
    const projection =  null;
    const options = getLimitOption(limit);
    var dateConditions = {};
    if(fromDate) {
        dateConditions.$gte = fromDate;
    }
    if(toDate) {
        dateConditions.$lte = toDate;
    }
    var condition = {userId: user._id}
    if(Object.keys(dateConditions).length > 0) {
        condition.date = dateConditions;
    }
    return Exercise.find(condition, projection, options).exec()
        .then(res => res.map(x => x._doc))
        .then(exercises => ({user, exercises}))
}

module.exports = {
    ExerciseSchema, addExercise, getExercises
}