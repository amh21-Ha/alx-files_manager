import request from 'supertest';
import app from '../server';  // Assuming your Express app is exported from server.js

describe('GET /status', () => {
  it('should return status 200 and the correct response', async () => {
    const res = await request(app).get('/status');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ redis: true, db: true });
  });
});
