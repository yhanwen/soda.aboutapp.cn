const neo4j = require('neo4j-driver').v1;

/**
 * @function testConnection
 * @param {*} connection
 */
const testConnection = async (connection) => {
  const {
    host, port, user, password,
  } = connection;
  const uri = `bolt://${host}:${port}`;
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();
  try {
    await session.run('MATCH (n:a) return n LIMIT 1');
    return false;
  } catch (e) {
    return e;
  }
};

export default null;
export { testConnection };
