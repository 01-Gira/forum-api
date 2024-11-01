const AddCommentLikeUseCase = require("../../../../Applications/use_case/AddCommentLikeUseCase");

class CommentLikesHandler {
  constructor(container) {
    this._container = container;
  }

  async putCommentLikeHandler(req, h) {
    const { id : owner } = req.auth.credentials;
    const { threadId, commentId } = req.params;
    const addCommentLikeUseCase = await this._container.getInstance(AddCommentLikeUseCase.name);
    await addCommentLikeUseCase.execute({threadId, commentId, owner});

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentLikesHandler;