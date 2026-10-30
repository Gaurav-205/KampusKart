const request = require('supertest');
const express = require('express');
const { createMemoryUpload } = require('../../middleware/uploads');
const { handleUploadError } = require('../../controllers/controllerUtils');
const { validateResetPassword, validateForgotPassword } = require('../../middleware/validation');

describe('upload limits', () => {
  const buildApp = () => {
    const app = express();
    const upload = createMemoryUpload();
    app.post('/upload', upload.array('images', 5), (req, res) =>
      res.json({ count: req.files.length })
    );
    app.use(handleUploadError);
    return app;
  };

  test('rejects files larger than the 5MB default with a 400', async () => {
    const res = await request(buildApp())
      .post('/upload')
      .attach('images', Buffer.alloc(5 * 1024 * 1024 + 1), 'big.png');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/less than 5MB/);
  });

  test('rejects more files than the route allows with a 400', async () => {
    let req = request(buildApp()).post('/upload');
    for (let i = 0; i < 6; i += 1) {
      req = req.attach('images', Buffer.from('x'), `f${i}.png`);
    }
    const res = await req;

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Too many files uploaded');
  });

  test('accepts files within the limits', async () => {
    const res = await request(buildApp())
      .post('/upload')
      .attach('images', Buffer.from('small'), 'ok.png');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });
});

describe('password reset validation', () => {
  const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.post('/forgot', validateForgotPassword, (req, res) => res.json({ ok: true }));
    app.post('/reset', validateResetPassword, (req, res) => res.json({ ok: true }));
    return app;
  };

  test('forgot-password requires a valid email instead of crashing on a missing one', async () => {
    const res = await request(buildApp()).post('/forgot').send({});
    expect(res.status).toBe(400);
  });

  test('reset-password rejects weak new passwords', async () => {
    const res = await request(buildApp())
      .post('/reset')
      .send({ email: 'a@example.com', otp: '123456', newPassword: 'password' });

    expect(res.status).toBe(400);
    expect(res.body.details[0].field).toBe('newPassword');
  });

  test('reset-password rejects malformed OTPs', async () => {
    const res = await request(buildApp())
      .post('/reset')
      .send({ email: 'a@example.com', otp: { $gt: '' }, newPassword: 'Str0ng!pass' });

    expect(res.status).toBe(400);
  });

  test('reset-password accepts a well-formed request', async () => {
    const res = await request(buildApp())
      .post('/reset')
      .send({ email: 'a@example.com', otp: '123456', newPassword: 'Str0ng!pass' });

    expect(res.status).toBe(200);
  });
});
