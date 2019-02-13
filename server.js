const user = require('./user');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MONGOLAB_URI, { useMongoClient: true });

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// create new user
app.post('/api/exercise/new-user', (req, res) => {
  user.createUser(req.body.username)
    .then(user => res.json(user),
          error => res.json(error))
})

// get all users
app.get('/api/exercise/users', (_, res) => {
  user.getAllUsers().then((x) => res.json(x))
})

// add exercises
app.post('/api/exercise/add', (req, res) => {
  user.addExercise({
    userId: req.body.userId,
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: new Date(req.body.date)
  }).then(x => res.json(x), x =>res.json(x))
})

// get exercises of user
app.get('/api/exercise/log', (req, res) => {
  user.getExercises(req.query.userId,req.query.from, req.query.to, req.query.limit)
    .then((x) => res.json(x), (x) => res.json(x))
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
