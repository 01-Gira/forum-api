const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id='comment-123', content='comment content', date='2024-10-23T07:19:09.775Z', threadId='thread-123', owner='user-123'
  }) {
    const query = {
      text: 'INSERT INTO comments (id, content, date, "threadId", owner) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, date, threadId, owner]
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async deleteComment(id) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1',
      values: [id]
    };

    await pool.query(query);
  },
  async cleanTable() {
		await pool.query('DELETE FROM comments WHERE 1=1');
	},
}

module.exports = CommentsTableTestHelper;