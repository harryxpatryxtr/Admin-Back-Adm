const roleService = require("../services/role.service");

class RoleController {
  async register(ctx) {
    try {
      const result = await roleService.register(
        ctx.request.body,
        ctx.state.user
      );
      ctx.status = 201;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }

  async update(ctx) {
    try {
      const result = await roleService.update(ctx.request.body, ctx.state.user);
      console.log("Update Result:", result);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async getAll(ctx) {
    try {
      const result = await roleService.getAll(ctx.request.body);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async getById(ctx) {
    try {
      const result = await roleService.getById(ctx.request.params.id);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }
  async setPermission(ctx) {
    try {
     
      const result = await roleService.setPermission(
        ctx.request.body,
        ctx.state.user
      );  console.log("Controller - setPermission called with:", ctx.request.body, ctx.state.user);
      ctx.body = result;
    } catch (error) {
       console.log("Controller - setPermission called with:", error);
      ctx.throw(401, error.message);
    }
  }
  async deletePermission(ctx) {
    try {
      const result = await roleService.deletePermission(
        ctx.request.params.id,
        ctx.state.user
      );
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }
}

module.exports = new RoleController();
