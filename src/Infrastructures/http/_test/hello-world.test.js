const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/hello-world endpoint', () => {

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when GET /hello-world', () => {
    it('should respond with 200 and hello world', async () => {

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/hello-world`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.value).toEqual('Hello World');
    });
  });
})