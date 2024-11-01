const Comment = require('../../../comments/entities/Comment');
const Reply = require('../../../replies/entities/Reply');
const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      thread: {
        id: 'thread-123',
        title: 'Lorem',
        body: 'lorem ipsum sit dolor',
        date: new Date().toISOString(),
        username: 'dicoding',
      },
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: {
        id: 'thread-123',
        title: 'Lorem',
        body: 'lorem ipsum sit dolor',
        date: new Date().toISOString(),
        username: 'dicoding',
      },
      comments: 'this is comment',
      replies: [],
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread entities correctly', () => {
    // Arrange
    const date = new Date().toISOString();
    const payload = {
      thread: {
        id: 'thread-123',
        title: 'Lorem',
        body: 'lorem ipsum sit dolor',
        date,
        username: 'dicoding',
      },
      comments: [
        new Comment({
          id: 'comment-123',
          username: 'dicoding',
          date,
          content: 'ipsum',
          isDelete: 'false',
          likeCount: 1
        }),
      ],
      replies: [
        new Reply({
          id: 'comment_reply-123',
          username: 'dicoding',
          date,
          content: 'dolor',
          isDelete: 'false',
          commentId: 'comment-123',
        }),
      ],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread.thread.id).toBe(payload.thread.id);
    expect(detailThread.thread.title).toBe(payload.thread.title);
    expect(detailThread.thread.body).toBe(payload.thread.body);
    expect(detailThread.thread.date).toBe(payload.thread.date);
    expect(detailThread.thread.username).toBe(payload.thread.username);
    expect(detailThread.thread.comments).toEqual([
      {
        id: 'comment-123',
        username: 'dicoding',
        date,
        content: 'ipsum',
        likeCount: 1,
        replies: [
          {
            id: 'comment_reply-123',
            username: 'dicoding',
            date,
            content: 'dolor',
          },
        ]
      },
    ]);
    expect(detailThread.thread.comments[0].replies).toEqual([
      {
        id: 'comment_reply-123',
        username: 'dicoding',
        date,
        content: 'dolor',
      },
    ]);
  });
});