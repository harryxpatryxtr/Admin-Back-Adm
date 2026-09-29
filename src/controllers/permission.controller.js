const permissionService = require('../services/permission.service');

class PermissionController {
  async register(ctx) {
    ctx.status = 201;
    ctx.body = await permissionService.register(ctx.request.body, ctx.state.user);
  }

  async update(ctx) {
    ctx.body = await permissionService.update(ctx.request.body, ctx.state.user);
  }

  async getAll(ctx) {
    ctx.body = await permissionService.getAll();
  }

  async getById(ctx) {
    ctx.body = await permissionService.getById(ctx.params.id);
  }
}

module.exports = new PermissionController();
