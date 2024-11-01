const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;
  }

  async postCommentHandler(req, h) {
    const { id : owner } = req.auth.credentials;
    const { threadId } = req.params;
    const { content } = req.payload;
    const addCommentUseCase = await this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({content, owner, threadId});

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(req, h) {
    const { id : owner } = req.auth.credentials;
    const { threadId, commentId } = req.params;

    const deleteCommentUseCase = await this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({threadId, commentId, owner});

    const response = h.response({
      status: 'success'
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;