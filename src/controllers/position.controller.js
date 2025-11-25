const positionService  = require('../services/position.service');

class PositionController {
  async register(ctx) {
    try {
      const result = await positionService.register(ctx.request.body, ctx.state.user);
      ctx.status = 201;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }

  async update(ctx) {
    try {
      const result = await positionService.update(ctx.request.body,ctx.state.user );
      console.log("Update Result:", result);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async getAll(ctx) {
    try {
      const result = await positionService.getAll(ctx.request.body);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async getById(ctx) {
    try {
      const result = await positionService.getById(ctx.request.params.id  );
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

}

module.exports = new PositionController();