const routes = require("./routes");
const CommentLikesHandler = require('./handler');

module.exports = {
  name: 'comment_likes',
  register: async ( server, { container }) => {
    const commentLikesHandler = new CommentLikesHandler(container);
    server.route(routes(commentLikesHandler));
  }
};