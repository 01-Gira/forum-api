const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads (id, title, body, date, owner) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner]
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async verifyThreadExists(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('thread tidak ditemukan');
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT ts.id, ts.title, ts.body, ts.date, us.username 
          FROM threads ts
          LEFT JOIN users us ON ts.owner = us.id 
          WHERE ts.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return new Thread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      body: result.rows[0].body,
      date: result.rows[0].date.toISOString(),
      username: result.rows[0].username,
    });
  }
}

module.exports = ThreadRepositoryPostgres;