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
  })
})