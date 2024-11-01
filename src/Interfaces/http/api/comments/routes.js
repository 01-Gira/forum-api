const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (req, h) => handler.postCommentHandler(req, h),
    options: {
      auth: 'forumapi_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (req, h) => handler.deleteCommentHandler(req, h),
    options: {
      auth: 'forumapi_jwt'
    }
  }
]);

module.exports = routes;