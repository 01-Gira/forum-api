const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id='comment_like-123', date='2024-10-23T07:19:09.775Z', commentId='comment-123', owner='user-123'
  }) {
    const query = {
      text: 'INSERT INTO comment_likes (id, date, "commentId", owner) VALUES($1, $2, $3, $4)',
      values: [id, date, commentId, owner]
    };

    await pool.query(query);
  },

  async findCommentLikeById(id) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [id]
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async deleteCommentLike(id, owner) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE id = $1 AND owner = $2',
      values: [id, owner]
    };

    await pool.query(query);
  },
  async cleanTable() {
		await pool.query('DELETE FROM comment_likes WHERE 1=1');
	},
}

module.exports = CommentLikesTableTestHelper;