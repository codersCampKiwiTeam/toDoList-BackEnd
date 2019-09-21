const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user.js');

router.post('/login', async (req, res) => { 
    try 
    {
        let user = await User.findOne({ email: req.body.loginName });
        if (user == null) return res.status(400).send('Invalid email or password');
    
        const validPassword = await bcrypt.compare(req.body.loginPassword, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password');
    
        const token = user.generateAuthToken();
        return res.send(token);
    }
    catch(ex) {
        console.log(ex);
        return res.status(404).send('There was an error while processing the request'); 
    }
});

router.post('/register', async (req, res) => {
    try {
        let user = new User({
            name: req.body.registerName,
            email: req.body.registerEmail,
            password: req.body.registerPassword
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
        return res.status(404).send('There was an error while processing the request');
    }
});

router.get('/', require('../middleware/auth.js').isAuthenticated, async (req, res) => {
    res.send("sdfsd");
});
  
module.exports = router;








