const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{type: String, required:true},
    email:{type: String, required:true},
    password:{type: String, required:true}

});

const User = mongoose.model('User', userSchema);




const register = app.post('/register', async (req, res) =>{
    let user = new User({
    name: req.body.registerName,//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
    email: req.body.registerEmail,//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
    password:req.body.registerPassword//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
    });
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    try{
        let result = await user.save();
        console.log(result);
    }
    catch(ex){
        console.log(ex.message);
    }
        // res.send("Cos potężnie zjebano");
       // console.log(req.body.registerEmail);
});


 const login = app.post('/login', async (req, res) =>{ 
    let user = await User.findOne({ email: req.body.loginName });//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
    if (!user) return res.status(400).send('Invalid email or password');
  
    const validPassword = await bcrypt.compare(req.body.loginPassword, user.password);//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
    if (!validPassword) return res.status(400).send('Invalid email or password');
  
    const token = jwt.sign({ _id: this._id, user: this.user }, config.get('jwtPrivateKey'));
    console.log(token);
    res.send(token);
   
  });

       // res.send("Cos potężnie zjebano");
        // console.log(req.body.registerEmail);


        module.exports = register;
        module.exports = login;








