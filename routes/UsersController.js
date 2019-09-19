const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user.js');

app.post('/register', async (req, res) => {
    try {
        let user = new User({
            name: req.body.registerName,//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
            email: req.body.registerEmail,//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
            password: req.body.registerPassword//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
        });

        let validationResult = user.validateInput();

        if (validationResult.error !== undefined) {
            console.log(validationResult);
            res.json({ status: 'failed', message: validationResult.error.details.map(val => val.message )});
            return;
        }
        await user.hashPassword();
        let result = await user.save();
        res.json({ status: 'ok'});
    }
    catch(ex){
        res.json({ status: 'failed', message: ex.message });
    }
});

app.post('/login', auth, async (req, res) => { 
    let token;
    try 
    {
        let user = await User.findOne({ email: req.body.loginName });//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
        if (!user) return res.status(400).send('Invalid email or password');
    
        const validPassword = await bcrypt.compare(req.body.loginPassword, user.password);//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
        if (!validPassword) return res.status(400).send('Invalid email or password');
    
        token = jwt.sign({ _id: this._id, user: this.user }, config.get('jwtPrivateKey'));
    }
    catch(ex) {
        res.json({ status: 'failed', message: ex.message });  
    }
    res.header('authorization', token).json({ status: 'ok'});
  });

module.exports = app;








