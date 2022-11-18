const { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleID, insertComment, updateVote, selectUsers, removeComment } = require('../models/models');


exports.getTopics = (req,res,next) => {
    selectTopics()
    .then((topics) => res.status(200).send({topics}))
    .catch(err => next(err));
};

exports.getArticles = (req,res,next) => {
    selectArticles(req.query.topic, req.query.sort_by, req.query.order)
    .then((articles) => res.status(200).send({articles}))
    .catch(err => next(err));
};

exports.checkQueries = (req,res,next) => {
    const columns = ["created_at", "votes", "comment_count"];
    if (req.query.sort_by && !columns.includes(req.query.sort_by)) {
        res.status(400).send({msg:"unable to sort by this parameter"})
    } else if (req.query.order && req.query.order.toUpperCase() !== 'ASC' && req.query.order.toUpperCase() !== 'DESC') {
        res.status(400).send({msg:'cannot order by this parameter'})
    } else {next()}
}

exports.getArticlesByID = (req, res, next) => {
    selectArticleByID(req.params.article_id, req.query.comment_count)
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

exports.deleteComment = (req,res,next) =>{
    removeComment(req.params.comment_id)
    .then(comment => res.status(204).send({ comment })).catch(err => next(err))
}