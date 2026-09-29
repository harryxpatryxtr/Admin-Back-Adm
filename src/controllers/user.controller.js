const userService = require('../services/user.service');

class UserController {
  async register(ctx) {
    ctx.status = 201;
    ctx.body = await userService.register(ctx.request.body, ctx.state.user);
  }

  async update(ctx) {
    ctx.body = await userService.update(ctx.request.body, ctx.state.user);
  }

  async getAll(ctx) {
    ctx.body = await userService.getAll(ctx.state.validatedQuery);
  }

  async getById(ctx) {
    ctx.body = await userService.getById(ctx.params.id);
  }

  async assignRole(ctx) {
    ctx.body = await userService.assignRole(ctx.request.body, ctx.state.user);
  }

  async unassignRole(ctx) {
    ctx.body = await userService.unassignRole(ctx.request.body, ctx.state.user);
  }
}

module.exports = new UserController();
