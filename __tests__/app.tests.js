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
  test.only('Status 200: responds with an array of artcle objects, each containing the properties author, title, article_id, topic, created_at, votes and comment_count ordered by date descending', () => {
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
})