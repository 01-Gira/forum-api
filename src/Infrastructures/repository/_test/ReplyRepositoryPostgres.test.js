const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const Reply = require('../../../Domains/replies/entities/Reply');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist new reply and return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'dicoding' });
      await CommentsTableTestHelper.addComment({ content: 'dicoding' });

      const newReply = new NewReply({
        content: 'Lorem',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = jest.fn(() => '123');
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const thread = await RepliesTableTestHelper.findReplyById('comment_reply-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'dicoding', body: 'dicoding' });
      await CommentsTableTestHelper.addComment({ content: 'dicoding' });

      const newReply = new NewReply({
        content: 'Lorem',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'comment_reply-123',
        content: newReply.content,
        owner: newReply.owner,
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should delete comment using soft delete', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'dicoding' });
      await RepliesTableTestHelper.addReply({ content: 'ipsum' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply('comment_reply-123');

      // Assert
      const comment = await RepliesTableTestHelper.findReplyById('comment_reply-123');
      expect(comment).toHaveLength(1);
      expect(comment[0].isDelete).toBe(true);
    });
  });

  describe('verifyReplyExists function', () => {
    it('should throw NotFoundError when reply not exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'ipsum' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExists('comment_reply-999'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply not exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'ipsum' });
      await RepliesTableTestHelper.addReply({ content: 'ipsum' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExists('comment_reply-123'))
        .resolves
        .not.toThrow(NotFoundError);
    });
  })

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when not owned by user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'Lorem' });
      await RepliesTableTestHelper.addReply({ content: 'dolor' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('comment_reply-123', 'user-999'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw error when reply owned by user owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'ipsum' });
      await RepliesTableTestHelper.addReply({ content: 'dolor' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('comment_reply-123', 'user-123'))
        .resolves
        .not.toThrow(AuthorizationError);
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return empty replies', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'ipsum' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replyRepository = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

      // Assert
      expect(replyRepository.length).toEqual(0);
      expect(replyRepository).toEqual([]);
    });

    it('should return replies correctly', async () => {
      // Arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'ipsum', date });
      await RepliesTableTestHelper.addReply({ content: 'dolor', date });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replyRepository = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');
      // Assert
      expect(replyRepository.length).toBe(1);
      expect(replyRepository).toEqual([
        new Reply({
          id: 'comment_reply-123',
          username: 'dicoding',
          content: 'dolor',
          date: replyRepository[0].date,
          commentId: 'comment-123',
          isDelete: 'false'
        })
      ]);

    });
  });

})
 