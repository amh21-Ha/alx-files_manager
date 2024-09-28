import request from 'supertest';
import app from '../server';

describe('POST /users', () => {
  it('should create a new user', async () => {
    const res = await request(app).post('/users').send({
      email: 'test@example.com',
      password: 'password',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });
});
