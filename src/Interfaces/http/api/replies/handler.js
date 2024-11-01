const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;
  }

  async postReplyHandler(req, h) {
    const { id : owner } = req.auth.credentials;
    const { threadId, commentId } = req.params;
    const { content } = req.payload;

    const addReplyUseCase = await this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({content, threadId, commentId, owner});

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  

  async deleteReplyHandler(req, h) {
    const { id : owner } = req.auth.credentials;
    const { threadId, commentId, replyId } = req.params;

    const deleteReplyUseCase = await this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({threadId, commentId, replyId, owner});

    const response = h.response({
      status: 'success'
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;