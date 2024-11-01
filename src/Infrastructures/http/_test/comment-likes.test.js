const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const HttpTestHelper = require('../../../../tests/HttpTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentLikesTableHelper = require('../../../../tests/CommentLikesTableHelper');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  let server;
  let accessToken;
  let threadId;
  let commentId;

  beforeAll(async () => {
    server = await createServer(container);
  });

  beforeEach(async () => {
    accessToken = await HttpTestHelper.getAccessToken(server);
    const addedThread = await HttpTestHelper.addThread(server, accessToken);
    const addedComment = await HttpTestHelper.addComment(server, accessToken, addedThread.id);
    threadId = addedThread.id;
    commentId = addedComment.id;
  })

  afterEach(async () => {
    await CommentLikesTableHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should respond with 404 when param threadId is undefined', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/thread-xxx/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond with 404 when param commentId is undefined', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/comment-xxx/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond with 401 when no access token is provided', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 401 when invalid access token is provided', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: 'Bearer invalidAccessToken',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Invalid token structure');
    });
    
    it('should respond with 200 and add like to the comment successfully', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      console.log(responseJson);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond with 200 and remove like from the comment (unlike) successfully', async () => {
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      console.log(responseJson);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
})