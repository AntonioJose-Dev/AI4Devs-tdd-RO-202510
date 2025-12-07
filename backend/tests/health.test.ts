import request from 'supertest';
import app from '../src/index';

describe('GET /health', () => {
  it('should return status 200 and body { status: "OK" }', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });
});
