require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
//express app
const app = express()

app.use(cors({ 
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connected to database'))
    .catch((err => console.log('Mongodb connection error:', err)))

//testing route
app.get('/', (req,res) => {
    res.json({msg:'welcome'})
})
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)


//listen for requests
app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT)
})