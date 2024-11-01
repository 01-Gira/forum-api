const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: (req, h) => handler.putCommentLikeHandler(req, h),
    options: {
      auth: 'forumapi_jwt'
    }
  }
]);

module.exports = routes;