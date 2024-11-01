const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const Reply = require('../../Domains/replies/entities/Reply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, commentId, owner } = newReply;
    const id = `comment_reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comment_replies (id, content, date, "commentId", owner) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, commentId, owner]
    };

    const result = await this._pool.query(query);

    return new AddedReply(result.rows[0]);
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE comment_replies SET "isDelete" = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    const reply = result.rows[0];

    if (reply.owner !== owner) throw new AuthorizationError('anda tidak memiliki akses');
  }

  async verifyReplyExists(id) {
    const query = {
      text: 'SELECT id FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) throw new NotFoundError('balasan tidak ditemukan');
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT rs.id, rs."commentId", rs.date, rs.content, rs."isDelete"::text, us.username 
          FROM comment_replies rs
          LEFT JOIN users us ON us.id = rs.owner 
          LEFT JOIN comments cs ON cs.id = rs."commentId" 
          WHERE cs."threadId" = $1 ORDER BY rs.date ASC`,
      values: [threadId],
    };

    const results = await this._pool.query(query);

    return results.rows.map((result) => new Reply({
      id: result.id,
      username: result.username,
      date: result.date.toISOString(),
      content: result.content,
      isDelete: result.isDelete,
      commentId: result.commentId,
    }));
  }
}

module.exports = ReplyRepositoryPostgres;