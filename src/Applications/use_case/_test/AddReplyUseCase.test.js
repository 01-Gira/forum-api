const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewComment = require('../../../Domains/replies/entities/NewReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');


describe('AddReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should throw error when thread not exists', async () => {
    // Arrange
    const useCasePayload = {
      content: 'new reply',
      threadId: 'thread-xxx',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));
    mockCommentRepository.verifyCommentExists = jest.fn();
    mockReplyRepository.addReply = jest.fn();

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(() => addReplyUseCase.execute(useCasePayload))
      .rejects.toThrowError(NotFoundError);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-xxx');
    expect(mockCommentRepository.verifyCommentExists).not.toBeCalled();
    expect(mockReplyRepository.addReply).not.toBeCalled();
  });

  it('should throw error when comment not exists', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Lorem ipsum sit dolor',
      threadId: 'thread-123',
      commentId: 'comment-xxx',
      owner: 'user-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'comment_reply-123',
      content: useCasePayload.content,
      owner: 'John Doe',
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));
    mockReplyRepository.addReply = jest.fn();

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(() => addReplyUseCase.execute(useCasePayload))
      .rejects.toThrowError(NotFoundError);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-xxx');
    expect(mockReplyRepository.addReply).not.toBeCalled();
  });

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'new reply',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'comment_reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
    .mockImplementation(() => Promise.resolve(mockAddedReply));  

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewComment({
      content: 'new reply',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    }));
    expect(addedReply).toEqual(new AddedReply({
      id: 'comment_reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  })


})