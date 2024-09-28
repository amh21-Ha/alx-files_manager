import request from 'supertest';
import app from '../server';

describe('GET /stats', () => {
  it('should return the correct stats', async () => {
    const res = await request(app).get('/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('files');
  });
});
