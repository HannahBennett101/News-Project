const db = require("../db/connection");


exports.selectTopics = () => {
    return db
    .query(`SELECT slug, description FROM topics;`).then((result) => result.rows)
    .catch(err => Promise.reject(err));
};

exports.selectArticles = () => {
    return db
    .query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) ::INT AS comment_count FROM articles
    JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`)
    .then((result) => result.rows)
    .catch(err => Promise.reject(err));
};

exports.selectArticleByID = (article_id) =>{
    return db.query(
            `SELECT * FROM articles WHERE article_id = $1`, [article_id]
        ).then(({rows}) => rows[0] === undefined ? Promise.reject({status:404, msg:"Article not found"}) : rows[0])
        .catch(err => Promise.reject(err))
};

exports.selectCommentsByArticleID = (article_id) => {
    return db
    .query(`SELECT article_id, comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
    .then(({rows}) => rows[0] === undefined ? Promise.reject({status:404, msg:"Article not found"}) : rows)
    .catch(err => Promise.reject(err))
}