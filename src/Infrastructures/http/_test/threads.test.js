const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const HttpTestHelper = require('../../../../tests/HttpTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');


describe('/threads endpoint', () => {
  let server;
  let accessToken;

  beforeAll(async () => {
    server = await createServer(container);
  });

  beforeEach(async () => {
    accessToken = await HttpTestHelper.getAccessToken(server); // Generate token once

  })
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should respond with 400 when request payload is incomplete', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'Thread title',
        // body missing
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
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
        title: 123,
        body: {}
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads`,
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
        title: 'testing',
        body: 'testing'
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads`,
        payload: payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 401 when invalid access token is provided', async () => {
      const payload = {
        title: 'testing',
        body: 'testing'
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads`,
        payload: payload,
        headers: {
          Authorization: 'Bearer invalidAccessToken',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Invalid token structure');
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'Thread title',
        body: 'Thread body',
      };
    
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });
  })

  describe('when GET /threads/{threadId}', () => {
    it('should respond with 404 when request params is not found', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/threads/thread-xxx`,
      });
    
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 201 and persisted thread', async () => {
      const addedThread = await HttpTestHelper.addThread(server, accessToken);
      const addedComment = await HttpTestHelper.addComment(server, accessToken, addedThread.id);
      await HttpTestHelper.addReply(server, accessToken, addedThread.id, addedComment.id);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toBeDefined();
      expect(responseJson.data.thread.title).toBeDefined();
      expect(responseJson.data.thread.body).toBeDefined();
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments.length).toBe(1);
      expect(responseJson.data.thread.comments[0].content).toBe('This is a comment');
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[0].content).toBe('This is a reply');
    });
  })
})