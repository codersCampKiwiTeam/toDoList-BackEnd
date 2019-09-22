const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user.js');

router.post('/login', async (req, res) => { 
    try 
    {
        let user = await User.findOne({ email: req.body.loginName });//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
        if (user == null) {
			return res.status(400).send('Invalid email or password');
		}
    
        const validPassword = await bcrypt.compare(req.body.loginPassword, user.password);//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
        if (!validPassword) {
			return res.status(400).send('Invalid email or password');
		}
    
        let token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

        return res.send(token);
    }
    catch(ex) {
        console.log(ex);
        return res.status(500).send('There was an error while processing the request'); 
    }
});

router.post('/register', async (req, res) => {
    try {
        let user = new User({
            name: req.body.registerName,//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
            email: req.body.registerEmail,//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
            password: req.body.registerPassword//Tak nazwała to osoba, która pisała fetch w script.js, chciałam się dopasować, żeby sprawdzić czy działa. Zresztą w script js musiałam poprawić to zapytanie jsonowe bo tam nie ma myślników
        });

        let validationResult = user.validateInput();

        if (validationResult.error !== undefined) {
            return res.status(400).send(validationResult.error.details.map(i => i.message).join("\r\n"));
        }

        let existingUser = await User.findOne({ email: req.body.registerEmail });

        if (existingUser != null) {
            return res.status(400).send('Provided email is already in use');
        }

        await user.hashPassword();
        let result = await user.save();
        return res.send('{ok}');
    }
    catch(ex) {
		console.log(ex);
        return res.status(500).send('There was an error while processing the request');
    }
});
  
module.exports = router;








