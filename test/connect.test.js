import request from 'supertest';
import app from '../server';

describe('GET /connect', () => {
  it('should authenticate user and return a token', async () => {
    const res = await request(app).get('/connect').set('Authorization', 'Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
