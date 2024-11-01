class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.isDelete === 'true' ? '**komentar telah dihapus**' : payload.content;
    this.likeCount = payload.likeCount;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, isDelete, likeCount
    } = payload;

    if (!id || !username || !date || !content || !isDelete || likeCount === undefined ) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
      || typeof isDelete !== 'string'
      || typeof likeCount !== 'number'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;