const Reply = require('../Reply');

describe('Reply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment_reply-123',
      username: 'Lorem',
      date: new Date().toISOString(),
      content: 'lorem ipsum',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment_reply-123',
      username: ['Lorem'],
      date: new Date().toISOString(),
      content: 'lorem ipsum',
      isDelete: 'false',
      commentId: ['comment-123'],
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment_reply-123',
      username: 'Lorem',
      date: new Date().toISOString(),
      content: 'lorem ipsum',
      isDelete: 'false',
      commentId: 'comment-123',
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toBe(payload.id);
    expect(reply.username).toBe(payload.username);
    expect(reply.date).toBe(payload.date);
    expect(reply.content).toBe(payload.content);
    expect(reply.commentId).toBe(payload.commentId);
  });

  it('should create Reply entities correctly when is delete', () => {
    // Arrange
    const payload = {
      id: 'comment_reply-123',
      username: 'Lorem',
      date: new Date().toISOString(),
      content: 'lorem ipsum',
      isDelete: 'true',
      commentId: 'comment-123',
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toBe(payload.id);
    expect(reply.username).toBe(payload.username);
    expect(reply.date).toBe(payload.date);
    expect(reply.content).toBe('**balasan telah dihapus**');
    expect(reply.commentId).toBe(payload.commentId);
  });
});