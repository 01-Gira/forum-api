class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, commentId, replyId, owner } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.replyId = replyId;
    this.owner = owner;
  }

  _verifyPayload({ replyId, threadId, commentId, owner }) {
    if (!replyId || !threadId || !commentId || !owner) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof replyId !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;