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