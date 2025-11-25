const permissionService  = require('../services/permission.service');

class PermissionController {
  async register(ctx) {
    try {
      const result = await permissionService.register(ctx.request.body, ctx.state.user);
      ctx.status = 201;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }

  async update(ctx) {
    try {
      const result = await permissionService.update(ctx.request.body,ctx.state.user );
      console.log("Update Result:", result);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async getAll(ctx) {
    try {
      const result = await permissionService.getAll(ctx.request.body);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async getById(ctx) {
    try {
      const result = await permissionService.getById(ctx.request.params.id  );
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

}

module.exports = new PermissionController();