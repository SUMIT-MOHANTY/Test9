const request = require('supertest');
const express = require('express');
const app = express();
const apiRoutes = require('../routes/api');
const errorHandler = require('../middleware/error_handler');

// Setup test app
app.use(express.json());
app.use('/api', apiRoutes);
app.use(errorHandler);

describe('API Routes', () => {
  test('POST /api/generate should return generated result', async () => {
    const response = await request(app)
      .post('/api/generate')
      .send({ prompt: 'Test prompt' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('result');
  });

  test('POST /api/generate should validate input', async () => {
    // Empty prompt
    const emptyResponse = await request(app)
      .post('/api/generate')
      .send({ prompt: '' })
      .set('Accept', 'application/json');

    expect(emptyResponse.status).toBe(400);

    // Prompt too long
    const longPrompt = 'x'.repeat(1001);
    const longResponse = await request(app)
      .post('/api/generate')
      .send({ prompt: longPrompt })
      .set('Accept', 'application/json');

    expect(longResponse.status).toBe(400);
  });

  test('GET /api/health should return status ok', async () => {
    const response = await request(app)
      .get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
