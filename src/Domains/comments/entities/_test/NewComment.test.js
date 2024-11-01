const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw a error when payload did not contain needed property', () => {
    const payload = {
      content: 'New comment'
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw a error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
      owner: {},
      threadId: 123
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    const payload = {
      content: 'New comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const newComment = new NewComment(payload);

    expect(newComment.content).toEqual(payload.content);
    expect(newComment.owner).toEqual(payload.owner);
    expect(newComment.threadId).toEqual(payload.threadId);
  })
})