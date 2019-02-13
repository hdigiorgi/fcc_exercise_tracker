const mongoose = require('mongoose');
const exercise = require('./exercise');

const UserSchema = mongoose.Schema({
    username: {type: String, required: true},
})

const User = mongoose.model('tracker_User', UserSchema);

function createUser(username) {
    return User.create({username})
}

function getAllUsers() {
    return User.find().exec()
}

function addExercise(newExercise) {
    return User.findOne({_id: newExercise.userId}).exec()
        .then(user => exercise.addExercise(user._doc, newExercise))
}

function getExercises(userId, fromDate, toDate, limit) {
    return User.findOne({_id: userId}).exec()
        .then(user => exercise.getExercises(user._doc, fromDate, toDate, limit))
        .then(({user, exercises}) => ({
            ...user,
            count: exercises.length,
            exercises
        }))
}

module.exports = {
    createUser, getAllUsers, addExercise, getExercises
}