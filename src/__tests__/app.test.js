const makeApp = require('./../app');
const request = require('supertest');
// const { jest } = require('@jest/globals');

const mockDatabase = {
  getTodos: jest.fn(() => []),

  getTodoID: jest.fn((id) => ({
    rows: [{ id, title: `test${id}`, content: `content${id}` }],
  })),

  postTodo: jest.fn((title, content) => ({
    rows: [{ id: 1, title, content }],
  })),
};

const app = makeApp(mockDatabase);

describe('GET /todos', () => {
  afterEach(() => mockDatabase.getTodos.mockClear());

  test('should respond with json data', async () => {
    await request(app)
      .get('/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  test('getTodos function should be called just once', async () => {
    await request(app).get('/todos');

    expect(mockDatabase.getTodos.mock.calls.length).toBe(1);
  });
});

describe('GET /todos/:id', () => {
  afterEach(() => mockDatabase.getTodoID.mockClear());

  test('should respond with json data', async () => {
    for (let i = 1; i < 4; i++) {
      mockDatabase.getTodoID.mockClear();

      await request(app).get(`/todos/${i}`).expect(200);

      expect(mockDatabase.getTodoID.mock.calls.length).toBe(1);
    }
  });

  test('should reject on id that does not exist', async () => {
    mockDatabase.getTodoID.mockReturnValueOnce({ rows: [] });

    await request(app)
      .get(`/todos/${0}`)
      .expect(404, { success: false, message: 'ID not found' });
  });
});

describe('POST /todos', () => {
  afterEach(() => mockDatabase.getTodoID.mockClear());

  test('should respond with json data if title and content are present', async () => {
    await request(app)
      .post('/todos')
      .send({ title: 'test', content: 'test' })
      .expect(201);
  });

  test('should respond with http error if title or content missing', async () => {
    await request(app).post('/todos').send({ title: 'test' }).expect(400);
  });
});
