const state = {
  connections: [],
};

const mutations = {
  ADDCONNECTION(state, connection) {
    const { user, host, port } = connection;
    connection.name = `${user}@${host}:${port}`;
    connection.status = 'disconnect';
    state.connections.push(connection);
  },
};

const actions = {
  addConnection({ commit }, connection) {
    commit('ADDCONNECTION', Object.assign({}, connection));
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
