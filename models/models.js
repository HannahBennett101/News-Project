const db = require("../db/connection");
const { checkUserExists} = require("../utils/utils");


exports.selectTopics = () => {
    return db
    .query(`SELECT slug, description FROM topics;`).then((result) => result.rows)
    .catch(err => Promise.reject(err));
};

exports.selectArticles = (topic, sort_by = "created_at", order = "DESC") => {
    let query = `SELECT author, title, article_id, topic, created_at, votes, (SELECT COUNT(comment_id) ::INT FROM comments WHERE articles.article_id = comments.article_id) AS comment_count FROM articles`

    let queryOptions = [];

    if(topic){
        query += " WHERE articles.topic = $1";
        queryOptions.push(topic)
    }

    query += ` ORDER BY ${sort_by} ${order};`

    return db.query(query, queryOptions)
    .then(({ rows }) => rows[0] === undefined ? Promise.reject({ status:404, msg: "No articles associated with this topic"}) : rows)
}

exports.selectArticleByID = (article_id) =>{
    return db.query(
            `SELECT * FROM articles WHERE article_id = $1`, [article_id]
        ).then(({rows}) => rows[0] === undefined ? Promise.reject({status:404, msg:"Article not found"}) : rows[0])
        .catch(err => Promise.reject(err))
};

exports.selectCommentsByArticleID = (article_id) => {
    let articlesCount = 0;
    return db.query(`SELECT COUNT(*) FROM articles;`).then((articleCount) => {
        articlesCount = Number(articleCount.rows[0].count)
    }).then(() => {
        return db
        .query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments 
    JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id = $1 ORDER BY created_at DESC;`, [article_id]);
    }).then(({rows}) => {
        
        if (rows.length === 0 && article_id <= articlesCount) { return rows}
        else if (rows.length === 0 && article_id > articlesCount) {return Promise.reject({status: 404, msg:"Article not found"})}
        else return rows
    })
}

exports.insertComment = (article_id, comment) => {
    let articlesCount = 0;
    return db.query(`SELECT COUNT(*) FROM articles;`).then((articleCount) => {
        articlesCount = Number(articleCount.rows[0].count)
    }).then(() => {
        if (article_id > articlesCount){
            return Promise.reject({status:404, msg: "Article not found"})
        }
        let lengthOfComment = Object.keys(comment).length;
        if (lengthOfComment < 2 || comment.body.length === 0){
           return Promise.reject({status: 400, msg: "New comment is of invalid format"})}
        const user = comment.author;
            return checkUserExists(user).then(() => {
            return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING* ;`, [article_id, comment.author, comment.body])
        }).then(({rows}) => rows[0] === undefined ? Promise.reject({status: 404, msg: "Article not found"}) : rows[0]).catch(err => Promise.reject(err));
    })
}

exports.updateVote = (article_id, article) => {
    const increment = Number(article.inc_votes);
  
    if (isNaN(increment)){
        return Promise.reject({status: 400, msg: "Bad Request"})
    }
    
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
    [article.inc_votes, article_id])
    .then(({rows}) => rows[0] === undefined? Promise.reject({ status:404, msg: "Article not found"}) : rows[0])
};

exports.selectUsers = () => {
    return db.query(`SELECT username, name, avatar_url FROM users; `)
    .then((result) => result.rows)
    .catch(err => Promise.reject(err))
};
