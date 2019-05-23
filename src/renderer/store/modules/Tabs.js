import Vue from 'vue';
const uuidv1 = require('uuid/v1');
const state = {
  groups: {
    welcome: {
      tabs: [{
        title: '欢迎使用',
        name: 'welcome',
      }],
      active: 'welcome',
    },
  },
  views: {
    welcome: {
      component: 'welcome',
      props: {},
    },
  },
  activeGroup: 'welcome',
};

const mutations = {
  ADDGROUP(state, groupId) {
    Vue.set(state.groups, groupId, state.groups[groupId] || {
      tabs: [],
      active: null,
    });
    state.activeGroup = groupId;
  },
  SWITCHTAB(state, name) {
    const group = state.groups[state.activeGroup];
    group.active = name;
  },
  REMOVETAB(state, name) {
    const group = state.groups[state.activeGroup];
    let index = 0;
    group.tabs = group.tabs.filter((g, i) => {
      if (g.name === name) {
        index = i;
        return false;
      }
      return true;
    });
    if (group.active !== name) {
      return;
    }
    if (group.tabs[index]) {
      group.active = group.tabs[index].name;
    } else if (group.tabs.length) {
      group.active = group.tabs[index - 1].name;
    } else {
      state.activeGroup = 'welcome';
    }
  },
  SWITCHGROUP(state, id) {
    if (!state.groups[id]) {
      return;
    }
    state.activeGroup = id;
  },
  CLEARGROUP(state) {
    Vue.set(state, 'groups', {
      welcome: state.groups.welcome,
    });
    Vue.set(state, 'views', {
      welcome: state.views.welcome,
    });
    state.activeGroup = 'welcome';
  },
  ADDTAB(state, tab) {
    if (!tab.name) {
      tab.name = uuidv1();
    }
    const group = state.groups[state.activeGroup];
    group.tabs.push({
      title: tab.title,
      name: tab.name,
    });
    group.active = tab.name;
    state.views[tab.name] = {
      component: tab.component,
      props: tab.props || {},
    };
  },
};

const actions = {
  removeTab({ commit }, name) {
    commit('REMOVETAB', name);
  },
  switchTab({ commit }, name) {
    commit('SWITCHTAB', name);
  },
  switchGroup({ commit, state, dispatch }, tab) {
    if (!state.groups[tab.groupId] || !state.groups[tab.groupId].tabs.length) {
      return dispatch('openNewTab', tab);
    }
    return commit('SWITCHGROUP', tab.groupId);
  },
  clearGroup({ commit }) {
    commit('CLEARGROUP');
  },
  openNewTab({
    commit,
  }, tab) {
    if (tab.groupId) {
      commit('ADDGROUP', tab.groupId);
    }
    commit('ADDTAB', tab);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
