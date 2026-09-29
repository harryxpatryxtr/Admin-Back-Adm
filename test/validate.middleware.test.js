const assert = require('node:assert/strict');
const { test } = require('node:test');
const Joi = require('joi');
const validate = require('../src/validators/validate');

test('validation stores normalized request data before continuing', async () => {
  const ctx = { request: { body: { email: ' ADMIN@EXAMPLE.COM ' } }, state: {} };
  let continued = false;

  await validate(Joi.object({ email: Joi.string().trim().lowercase().email().required() }))(
    ctx,
    async () => { continued = true; },
  );

  assert.equal(ctx.request.body.email, 'admin@example.com');
  assert.equal(continued, true);
});

test('validation rejects unknown fields and does not call the route', async () => {
  const ctx = { request: { body: { email: 'admin@example.com', role: 'admin' } }, state: {} };
  let continued = false;

  await assert.rejects(
    validate(Joi.object({ email: Joi.string().email().required() }))(ctx, async () => {
      continued = true;
    }),
    (error) => error.status === 400 && error.code === 'VALIDATION_ERROR',
  );
  assert.equal(continued, false);
});

test('validation middleware does not convert downstream failures into validation errors', async () => {
  const ctx = { request: { body: { id: 'valid' } }, state: {} };
  const downstreamError = new Error('service failed');

  await assert.rejects(
    validate(Joi.object({ id: Joi.string().required() }))(ctx, async () => {
      throw downstreamError;
    }),
    (error) => error === downstreamError,
  );
});
