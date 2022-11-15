const express = require('express');
const app = express();
const {getTopics, getArticles, getArticlesByID} = require('../controllers/controllers');


app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesByID);

//Error handling:

//Generic 404 for an invalid route
app.all('/*', (req,res) => {
    res.status(404).send({ msg : "Route not found"});
});
//Handle custom errors
app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    } else next(err)
});

//Internal Server Errors handles
app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"});
});






module.exports = app;