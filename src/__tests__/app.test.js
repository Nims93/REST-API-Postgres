const makeApp = require('./../app');
const request = require('supertest');
const { response } = require('express');
// const { jest } = require('@jest/globals');

const mockDatabase = {
  getTodos: jest.fn(() => []),

  getTodoID: jest.fn((id) => ({
    rows: [{ id, title: `test${id}`, content: `content${id}` }],
  })),

  postTodo: jest.fn((title, content) => ({
    rows: [{ id: 1, title, content }],
  })),

  deleteTodo: jest.fn((id) =>
    parseInt(id) >= 1
      ? { rows: [{ id: parseInt(id), title: 'test', content: 'test' }] }
      : { rows: [] }
  ),

  putTodoID: jest.fn((id, title, content) => {
    if (id < 1) {
      return { rows: [] };
    } else if (!title || !content) {
      return {
        rows: [
          {
            id: parseInt(id),
            title: title ? title : 'original database value',
            content: content ? content : 'original database value',
          },
        ],
      };
    }
  }),
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
  afterEach(() => mockDatabase.postTodo.mockClear());

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

describe('DELETE /todos', () => {
  afterEach(() => mockDatabase.deleteTodo.mockClear());

  test('should respond with json data if id is valid', async () => {
    for (let i = 1; i < 4; i++) {
      await request(app)
        .delete(`/todos/${i}`)
        .expect(200, {
          success: true,
          data: { id: i, title: 'test', content: 'test' },
        });
    }
  });

  test('should repsond with 404 error if id param is invalid', async () => {
    await request(app)
      .delete('/todos/0')
      .expect('Content-Type', /json/)
      .expect(400);
  });
});

describe('PUT /todos/:id route', () => {
  afterEach(() => mockDatabase.putTodoID.mockClear());

  const sendData = [
    {},
    { title: 'test title' },
    { content: 'test content' },
    { ttile: 'test title', content: 'test content' },
  ];

  test('should respond with json data if id is in db', async () => {
    for (let i = 1; i < 4; i++) {
      mockDatabase.putTodoID.mockClear();

      await request(app)
        .put(`/todos/${i}`)
        .send(sendData[i])
        .expect('Content-Type', /json/)
        .expect(200);

      expect(mockDatabase.putTodoID.mock.calls.length).toBe(1);
    }
  });

  test('should respond with 404 if id not in db', async () => {
    await request(app)
      .put('/todos/0')
      .send({ title: 'test', content: 'test' })
      .expect(404);

    expect(mockDatabase.putTodoID.mock.calls.length).toBe(1);
  });
});
