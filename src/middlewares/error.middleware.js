const errorMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      error: err.message || 'Internal server error'
    };
    
    // Log del error
    console.error('Error:', err);
  }
};

module.exports = errorMiddleware;