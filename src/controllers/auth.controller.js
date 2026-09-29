const authService = require('../services/auth.service');

class AuthController {
  async register(ctx) {
    ctx.status = 201;
    ctx.body = await authService.register(ctx.request.body);
  }

  async login(ctx) {
    ctx.body = await authService.login(ctx.request.body);
  }

  async me(ctx) {
    try {
      ctx.body = await authService.me(ctx.state.user.userId);
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }
}

module.exports = new AuthController();
