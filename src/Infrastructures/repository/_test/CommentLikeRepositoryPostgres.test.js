const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedCommentLike = require('../../../Domains/comment_likes/entities/AddedCommentLike');
const NewCommentLike = require('../../../Domains/comment_likes/entities/NewCommentLike');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentLike function', () => {
    it('should persist new like', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'lorem' });
      await CommentsTableTestHelper.addComment({ content: 'lorem' });

      const newComment = new NewCommentLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = jest.fn(() => '123');
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentLikeRepositoryPostgres.addCommentLike(newComment);

      // Assert
      const commentLike = await CommentLikesTableTestHelper.findCommentLikeById('comment_like-123');
      expect(commentLike).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete comment like', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'lorem' });
      await CommentsTableTestHelper.addComment({ content: 'lorem' });
      await CommentLikesTableTestHelper.addCommentLike({ commentId: 'comment-123' });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      await commentLikeRepositoryPostgres.deleteCommentLike('comment-123', 'user-123');

      // Assert
      const commentLike = await CommentLikesTableTestHelper.findCommentLikeById('comment_like-123');
      expect(commentLike).toHaveLength(0);
    });
  });

  describe('verifyCommentLikeOwner function', () => {
    it('should throw AuthorizationError when not owned by user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'Lorem' });
      await CommentLikesTableTestHelper.addCommentLike({ commentId: 'comment-123' });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentLikeRepositoryPostgres.verifyCommentLikeOwner('comment-123', 'user-999'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment owned by user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'ipsum' });
      await CommentLikesTableTestHelper.addCommentLike({ commentId: 'comment-123' });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentLikeRepositoryPostgres.verifyCommentLikeOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyCommentLikeExists function', () => {
    it('should throw NotFoundError when comment like not exists', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentLikeRepositoryPostgres.verifyCommentLikeExists('xxxx')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment like exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'Lorem' });
      await CommentLikesTableTestHelper.addCommentLike({ commentId: 'comment-123' });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentLikeRepositoryPostgres.verifyCommentLikeExists('comment_like-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('isCommentLiked function', () => {
    it('should return true if comment is liked by the owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding', id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ title: 'lorem', id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ content: 'lorem', id: 'comment-123' });
      await CommentLikesTableTestHelper.addCommentLike({ commentId: 'comment-123', owner: 'user-123' });
  
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
  
      // Action
      const result = await commentLikeRepositoryPostgres.isCommentLiked('comment-123', 'user-123');
  
      // Assert
      expect(result).toBe(true);
    });
  
    it('should return false if comment is not liked by the owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding', id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ title: 'lorem', id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ content: 'lorem', id: 'comment-123' });
  
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
  
      // Action
      const result = await commentLikeRepositoryPostgres.isCommentLiked('comment-123', 'user-999');
  
      // Assert
      expect(result).toBe(false);
    });
  });
})
 