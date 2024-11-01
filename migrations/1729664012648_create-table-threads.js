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
      notNull: true,
      default: pgm.func('current_timestamp'),
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
