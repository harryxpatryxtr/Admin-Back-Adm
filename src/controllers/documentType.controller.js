const documentTypeService  = require('../services/documentType.service');

class DocumentTypeController {
  async register(ctx) {
    try {
      const result = await documentTypeService.register(ctx.request.body, ctx.state.user);
      ctx.status = 201;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }

  async update(ctx) {
    try {
      const result = await documentTypeService.update(ctx.request.body,ctx.state.user );
      console.log("Update Result:", result);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async getAll(ctx) {
    try {
      const result = await documentTypeService.getAll(ctx.request.body);
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

  async getById(ctx) {
    try {
      const result = await documentTypeService.getById(ctx.request.params.id  );
      ctx.body = result;
    } catch (error) {
      ctx.throw(401, error.message);
    }
  }

}

module.exports = new DocumentTypeController();