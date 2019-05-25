

import Color from 'color';
import _ from 'lodash';
const SIZES = [0.4, 0.6, 0.8, 1, 1.4, 2, 3];
// D9F0FF  62A8AC   9BD1E5  EEE0CB  DCCFEC   DDC4DD
// D1626F   4E7E68   8CBDDF
const COLORS = [
  '#ffffff',
  '#D9F0FF',
  '#62A8AC',
  '#9BD1E5',
  '#EEE0CB',
  '#DCCFEC',
  '#DDC4DD',
  '#C39670',
  '#D1626F',
  '#4E7E68',
  '#8CBDDF',
  '#EDAB1E',
  '#EFF7F4',
];

const state = {
  labels: {},
  types: {},
  props: {},
  sizes: SIZES.slice(0),
  colors: COLORS.map(c => Color(c).saturate(0.9).rgb().string()),
  schemaOption: {},
  queryOption: {},
};

const mutations = {
  SETLABELSTYLE(state, {
    label, color, size, prop,
  }) {
    if (color) {
      state.labels[label].color = color;
    }
    if (size) {
      state.labels[label].size = size;
    }
    if (prop) {
      state.labels[label].prop = prop;
    }
  },
  SYNCNODESPROPS(state, nodes) {
    nodes.forEach((n) => {
      if (!n.labels) {
        return;
      }
      const label = n.labels.join('+');
      const props = Object.keys(n.properties || {});
      state.props[label] = state.props[label] || [];
      state.props[label] = _.uniq(state.props[label].concat(props));
    });
  },
  SYNCLABELS(state, labels) {
    state.sizes = SIZES;
    state.colors = COLORS.map(c => Color(c).saturate(2).rgb().string());
    // state.labels = {};
    let colorIndex = 0;
    labels.forEach((l) => {
      const color = state.colors[colorIndex];
      colorIndex = (colorIndex + 1) % state.colors.length;
      state.labels[l] = {
        size: SIZES[4],
        color,
        prop: state.props[l][0],
        ...state.labels[l],
      };
    });
  },
};

const actions = {
  syncLabels({ commit }, { labels, nodes }) {
    commit('SYNCNODESPROPS', nodes);
    commit('SYNCLABELS', labels);
  },
  setLabelStyle({ commit }, style) {
    commit('SETLABELSTYLE', style);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
