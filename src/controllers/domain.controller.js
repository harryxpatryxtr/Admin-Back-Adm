const domainService  = require('../services/domain.service');

class DomainController {
  async register(ctx) {
    try {
      const result = await domainService.register(ctx.request.body, ctx.state.user);
      ctx.status = 201;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }

  async update(ctx) {
    try {
      const result = await domainService.update(ctx.request.body,ctx.state.user );
      console.log("Update Result:", result);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async getAll(ctx) {
    try {
      const result = await domainService.getAll(ctx.request.body);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async getById(ctx) {
    try {
      const result = await domainService.getById(ctx.request.params.id  );
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

}

module.exports = new DomainController();