const express = require('express');
const app = express();
const {getTopics} = require('../controllers/controllers');


app.get("/api/topics", getTopics);

//Error handling:

//Generic 404 for an invalid route
app.all('/*', (req,res) => {
    res.status(404).send({ msg : "Route not found"});
});

//Internal Server Errors handles
app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"});
});




module.exports = app;