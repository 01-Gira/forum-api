const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw a error when payload did not contain needed property', () => {
    // Arrange 
    const payload = {
      id: 'comment-123',
      content: 'Comment new',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      content: 123,
      owner: 123
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedComment object correctly', () => {
    // Arrange 
    const payload = {
      id: 'comment-123',
      content: 'Comment new',
      owner: 'user-123'
    };

    // Action 
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  })
})