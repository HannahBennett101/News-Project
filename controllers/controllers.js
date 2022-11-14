const { selectTopics, selectArticles } = require('../models/models');


exports.getTopics = (req,res) => {
    selectTopics()
    .then((topics) => res.status(200).send({topics}))
    .catch(err => next(err));
};

exports.getArticles = (req,res) => {
    selectArticles()
    .then((articles) => res.status(200).send({articles}))
    .catch(err => next(err));
};