const roleService = require('../services/role.service');

class RoleController {
  async register(ctx) {
    ctx.status = 201;
    ctx.body = await roleService.register(ctx.request.body, ctx.state.user);
  }

  async update(ctx) {
    ctx.body = await roleService.update(ctx.request.body, ctx.state.user);
  }

  async getAll(ctx) {
    ctx.body = await roleService.getAll();
  }

  async getById(ctx) {
    ctx.body = await roleService.getById(ctx.params.id);
  }

  async setPermission(ctx) {
    ctx.body = await roleService.setPermission(ctx.request.body, ctx.state.user);
  }

  async deletePermission(ctx) {
    ctx.body = await roleService.deletePermission(ctx.params.id, ctx.state.user);
  }

  async getPermissionsByRole(ctx) {
    ctx.body = await roleService.getPermissionsByRole(ctx.params.roleId);
  }
}

module.exports = new RoleController();
