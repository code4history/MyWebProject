import request from 'supertest';
import app from '../server';

describe('API tests', () => {
  it('GET /api/hello should return Hello World!', async () => {
    const response = await request(app).get('/api/hello');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Hello World!' });
  });
});