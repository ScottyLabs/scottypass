// eslint-disable-next-line
const createProxyMiddleware = require('http-proxy-middleware');

// eslint-disable-next-line
module.exports = function (app) {
  app.use(
    '/login',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
    }),
  );
};
