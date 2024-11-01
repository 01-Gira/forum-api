const NewReply = require('../NewReply');

describe('a NewReply entities', () => {
  it('should throw a error when payload did not contain needed property', () => {
    const payload = {
      content: 'New reply'
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw a error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
      threadId: true,
      commentId: 123,
      owner: {},
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    const payload = {
      content: 'New reply',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const newReply = new NewReply(payload);

    expect(newReply.content).toEqual(payload.content);
    expect(newReply.threadId).toEqual(payload.threadId);
    expect(newReply.commentId).toEqual(payload.commentId);
    expect(newReply.owner).toEqual(payload.owner);
  })
})