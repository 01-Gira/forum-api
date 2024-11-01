const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (req, h) => handler.postThreadHandler(req, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (req, h) => handler.getThreadDetailHandler(req, h)
  }
])

module.exports = routes;