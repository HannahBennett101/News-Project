const request = require("supertest");
const app = require("../app/app");
const db = require('../db/connection');
const data =  require('../db/data/test-data');
const seed = require('../db/seeds/seed')

beforeEach(() => seed(data));

afterAll(()=> {
  return db.end()
});

describe(`GET /api/topics`, () => {
  test('Status 200: responds with an array of topic objects, each containing the properties slug and description', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(result => {
      const topics = result.body.topics;
      expect(topics).toBeInstanceOf(Array);
      expect(topics).toHaveLength(3);

      topics.forEach((topic) => {
        
        expect(topic).toEqual(
          expect.objectContaining({
            description: expect.any(String),
            slug: expect.any(String)
          })
        )
      })
    })
  });
  test('Status 404: responds with an error message (Route not found)', () => {
    return request(app)
    .get('/api/topical')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Route not found');
    });
  });
});

describe('GET /api/articles', () => {
  test('Status 200: responds with an array of article objects, each containing the properties author, title, article_id, topic, created_at, votes and comment_count ordered by date descending', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(result => {
      const articles = result.body.articles;
      expect(articles).toBeInstanceOf(Array);
      expect(articles).toHaveLength(12);
      articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number)
          })
      });
    });
  });
  test('Status 404: responds with an error message (Route not found)', () => {
    return request(app)
    .get('/api/arts')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Route not found');
    });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('Status 200: responds with a specific article, given the article id', ()=> {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((response) => {
      expect(response.body.article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100
      })
    });
  });
  test('Status 404 responds with a status (Article not found)', () => {
    return request(app)
    .get('/api/articles/1000')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Article not found')
    });
  });
  test('Status 400 responds with a status (Invalid Article ID)', () => {
    return request(app)
    .get('/api/articles/one')
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad Request')
    });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('Status 200: responds with a specific article, given the article id and the corresponding comments sorted newest to oldest', ()=> {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      const articleOneComments = response.body.comments;
  
      expect(articleOneComments).toHaveLength(11)
      articleOneComments.forEach((comment) => {
        expect(comment).toMatchObject({
         
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String)

      })
    });
    expect(articleOneComments).toBeSortedBy("created_at", {descending: true, coerce: true, })
  });
});
test('Status 200: responds with a specific article, given the article id but no comments', ()=> {
  return request(app)
  .get('/api/articles/4/comments')
  .expect(200)
  .then((response) => {
    const articleFourComments = response.body.comments;
    expect(articleFourComments).toHaveLength(0)

});
})
  test('Status 404 responds with a status (Article not found)', () => {
    return request(app)
    .get('/api/articles/1000/comments')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Article not found')
  });
});
test('Status 400 responds with a status (Invalid Article ID)', () => {
  return request(app)
  .get('/api/articles/one/comments')
  .expect(400)
  .then((response) => {
    expect(response.body.msg).toBe('Bad Request')
  });
});

});

describe('POST /api/articles/:article_id/comments', () => {
  test('Status 201: responds with a new comment added to the comment database', () => {
    const commentToPost = {
      author: 'icellusedkars',
      body: 'comment'
    };
    return request(app)
    .post('/api/articles/2/comments')
    .send(commentToPost)
    .expect(201)
    .then(({body}) => { 
      const respondingComment = body.result
      expect(respondingComment).toMatchObject({
          comment_id: 19,
          body: 'comment',
          author: 'icellusedkars',
          article_id: 2,
          votes: 0,
          created_at: expect.any(String)
        })
      });
    });
    test('Status 400: responds with error message (bad request) when passed an object without two keys to post', () => {
      const noBody = {
        author: 'icellusedkars'
      }
      return request(app)
      .post('/api/articles/2/comments')
      .send(noBody)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("New comment is of invalid format")
      });
    });
    test('Status 404: author name not found', () => {
      const commentToPost= { 
        author: 'me',
        body: 'I am commenting'
      };
      return request(app)
      .post('/api/articles/1/comments')
      .send(commentToPost)
      .expect(404)
      .then((response) =>{
      
      expect(response.body.msg).toBe("Author does not exist")})
    });
    test('Status 404: article_id not found', () => {
      const commentToPost= { 
        author: 'icellusedkars',
        body: 'I am commenting'
      };
      return request(app)
      .post('/api/articles/1000/comments')
      .send(commentToPost)
      .expect(404)
      .then((response) =>{
      expect(response.body.msg).toBe("Article not found")})
    });
    test('Status 400: invalid article_id', () => {
      const commentToPost= { 
        author: 'icellusedkars',
        body: 'I am commenting'
      };
      return request(app)
      .post('/api/articles/one/comments')
      .send(commentToPost)
      .expect(400)
      .then((response) =>{
      expect(response.body.msg).toBe("Bad Request")})
    })
  });

  describe('PATCH /api/articles/:article_id', () => {
    test('Status 200: should respond by sending the patched article to the client', () => {
      const patch = {inc_votes: 3};
      return request(app)
      .patch('/api/articles/1')
      .send(patch)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 103,
       })
      })
    });
    test('Status 200: successfully patches the article ignoring irrelevant object key value paiers', () => {
      const patch = {inc_votes: 5,
      key: "keyValue"};
      return request(app)
      .patch('/api/articles/1')
      .send(patch)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 105,
    })
  })
    });
    test('Status 400: should  respond with error message (bad request) when given an empty object to patch with', () => {
      const patch = {};
      return request(app)
      .patch('/api/articles/1')
      .send(patch)
      .expect(400)
      .then(({body}) => expect(body.msg).toBe("Bad Request"))
    });
    test('Status 404: responds with a status (Article not found)', ()=> {
      const patch = { inc_votes: 1}
      return request(app)
      .patch('/api/articles/100')
      .send(patch)
      .expect(404)
      .then(({body}) => {expect(body.msg).toBe('Article not found')})
    });
    test('Status 400: responds with a status (Bad Request) when inputting an invalid article_id', ()=> {
      const patch = { inc_votes: 1}
      return request(app)
      .patch('/api/articles/four')
      .send(patch)
      .expect(400)
      .then(({body}) => {expect(body.msg).toBe('Bad Request')})
    });
    test('Status 400: responds with a status (Bad Request) when inputting the wrong data type into inc_votes', ()=> {
      const patch = { inc_votes: "votes"}
      return request(app)
      .patch('/api/articles/100')
      .send(patch)
      .expect(400)
      .then(({body}) => {expect(body.msg).toBe('Bad Request')})
    });
  });
  
  describe('GET /api/users', () => {
    test('Status 200: respndse with an array of user objects', () => {
      return request(app)
      .get('/api/users')
      .expect(200)
      .then(result => {
        const users = result.body.users;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            })
          )
        })
      })
    });
    test('Status 404: responds with an error message (Route not found)', () => {
      return request(app)
      .get('/api/username')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Route not found');
      });
    });
  });

  describe('GET /api/articles queries', () => {
    describe('Only one query, topic', () => {
      test('Status 200: responds with the articles for the topic mitch', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then((result) => {
          const articles = result.body.articles;
          expect(articles).toHaveLength(11)
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: 'mitch',
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
          })
          })
          expect(articles).toBeSortedBy("created_at", { descending: true, coerce: true})
      })
    })
    test('Status 404: responds with an error message when queried a topic that does not exist', () => {
      return request(app)
      .get('/api/articles?topic=topic')
      .expect(404)
      .then(({body}) => expect(body.msg).toBe("No articles associated with this topic"))
    })
  })
  describe('Only one query, sort_by', () => {
    test('Status 200: responds with the aticles, sorted by descending votes' ,() => {
      return request(app)
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then((result) => {
        const articles = result.body.articles;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
          })
        })
        expect(articles).toBeSortedBy("votes", {descending: true, coerce: true})
      })
    })
    test('Status 404: responds with an error message when asked to sort by an invalid proeprty', () => {
      return request(app)
      .get('/api/articles?sort_by=numbers')
      .expect(400)
      .then(({body}) => expect(body.msg).toBe("unable to sort by this parameter"))
  
    })
  })
  describe('Only one query, order_by', () => {
    test('Status 200: responds with the aticles, sorted by comment count ascending' ,() => {
      return request(app)
      .get('/api/articles?sort_by=comment_count&order=asc')
      .expect(200)
      .then((result) => {
        const articles = result.body.articles;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
          })
        })
        expect(articles).toBeSortedBy("comment_count", {descending: false, coerce: true})
      })
  
    })
    test('Status 400: responds with an error message when asked to order by an invalid proeprty', () => {
      return request(app)
      .get('/api/articles?order=orders')
      .expect(400)
      .then(({body}) => expect(body.msg).toBe("cannot order by this parameter"))
  })
  })
  describe('multiple queries', () => {
    test('Status 200; responds with the correct articles when queries by more than one property', () => {
      return request(app)
      .get('/api/articles?topic=mitch&sort_by=comment_count&order=asc')
      .expect(200)
      .then((result) => {
        const articles = result.body.articles;
        articles.forEach((article) => {
          expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "mitch",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
          })
        })
        expect(articles).toBeSortedBy("comment_count")
      })
    })
  })
  })