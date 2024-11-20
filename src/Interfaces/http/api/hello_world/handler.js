const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class HelloWorldHandler {
  constructor(container) {
    this._container = container;
  }

  async getHelloWorldHandler(req, h) {
    const response = h.response({
      status: 'success',
      value: 'Hello World',
    });
    response.code(200);
    return response;
  }
}

module.exports = HelloWorldHandler;