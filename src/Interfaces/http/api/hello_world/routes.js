const routes = (handler) => ([
  {
    method: 'GET',
    path: '/hello-world',
    handler: (req, h) => handler.getHelloWorldHandler(req, h)
  }
]);

module.exports = routes;