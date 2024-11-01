/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true
    },
    threadId: {
      type: 'VARCHAR(50)',
      references : '"threads"',
      onDelete: 'CASCADE',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      references : '"users"',
      onDelete: 'CASCADE',
      notNull: true
    },
    isDelete: {
      type: 'BOOLEAN',
      default: false
    }
  })
};

exports.down = pgm => {
  pgm.dropTable('comments');
};
