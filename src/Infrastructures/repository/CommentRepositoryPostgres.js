const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const Comment = require('../../Domains/comments/entities/Comment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments (id, content, date, "threadId", owner) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, threadId, owner]
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET "isDelete" = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE "isDelete" = false AND id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    const comment = result.rows[0];
    if (comment.owner !== owner) throw new AuthorizationError('anda tidak memiliki akses');
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: `SELECT cs.id, us.username, cs.date, cs.content, cs."isDelete"::text
          FROM comments cs
          LEFT JOIN users us ON cs.owner = us.id 
          WHERE cs."threadId" = $1 GROUP BY cs.id, us.username ORDER BY cs.date ASC`,
      values: [id],
    };

    const results = await this._pool.query(query);

    return results.rows.map((result) => new Comment({
      id: result.id,
      username: result.username,
      date: result.date.toISOString(), // Convert Date to ISO string
      content: result.content,
      isDelete: result.isDelete, // This should already be a string
    }));
  }

  async verifyCommentExists(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('komen tidak ditemukan');
  }
}

module.exports = CommentRepositoryPostgres;