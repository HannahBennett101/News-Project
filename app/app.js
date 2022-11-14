const express = require('express');
const app = express();
const {getTopics} = require('../controllers/controllers');

app.use(express.json());

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

//Handle PSQL errors 
app.use((err, req, res, next) => {
    if (err.code === "223503") {
        res.sstatus(400).send({msg : "Foreign key constraint violated"});
    } else if (err.code === "22P02") {
        res.status(400).send({msg: "Invalid data types of property"});
    } else next(err);
});

//Handle custom errord
app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg});
    };
});

module.exports = app;