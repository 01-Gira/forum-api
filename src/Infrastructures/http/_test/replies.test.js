const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const HttpTestHelper = require('../../../../tests/HttpTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('/threads/{threadId}/comments/{commentId} endpoint', () => {
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
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should respond with 404 when param threadId is undefined', async () => {
      const payload = {
        content: 'new reply'
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-xxx/comments/${commentId}/replies`,
        payload: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond with 404 when param commentId is undefined', async () => {
      const payload = {
        content: 'new reply'
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/comment-xxx/replies`,
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
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: payload,
        headers: {
          Authorization: 'Bearer invalidAccessToken',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Invalid token structure');
    });
    
    it('should respond with 201 and persisted reply', async () => {
      const payload = {
        content: 'new comment',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should respond with 404 when param thread is not found', async () => {
      const addedReply = await HttpTestHelper.addReply(server, accessToken, threadId, commentId);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-xxx/comments/${commentId}/replies/${addedReply.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond with 404 when param comment is not found', async () => {
      const addedReply = await HttpTestHelper.addReply(server, accessToken, threadId, commentId);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comment-xxx/replies/${addedReply.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond with 404 when param reply is not found', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond with 401 when no access token is provided for delete', async () => {
      const addedReply = await HttpTestHelper.addReply(server, accessToken, threadId, commentId);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${addedReply.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 401 when invalid access token is provided for delete', async () => {
      const addedReply = await HttpTestHelper.addReply(server, accessToken, threadId, commentId);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${addedReply.id}`,
        headers: {
          Authorization: 'Bearer invalidAccessToken',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Invalid token structure');
    });
    
    it('should response 200 and delete reply', async () => {
      const addedReply = await HttpTestHelper.addReply(server, accessToken, threadId, commentId);
      
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${addedReply.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const reply = await RepliesTableTestHelper.findReplyById(addedReply.id);
      const responseJson = JSON.parse(response.payload);
    
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(reply[0].isDelete).toBe(true);
    });
  })
})