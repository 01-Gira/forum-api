const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentLike(newLike) {
    const { commentId, owner } = newLike;
    const id = `comment_like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comment_likes (id, "commentId", owner) VALUES ($1, $2, $3)',
      values: [id, commentId, owner]
    };

    await this._pool.query(query);
  }

  async deleteCommentLike(commentId, owner) {
    console.log(`Deleting like for commentId: ${commentId}`);
    const query = {
      text: 'DELETE FROM comment_likes WHERE "commentId" = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async verifyCommentLikeOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comment_likes WHERE "commentId" = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    const commentLike = result.rows[0];
    if (commentLike.owner !== owner) throw new AuthorizationError('anda tidak memiliki akses');
  }

  async verifyCommentLikeExists(id) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('like tidak ditemukan');
  }

  async isCommentLiked(commentId, owner) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE "commentId" = $1 AND owner = $2',
      values: [commentId, owner],
    };
  
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }
  
}

module.exports = CommentLikeRepositoryPostgres;