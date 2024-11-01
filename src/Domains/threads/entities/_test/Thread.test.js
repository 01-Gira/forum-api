const Thread = require('../Thread');

describe('a Thread entities', () => {
  it('should throw a error when payload did not contain needed property', () => {
    // Arrange 
    const payload = {
      id: 'thread-123',
      title: 'New Thread',
      body: 'Body Thread',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'New Thread',
      body: 123,
      date: [],
      username: {}
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', () => {
    // Arrange 
    const payload = {
      id: 'thread-123',
      title: 'New Thread',
      body: 'Body Thread',
      date: new Date().toISOString(),
      username: 'Dicoding'
    };

    // Action 
    const thread = new Thread(payload);

    // Assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
  })
})