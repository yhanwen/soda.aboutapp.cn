const neo4j = require('neo4j-driver').v1;
/**
 * @class Session
 * @param {*} session
 */
const Session = class {
  constructor(session) {
    this.session = session;
    this.nodeLabels = [];
    this.relationTypes = [];
  }
  async getAllNodeLabels(refresh) {
    if (!refresh && this.nodeLabels.length) {
      return this.nodeLabels;
    }
    const res = await this.session.run('MATCH (n) RETURN distinct labels(n) as labels, count(*) as count ORDER BY count DESC');
    const { records } = res;
    const labels = {};
    records.forEach((record) => {
      const lbls = record.get('labels');
      const cnt = record.get('count') - 0;
      lbls.forEach((l) => {
        labels[l] = labels[l] || 0;
        labels[l] += cnt;
      });
    });
    this.nodeLabels = Object.keys(labels).map(l => ({ label: l, count: labels[l] }));
    return this.nodeLabels;
  }
  async getAllRelationTypes(refresh) {
    if (!refresh && this.relationTypes.length) {
      return this.relationTypes;
    }
    const res = await this.session.run('MATCH ()-[n]-() RETURN distinct type(n) as type, count(*) as count ORDER BY count DESC');
    const { records } = res;
    const types = {};
    records.forEach((record) => {
      const type = record.get('type');
      const cnt = record.get('count') - 0;
      types[type] = types[type] || 0;
      types[type] += cnt;
    });
    this.relationTypes = Object.keys(types).map(l => ({ type: l, count: types[l] }));
    return this.relationTypes;
  }
  /**
   * @function close
   */
  close() {
    return this.session.close();
  }
};

/**
 * 连接管理容器
 */
const pool = {};
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


/**
 * @function connect
 * @param {*} connection
 */
const connect = async (connection) => {
  const {
    host, port, user, password, id,
  } = connection;
  const uri = `bolt://${host}:${port}`;
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();
  await session.run('MATCH (n:a) return n LIMIT 1');
  pool[id] = new Session(session);
};

const disconnect = (id) => {
  if (pool[id]) {
    pool[id].close();
    delete pool[id];
  }
};


export default null;
export { testConnection, connect, pool, disconnect };
