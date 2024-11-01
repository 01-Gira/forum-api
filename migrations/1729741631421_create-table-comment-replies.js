/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('comment_replies', {
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
    commentId: {
      type: 'VARCHAR(50)',
      references : '"comments"',
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
  pgm.dropTable('comment_replies');
};
