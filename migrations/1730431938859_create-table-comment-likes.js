exports.up = pgm => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
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
    }
  })
};

exports.down = pgm => {
  pgm.dropTable('comment_likes');
};
