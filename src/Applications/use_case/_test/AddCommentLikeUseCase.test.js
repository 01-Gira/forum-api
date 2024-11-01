const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentLikeRepository = require('../../../Domains/comment_likes/CommentLikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedCommentLike = require('../../../Domains/comment_likes/entities/AddedCommentLike');
const NewCommentLike = require('../../../Domains/comment_likes/entities/NewCommentLike');
const AddCommentLikeUseCase = require('../AddCommentLikeUseCase');

describe('AddCommentLikeUseCase', () => {
  it('should orchestrate the add like action correctly when not already liked', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.isCommentLiked = jest.fn().mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.addCommentLike = jest.fn().mockImplementation(() => Promise.resolve());

    const addCommentLikeUseCase = new AddCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await addCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith('comment-123');
    expect(mockCommentLikeRepository.isCommentLiked).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentLikeRepository.addCommentLike).toHaveBeenCalledWith(expect.any(NewCommentLike));
  });

  it('should orchestrate the remove like action correctly when already liked', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.isCommentLiked = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentLikeRepository.verifyCommentLikeOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.deleteCommentLike = jest.fn().mockImplementation(() => Promise.resolve());

    const addCommentLikeUseCase = new AddCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await addCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith('comment-123');
    expect(mockCommentLikeRepository.isCommentLiked).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentLikeRepository.deleteCommentLike).toHaveBeenCalledWith('comment-123', 'user-123');
  });
});
