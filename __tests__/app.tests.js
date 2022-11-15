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
      expect(articles).toHaveLength(5);
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
      expect(response.body.msg).toBe('Invalid data type')
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
          article_id: expect.any(Number),
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
    expect(response.body.msg).toBe('Invalid data type')
  });
});

})