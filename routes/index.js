const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) =>{
      res.sendFile('C:/Users/Justice/Documents/toDoList/index.html');//tu mam na sztywno ustawione na razie więc trzeba to sobie przestawić albo ustawić za pomocą path
});

module.exports = app;