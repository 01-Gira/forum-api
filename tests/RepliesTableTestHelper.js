const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReply({
    id='comment_reply-123', content='reply content', date='2024-10-23T07:19:09.775Z', commentId='comment-123', owner='user-123'
  }) {
    const query = {
      text: 'INSERT INTO comment_replies (id, content, date, "commentId", owner) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, date, commentId, owner]
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id]
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async deleteReply(id) {
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

module.exports = RepliesTableTestHelper;