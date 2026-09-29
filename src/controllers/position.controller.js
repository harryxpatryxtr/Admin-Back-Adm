const positionService = require('../services/position.service');

class PositionController {
  async register(ctx) {
    ctx.status = 201;
    ctx.body = await positionService.register(ctx.request.body, ctx.state.user);
  }

  async update(ctx) {
    ctx.body = await positionService.update(ctx.request.body, ctx.state.user);
  }

  async getAll(ctx) {
    ctx.body = await positionService.getAll();
  }

  async getById(ctx) {
    ctx.body = await positionService.getById(ctx.params.id);
  }
}

module.exports = new PositionController();
