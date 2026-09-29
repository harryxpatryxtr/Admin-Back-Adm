const userService = require("../services/user.service");

class UserController {
  async register(ctx) {
    try {
      const result = await userService.register(ctx.request.body);
      ctx.status = 201;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }

  async update(ctx) {
    try {
      const result = await userService.update(ctx.request.body);
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }

  async getAll(ctx) {
    try {
      const result = await userService.getAll();
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }

  async getById(ctx) {
    try {
      const result = await userService.getById(ctx.request.params.id);
      ctx.body = result;
    } catch (error) {
      ctx.throw(404, error.message);
    }
  }
}

module.exports = new UserController();
