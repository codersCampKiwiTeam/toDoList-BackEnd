const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const app = express();


if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR jwtPrivateKey is not defined');
    process.exit(1);
}
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.connect('mongodb://localhost/users', { 
useNewUrlParser: true, useUnifiedTopology: true  
})
.then(() => console.log('connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...'))
mongoose.set('useCreateIndex', true);
// Express body parser
app.use(express.json());

// Routes
app.use('/auth', require('./routes/AuthController.js'));
app.use('/users', require('./routes/UsersController.js'));
app.use('/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5004;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
