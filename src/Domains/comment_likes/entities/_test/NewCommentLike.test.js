const NewCommentLike = require('../NewCommentLike');

describe('a NewCommentLike entities', () => {
  it('should throw a error when payload did not contain needed property', () => {
    const payload = {
      commentId: 'New comment'
    };

    expect(() => new NewCommentLike(payload)).toThrowError('NEW_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw a error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 123,
      commentId: 123,
      owner: {},
    };

    expect(() => new NewCommentLike(payload)).toThrowError('NEW_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewCommentLike object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const newCommentLike = new NewCommentLike(payload);

    expect(newCommentLike.threadId).toEqual(payload.threadId);
    expect(newCommentLike.commentId).toEqual(payload.commentId);
    expect(newCommentLike.owner).toEqual(payload.owner);
  })
})