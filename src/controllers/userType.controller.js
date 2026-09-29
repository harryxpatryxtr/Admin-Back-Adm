const userTypeService = require('../services/userType.service');

class UserTypeController {
  async register(ctx) {
    ctx.status = 201;
    ctx.body = await userTypeService.register(ctx.request.body, ctx.state.user);
  }

  async update(ctx) {
    ctx.body = await userTypeService.update(ctx.request.body, ctx.state.user);
  }

  async getAll(ctx) {
    ctx.body = await userTypeService.getAll();
  }

  async getById(ctx) {
    ctx.body = await userTypeService.getById(ctx.params.id);
  }
}

module.exports = new UserTypeController();
