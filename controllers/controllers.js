const { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleID, insertComment, updateVote, selectUsers } = require('../models/models');


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

exports.patchVotes = (req, res, next) => {
    const {article_id} = req.params;
    updateVote(article_id, req.body)
    .then(article => res.status(200).send({article}))
    .catch(err => next(err))
};

exports.validatePatch = (req,res, next) => {
    if(req.body.inc_votes === undefined){
        res.status(400).send({msg:"Bad Request"})
    } else {
        next()
    }
};

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => res.status(200).send({users}))
    .catch(err => next(err));
}
