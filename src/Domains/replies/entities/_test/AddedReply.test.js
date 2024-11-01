const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw a error when payload did not contain needed property', () => {
    // Arrange 
    const payload = {
      id: 'thread-123',
      content: 'New Thread'
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      content: 123,
      owner: 123
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedReply object correctly', () => {
    // Arrange 
    const payload = {
      id: 'comment-123',
      content: 'Comment new',
      owner: 'user-123'
    };

    // Action 
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  })
})