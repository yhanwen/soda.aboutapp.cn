
import Vue from 'vue';
import { connect, pool, disconnect } from '../../services/neo4j';
const uuid = require('uuid').v1;
const state = {
  connections: [],
  connecting: 0,
  currentConnection: null,
  nodeLabels: [],
  relationTypes: [],
  propertyKeys: [],
  loadingLabels: 0,
  loadingTypes: 0,
};

const mutations = {
  CONNECTING(state, code) {
    state.connecting = code;
  },
  ADDCONNECTION(state, connection) {
    const { user, host, port } = connection;
    connection.name = `${user}@${host}:${port}`;
    Vue.set(state.connections, state.connections.length, connection);
  },
  RESETCONNECTIONS(state) {
    state.connections.forEach((c) => {
      c.active = false;
      if (c.status === 'connected') {
        c.status = 'disconnected';
      }
    });
    state.nodeLabels = [];
    state.relationTypes = [];
    state.propertyKeys = [];
  },
  EDITCONNECTION(state, connection) {
    const {
      user, host, port, password,
    } = connection;
    connection.name = `${user}@${host}:${port}`;
    connection.status = 'disconnected';
    state.connections.forEach((c) => {
      c.active = false;
      if (c.status === 'connected') {
        c.status = 'disconnected';
      }
      if (c.id === connection.id) {
        Object.assign(c, {
          user, host, port, password,
        });
      }
    });
  },
  CONNECT(state, connection) {
    state.connections.forEach((c) => {
      if (connection.status === 'connected') {
        Vue.set(c, 'active', false);
      }
      if (c.id === connection.id) {
        Vue.set(c, 'status', connection.status);
        Vue.set(c, 'active', c.status === 'connected');
        state.currentConnection = c;
      }
    });
  },
  ACTIVECONNECTION(state, connection) {
    if (connection.status !== 'connected') {
      return;
    }
    state.connections.forEach((c) => {
      Vue.set(c, 'active', false);
      if (c.id === connection.id) {
        Vue.set(c, 'active', true);
        state.currentConnection = c;
      }
    });
  },
  DELETECONNECTION(state, connection) {
    state.connections.forEach((c, i) => {
      if (c.id === connection.id) {
        state.connections.splice(i, 1);
      }
    });
  },
  NODELABELS(state, list) {
    state.nodeLabels = list;
  },
  RELATIONTYPES(state, list) {
    state.relationTypes = list;
  },
  PROPERTYKEYS(state, list) {
    state.propertyKeys = list;
  },
  LOADINGLABELS(state, status) {
    state.loadingLabels = status ? 1 : 0;
  },
  LOADINGTYPES(state, status) {
    state.loadingTypes = status ? 1 : 0;
  },
};

const actions = {
  async addConnection({ commit, dispatch }, connection) {
    const conn = Object.assign({}, connection);
    conn.id = uuid();
    commit('ADDCONNECTION', conn);
    dispatch('connectConnection', conn);
  },
  editConnection({ commit, dispatch }, connection) {
    commit('EDITCONNECTION', Object.assign({}, connection));
    dispatch('connectConnection', connection);
  },
  async connectConnection({ commit, dispatch }, connection) {
    const conn = Object.assign({}, connection);
    if (conn.status === 'connected') {
      return;
    }
    commit('CONNECTING', 1);
    try {
      await connect({ ...conn });
      conn.status = 'connected';
      commit('CONNECTING', 0);
    } catch (e) {
      conn.status = 'failed';
      commit('CONNECTING', 2);
    }
    commit('CONNECT', conn);
    await dispatch('activeConnection', conn);
  },
  async activeConnection({ commit, dispatch }, connection) {
    commit('ACTIVECONNECTION', Object.assign({}, connection));
    dispatch('getAllNodeLabels', connection);
    dispatch('getAllPropertyKeys', connection);
    dispatch('getAllRelationTypes', connection);
    if (connection.status === 'connected') {
      await dispatch('Tabs/switchGroup', {
        groupId: connection.id,
        title: connection.name,
        component: 'schema',
        props: {
          connectionId: connection.id,
        },
      }, {
        root: true,
      });
    }
  },
  deleteConnection({ commit, dispatch }, connection) {
    disconnect(connection.id);
    commit('DELETECONNECTION', Object.assign({}, connection));
    dispatch('Tabs/removeGroup', connection.id, {
      root: true,
    });
  },
  resetAllConnections({ commit, dispatch }) {
    dispatch('Tabs/clearGroup', null, {
      root: true,
    });
    commit('RESETCONNECTIONS');
  },
  async getAllNodeLabels({ commit, state }, connection) {
    let active = false;
    state.connections.forEach((c) => {
      if (connection.id === c.id && c.active) {
        active = c;
      }
    });
    if (!active) return;
    const session = pool[connection.id];
    commit('NODELABELS', []);
    commit('LOADINGLABELS', 1);
    const nodeLabels = await session.getAllNodeLabels();
    if (!active.active) {
      return;
    }
    commit('NODELABELS', nodeLabels);
    commit('LOADINGLABELS', 0);
  },
  async getAllPropertyKeys({ commit, state }, connection) {
    let active = false;
    state.connections.forEach((c) => {
      if (connection.id === c.id && c.active) {
        active = c;
      }
    });
    if (!active) return;
    const session = pool[connection.id];
    commit('PROPERTYKEYS', []);
    const nodeLabels = await session.getAllPropertyKeys();
    if (!active.active) {
      return;
    }
    commit('PROPERTYKEYS', nodeLabels);
  },
  async getAllRelationTypes({ commit, state }, connection) {
    let active = false;
    state.connections.forEach((c) => {
      if (connection.id === c.id && c.active) {
        active = c;
      }
    });
    if (!active) return;
    const session = pool[connection.id];
    commit('RELATIONTYPES', []);
    commit('LOADINGTYPES', 1);
    const relationTypes = await session.getAllRelationTypes();
    if (!active.active) {
      return;
    }
    commit('RELATIONTYPES', relationTypes);
    commit('LOADINGTYPES', 0);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

export { pool };
