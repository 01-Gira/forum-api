const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const HttpTestHelper = require('../../../../tests/HttpTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  let server;
  let accessToken;
  let threadId;

  beforeAll(async () => {
    server = await createServer(container);
  });

  beforeEach(async () => {
    accessToken = await HttpTestHelper.getAccessToken(server);
    const addedThread = await HttpTestHelper.addThread(server, accessToken);
    threadId = addedThread.id;
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should respond with 404 when param threadId is not found', async () => {
      const payload = {
        content: 'new comment'
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-xxx/comments`,
        payload: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond with 400 when request payload is incomplete', async () => {
      const payload = {};

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond with 400 when request payload is did not meet data type specification', async () => {
      const payload = {
        content: 123,
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond with 401 when no access token is provided', async () => {
      const payload = {
        content: 'new comment',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 401 when invalid access token is provided', async () => {
      const payload = {
        content: 'new comment',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: payload,
        headers: {
          Authorization: 'Bearer invalidAccessToken',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Invalid token structure');
    });
    
    it('should respond with 201 and persisted comment', async () => {
      const payload = {
        content: 'new comment',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 404 when param thread is not found', async () => {
      const addedComment = await HttpTestHelper.addComment(server, accessToken, threadId);
      
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-xxx/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(addedComment.id);
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when param comment is not found', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comment-xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond with 401 when no access token is provided for delete', async () => {
      const addedComment = await HttpTestHelper.addComment(server, accessToken, threadId);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${addedComment.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 401 when invalid access token is provided for delete', async () => {
      const addedComment = await HttpTestHelper.addComment(server, accessToken, threadId);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${addedComment.id}`,
        headers: {
          Authorization: 'Bearer invalidAccessToken',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Invalid token structure');
    });
    
    it('should response 200 and delete comment', async () => {
      const addedComment = await HttpTestHelper.addComment(server, accessToken, threadId);
      
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(addedComment.id);
      const responseJson = JSON.parse(response.payload);
    
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(comment[0].isDelete).toBe(true);
    });
  })
})