const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const app = express();
const cors = require('cors');


if(!process.env.api_jwtPrivateKey){
    console.error('FATAL ERROR jwtPrivateKey is not defined');
    process.exit(1);
}
app.use(cors());
app.options("*", cors({ 
    "origin" : "*",
    "methods" : "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    "allowedHeaders": "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, x-auth-token"
}));

mongoose.connect('mongodb+srv://coderscampkiwiteam:test@todoapp-jswak.mongodb.net/test?retryWrites=true&w=majority', { 
useNewUrlParser: true, useUnifiedTopology: true    
})
.then(() => console.log('connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...'))
mongoose.set('useCreateIndex', true);
// Express body parser
app.use(express.json());

// Routes
app.use('/users', require('./routes/UsersController.js'));
app.use('/tasks', require('./routes/tasks.js'));

const PORT = process.env.PORT || 5005;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
