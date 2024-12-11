import request from 'supertest';
import app from '../server';

describe('GET /files/:id/data', () => {
  it('should return the file content', async () => {
    const res = await request(app).get('/files/5f1e8896c7ba06511e683b25/data').set('X-Token', 'f21fb953-16f9-46ed-8d9c-84c6450ec80f');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('image/png');
  });

  it('should return 404 if the file does not exist', async () => {
    const res = await request(app).get('/files/nonexistent/data');
    expect(res.status).toBe(404);
  });
});
