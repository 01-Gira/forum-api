/* eslint-disable camelcase */


exports.up = pgm => {
  pgm.createTable('threads', {
    id: {
      type : 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(120)',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      references : '"users"',
      onDelete: 'CASCADE',
      notNull: true
    }
  })
};

exports.down = pgm => {
  pgm.dropTable('threads')
};
