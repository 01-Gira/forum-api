const routes = require("./routes");
const HelloWorldHandler = require('./handler');

module.exports = {
  name: 'hello_world',
  register: async ( server, { container }) => {
    const helloWorldHandler = new HelloWorldHandler(container);
    server.route(routes(helloWorldHandler));
  }
};