const { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleID, insertComment } = require('../models/models');


exports.getTopics = (req,res,next) => {
    selectTopics()
    .then((topics) => res.status(200).send({topics}))
    .catch(err => next(err));
};

exports.getArticles = (req,res,next) => {
    selectArticles()
    .then((articles) => res.status(200).send({articles}))
    .catch(err => next(err));
};

exports.getArticlesByID = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleByID(article_id)
    .then(article => res.status(200).send({article: article}))
    .catch(err => next(err));
};

exports.getCommentsByArticleID = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleID(article_id)
    .then(comments => res.status(200).send({ comments }))
    .catch(err => next(err));
};


exports.postComment = (req, res, next) => {
    
    const { article_id } = req.params;
    
    insertComment(article_id, req.body)
    .then(result => {
        
        res.status(201).send({ result })})
    .catch(err => next(err));
};

