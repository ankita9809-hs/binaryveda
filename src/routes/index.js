// API routes
exports.apiRoutes = (app) => {
  app.use(require("./auth")); // Auth apis (signup, signin)
};
