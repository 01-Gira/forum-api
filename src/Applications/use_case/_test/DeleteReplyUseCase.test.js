const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('DeleteReplyUseCase', () => {
  it('should throw NotFoundError when the thread does not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-xxx',
      commentId: 'comment-123',
      replyId: 'comment_reply-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mock the required methods
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.reject(new NotFoundError()));
    mockCommentRepository.verifyCommentExists = jest.fn();
    mockReplyRepository.verifyReplyExists = jest.fn();
    mockReplyRepository.verifyReplyOwner = jest.fn();
    mockReplyRepository.deleteReply = jest.fn();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects.toThrowError(NotFoundError);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-xxx');
    expect(mockCommentRepository.verifyCommentExists).not.toBeCalled();
    expect(mockReplyRepository.verifyReplyExists).not.toBeCalled();
    expect(mockReplyRepository.verifyReplyExists).not.toBeCalled();
    expect(mockReplyRepository.deleteReply).not.toBeCalled();

  });

  it('should throw NotFoundError when the comment does not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-xxx',
      replyId: 'comment_reply-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mock the required methods
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.reject(new NotFoundError()));
    mockReplyRepository.verifyReplyExists = jest.fn();
    mockReplyRepository.verifyReplyOwner = jest.fn();
    mockReplyRepository.deleteReply = jest.fn();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects.toThrowError(NotFoundError);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-xxx');
    expect(mockReplyRepository.verifyReplyExists).not.toBeCalled();
    expect(mockReplyRepository.deleteReply).not.toBeCalled();
  });

  it('should throw NotFoundError when the reply does not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'comment_reply-xxx',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mock the required methods
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyExists = jest.fn(() => Promise.reject(new NotFoundError()));
    mockReplyRepository.verifyReplyOwner = jest.fn();
    mockReplyRepository.deleteReply = jest.fn();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects.toThrowError(NotFoundError);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockReplyRepository.verifyReplyExists).toBeCalledWith('comment_reply-xxx');
    expect(mockReplyRepository.verifyReplyOwner).not.toBeCalled();
    expect(mockReplyRepository.deleteReply).not.toBeCalled();
  });

  it('should throw AuthorizationError when the user is not the reply owner', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'comment_reply-123',
      owner: 'user-xxx',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mock the required methods
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.reject(new AuthorizationError()));
    mockReplyRepository.deleteReply = jest.fn();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
  

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects.toThrowError(AuthorizationError);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockReplyRepository.verifyReplyExists).toBeCalledWith('comment_reply-123');
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith('comment_reply-123', 'user-xxx');
    expect(mockReplyRepository.deleteReply).not.toBeCalled();
  });

  it('should orchestrate the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'comment_reply-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mock the required methods
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockReplyRepository.verifyReplyExists).toBeCalledWith('comment_reply-123');
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith('comment_reply-123', 'user-123');
    expect(mockReplyRepository.deleteReply).toBeCalledWith('comment_reply-123');
  });
});
