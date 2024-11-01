const AddedCommentLike = require('../AddedCommentLike');

describe('AddedCommentLike entities', () => {
  it('should throw a error when payload did not contain needed property', () => {
    // Arrange 
    const payload = {
      id: 'comment_like-123',
    };

    // Action and Assert
    expect(() => new AddedCommentLike(payload)).toThrowError('ADDED_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      commentId: 123,
      owner: 123
    };

    expect(() => new AddedCommentLike(payload)).toThrowError('ADDED_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedCommentLike object correctly', () => {
    // Arrange 
    const payload = {
      id: 'comment_like-123',
      commentId: 'comment-123',
      owner: 'user-123'
    };

    // Action 
    const addedComment = new AddedCommentLike(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.commentId).toEqual(payload.commentId);
    expect(addedComment.owner).toEqual(payload.owner);
  })
})