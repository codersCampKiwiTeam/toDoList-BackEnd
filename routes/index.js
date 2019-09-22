const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) =>{
      res.sendFile('https://coderscampkiwiteam.github.io/toDoList/'); // ścieżka z githuba
});

module.exports = app;
