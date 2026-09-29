const authService = require('../services/auth.service');

class AuthController {
  async register(ctx) {
    ctx.status = 201;
    ctx.body = await authService.register(ctx.request.body);
  }

  async login(ctx) {
    ctx.body = await authService.login(ctx.request.body);
  }

  async refreshToken(ctx) {
    ctx.body = await authService.refreshToken(ctx.request.body);
  }

  async logout(ctx) {
    ctx.body = await authService.logout(ctx.state.user.userId);
  }
}

module.exports = new AuthController();
