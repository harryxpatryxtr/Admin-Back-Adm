const authService = require('../services/auth.service');

class AuthController {
  async register(ctx) {
    try {
      const result = await authService.register(ctx.request.body);
      ctx.status = 201;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }

  async login(ctx) {
    try {
      const result = await authService.login(ctx.request.body);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async refreshToken(ctx) {
    try {
      const result = await authService.refreshToken(ctx.request.body);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }
}

module.exports = new AuthController();