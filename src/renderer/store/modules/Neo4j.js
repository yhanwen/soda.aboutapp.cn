const neo4j = require('neo4j-driver').v1;
const uri = 'bolt://127.0.0.1:7687';
const user = 'neo4j';
const password = '123123';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

const runCypher = async (...args) => session.run(...args).catch(() => ({ records: [] }));

const state = {
  list: [],
  allSchemas: {
    nodes: [],
    links: [],
  },
};

const mutations = {
  LIST(state, list) {
    state.list = list;
  },
  SETSCHEMAS(state, allSchemas) {
    state.allSchemas = allSchemas;
  },
};

const actions = {
  async getAllSchema({ commit }) {
    commit('SETSCHEMAS', {});
    const [types, labels] = await Promise.all([
      runCypher('MATCH (m)-[r]->(n) RETURN DISTINCT labels(m) as m, type(r) as r, labels(n) as n, count(*) AS count ORDER BY count DESC'),
      runCypher('MATCH (m) RETURN DISTINCT labels(m) as m, count(*) AS count ORDER BY count DESC'),
    ]);
    const nodes = labels.records.map(label => ({
      id: label.get('m').join(','),
      label: label.get('m').join(','),
      value: label.get('count') - 0,
      model: {},
    }));

    const edges = types.records.map(type => ({
      from: type.get('m').join(','),
      to: type.get('n').join(','),
      label: type.get('r'),
      value: type.get('count') - 0,
    }));

    const allSchemas = {
      edges,
      nodes,
    };
    commit('SETSCHEMAS', allSchemas);
  },
  async runCypher({ commit }, cypher) {
    const res = await session.run(cypher);
    const list = res.records.map(r => r.get('n').properties);
    commit('LIST', list);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
