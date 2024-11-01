const NewCommentLike = require('../../Domains/comment_likes/entities/NewCommentLike');


class AddCommentLikeUseCase {
  constructor({ commentLikeRepository, commentRepository, threadRepository }) {
    this._commentLikeRepository = commentLikeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newCommentLike = new NewCommentLike(useCasePayload);

    await this._threadRepository.verifyThreadExists(newCommentLike.threadId);
    await this._commentRepository.verifyCommentExists(newCommentLike.commentId);

    const isAlreadyLiked = await this._commentLikeRepository.isCommentLiked(newCommentLike.commentId, newCommentLike.owner);
    if (isAlreadyLiked) {
      await this._commentLikeRepository.verifyCommentLikeOwner(newCommentLike.commentId, newCommentLike.owner);
      console.log('before delete ' + newCommentLike.owner);

      await this._commentLikeRepository.deleteCommentLike(newCommentLike.commentId, newCommentLike.owner);
      console.log('after delete ' + newCommentLike.owner);

    } else {
      await this._commentLikeRepository.addCommentLike(newCommentLike);
    }
  }
}

module.exports = AddCommentLikeUseCase;