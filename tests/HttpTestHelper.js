const HttpTestHelper = {
  async getAccessToken(server) {
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    const { accessToken } = response.result.data;
    return accessToken;
  },

  async addThread(server, accessToken) {
    const threadPayload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: threadPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { addedThread } = JSON.parse(response.payload).data;
    return addedThread;
  },

  async addComment(server, accessToken, threadId) {
    const commentPayload = {
      content: 'This is a comment',
    };

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: commentPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const { addedComment } = JSON.parse(response.payload).data;
    return addedComment;
  },

  async addReply(server, accessToken, threadId, commentId) {
    const replyPayload = {
      content: 'This is a reply',
    };

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: replyPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const { addedReply } = JSON.parse(response.payload).data;
    return addedReply;
  },
};

module.exports = HttpTestHelper;
