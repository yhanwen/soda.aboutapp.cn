<template>
<div class="vis-wrapper">
  <div class="toolbar" v-if="labels.length">
    <div class="labels" :class="{hover: hoverNodeItem && hoverNodeItem.tag}">
      <el-popover v-for="tag in labels" :key="tag" placement="bottom" width="210" trigger="click">
        <div class="vis-node-style-editor">
          <section>
            <span class="label">{{$t('ui.color')}}</span>
            <div class="options">
              <span class="color-option" :style="{backgroundColor: color}" :class="labelStyles[tag].color === color ? 'active' : ''" v-for="color in colorOptions" :title="color" @click="setLabelStyleWrapper({label: tag, color})" :key="color"></span>
            </div>
          </section>
          <section>
            <span class="label">{{$t('ui.size')}}</span>
            <div class="options sizes">
              <span class="size-option" :style="{zoom: size}" :class="labelStyles[tag].size === size ? 'active' : ''" v-for="size in sizeOptions" :title="size" @click="setLabelStyleWrapper({label: tag, size})" :key="size"></span>
            </div>
          </section>
          <section>
            <span class="label">{{$t('ui.display_field')}}</span>
            <div class="options props">
              <span class="prop-option" :class="labelStyles[tag].prop === prop ? 'active' : ''" v-for="prop in propOptions[tag]" :title="prop" @click="setLabelStyleWrapper({label: tag, prop})" :key="prop">&lt; {{prop}} &gt;</span>
            </div>
          </section>
        </div>
        <span class="tag" :style="labelTagStyles[tag]" :class="{hover: hoverNodeItem && hoverNodeItem.tag===tag}" slot="reference">{{tag}}</span>
      </el-popover>

    </div>
    <div class="options"></div>
    <div class="info"></div>
  </div>
  <div class="graph-wrapper">
    <div class="vis-container" ref="container"></div>
    <div class="tool-box" :class="{show: true}" v-if="toolbox"><tool-box :value="toolBoxAction" @change="toolBoxAction=$event" @action="handleToolBoxAction" :selected="selected" /></div>
    <div class="add-ons-pop-tip" :class="{show: hoverNodeItem}">
      <div class="wrapper" v-if="hoverNodeItem">
        <div class="name">
          {{hoverNodeItem.label}}
        </div>
        <div class="model" v-if="hoverNodeItem.type">
          <span class="label">{{$t('ui.type')}}:</span>
          <span class="val">{{hoverNodeItem.type}}</span>
        </div>
        <div class="props" v-if="hoverProps.length">
          <el-table :data="hoverProps" max-height="400" border style="width: 100%" size="mini">
            <el-table-column prop="field" :label="$t('ui.field')" width="100">
            </el-table-column>
            <el-table-column prop="value" :label="$t('ui.value')" width="200">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import vis from 'vis';
import Color from 'color';
import _ from 'lodash';
import {
  mapState,
  mapActions,
} from 'vuex';
import { clearTimeout, setTimeout } from 'timers';
import ToolBox from './Vis/ToolBox';
// let networkInst = null;
export default {
  props: {
    toolbox: {
      default: false,
    },
    options: {
      default() {
        return {
          interaction: {
            hover: true,
          },
          manipulation: {
            enabled: false,
          },
          physics: {
            barnesHut: {
              gravitationalConstant: -5000,
              centralGravity: 0.3,
              springLength: 300,
              springConstant: 0.04,
              damping: 0.09,
              avoidOverlap: 0,
            },
          },
          nodes: {
            shape: 'dot',
            // chosen: {
            //   node: {

            //   },
            // },
            font: {
              color: '#fff',
              strokeWidth: 2,
              strokeColor: '#333',
              size: 24,
            },
          },
          edges: {
            arrows: {
              to: {
                enabled: true,
              },
            },
            font: {
              color: 'rgba(255, 255, 255, 0.5)',
              strokeColor: '#333',
              size: 20,
            },
          },
        };
      },
    },
  },
  data() {
    return {
      nodes: [],
      edges: [],
      hoverNodeItem: null,
      dragging: false,
      toolBoxAction: null,
      selected: {},
    };
  },
  components: { ToolBox },
  async mounted() {
    this.initNetwork();
  },
  beforeDestroy() {
    this.networkInst.destroy();
  },
  computed: {
    ...mapState('Vis', {
      colorOptions: state => state.colors,
      sizeOptions: state => state.sizes,
      propOptions: state => state.props,
      labelStyles: state => state.labels,
      labelTagStyles: (state) => {
        const result = {};
        _.each(state.labels, (v, k) => {
          const {
            color,
          } = v;
          const colorInst = Color(color);
          result[k] = {
            backgroundColor: colorInst.fade(0.9),
            borderColor: colorInst.fade(0.2),
            color: colorInst.fade(0.1),
          };
        });
        return result;
      },
    }),
    hoverProps() {
      const { properties = {} } = this.hoverNodeItem;
      const result = [];
      Object.keys(properties).forEach((field) => {
        result.push({
          field,
          value: properties[field],
        });
      });
      return result;
    },
    labels: {
      cache: false,
      get() {
        let result = [];
        this.nodes.forEach((n) => {
          if (n.labels) {
            result.push(n.labels.join('+'));
          }
        });
        result = _.uniq(result);
        return result;
      },
    },
  },
  watch: {},
  methods: {
    ...mapActions('Vis', ['syncLabels', 'setLabelStyle']),
    handleToolBoxAction(action) {
      this.networkInst.disableEditMode();
      if (action === 'active_new_node') {
        this.networkInst.addNodeMode();
      }
      if (action === 'lock_new_node') {
        this.networkInst.addNodeMode();
      }
      if (action === 'cancel_new_node') {
        this.networkInst.disableEditMode();
      }
      if (action === 'active_new_edge') {
        this.networkInst.addEdgeMode();
      }
      if (action === 'lock_new_edge') {
        this.networkInst.addEdgeMode();
      }
      if (action === 'cancel_new_edge') {
        this.networkInst.disableEditMode();
      }
      if (action === 'edit') {
        this.handleEdit();
      }
      if (action === 'remove') {
        this.handleRemove();
      }
    },
    handleRemove() {
      this.$emit('remove', {
        data: this.selected,
        callback: () => {
          const { edges = [], nodes = [] } = this.selected;
          this.nodes.remove(nodes);
          this.edges.remove(edges);
          this.selected = {
            nodes: [],
            edges: [],
          };
        },
      });
    },
    handleEdit() {
      const that = this;
      const { nodes = [], edges = [] } = this.selected;
      if (nodes.length) {
        this.$emit('editNode', {
          data: that.nodes.get(nodes[0]),
          callback(data) {
            that.nodes.update(data);
            that.refreshStyle();
          },
        });
        return;
      }
      if (edges.length) {
        this.$emit('editEdge', {
          data: that.edges.get(edges[0]),
          callback({ oldEdge, newEdge }) {
            newEdge.label = newEdge.type;
            that.edges.remove(oldEdge);
            that.edges.add(newEdge);
            that.selected = {
              nodes: [],
              edges: [],
            };
          },
        });
      }
    },
    initNetwork() {
      const that = this;
      this.networkInst = new vis.Network(this.$refs.container, {
        nodes: [],
        edges: [],
      }, {
        ...this.options,
        manipulation: {
          enabled: false,
          addNode(data, callback) {
            that.$emit('addNode', {
              data,
              callback(...args) {
                callback(...args);
                that.refreshStyle();
                if (that.toolBoxAction !== 'new_node_locked') {
                  that.toolBoxAction = '';
                  that.networkInst.disableEditMode();
                } else {
                  that.networkInst.addNodeMode();
                }
              },
            });
          },
          addEdge(data, callback) {
            that.$emit('addEdge', {
              data,
              callback(edge) {
                edge.label = edge.type;
                callback(edge);
                if (that.toolBoxAction !== 'new_edge_locked') {
                  that.toolBoxAction = '';
                  that.networkInst.disableEditMode();
                } else {
                  that.networkInst.addEdgeMode();
                }
              },
            });
          },
        },
      });
      this.setDataSet({
        nodes: [],
        edges: [],
      });
      let timeout = null;

      this.networkInst.on('blurNode', () => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => { this.hoverNodeItem = null; }, 300);
      });
      // this.networkInst.on('blurEdge', () => {
      //   if (timeout) {
      //     clearTimeout(timeout);
      //   }
      //   timeout = setTimeout(() => { this.hoverNodeItem = null; }, 300);
      // });
      // this.networkInst.on('hoverNode', (event) => {
      //   if (timeout) {
      //     clearTimeout(timeout);
      //   }
      //   const {
      //     node,
      //   } = event;

      // });
      this.networkInst.on('click', (event) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        const {
          edges = [], nodes = [],
        } = event;
        this.selected = {
          ...this.selected,
          edges,
          nodes,
        };
        if (!edges.length && !nodes.length) {
          this.hoverNodeItem = null;
        }
        if (edges.length === 1 && !nodes.length) {
          const edge = edges[0];
          this.edges.forEach((n) => {
            if (n.id === edge) {
              this.hoverNodeItem = {
                label: n.label,
                type: n.type,
                properties: {
                  ...n.properties,
                },
              };
            }
          });
        }
        if (nodes.length === 1) {
          const node = nodes[0];
          this.nodes.forEach((n) => {
            if (n.id === node) {
              this.hoverNodeItem = {
                label: n.label,
                tag: n.labels.join('+'),
                type: n.labels.join(' '),
                properties: {
                  ...n.properties,
                },
              };
            }
          });
        }
      });
      this.networkInst.on('dragStart', (event) => {
        const {
          nodes = [],
        } = event;
        nodes.forEach((n) => {
          const node = this.nodes.get(n);
          this.nodes.update({
            ...node,
            x: undefined,
            y: undefined,
            physics: true,
          });
        });
        this.dragging = true;
      });
      this.networkInst.on('dragEnd', (event) => {
        const {
          nodes = [],
        } = event;
        nodes.forEach((n) => {
          const node = this.nodes.get(n);
          this.nodes.update({
            ...node,
            x: undefined,
            y: undefined,
            physics: false,
          });
        });
        this.dragging = false;
      });
      this.networkInst.on('doubleClick', (event) => {
        const {
          nodes = [],
        } = event;
        nodes.forEach((n) => {
          const node = this.nodes.get(n);
          this.nodes.update({
            ...node,
            physics: true,
          });
        });
      });
    },
    setLabelStyleWrapper(...args) {
      this.setLabelStyle(...args);
      this.refreshStyle();
    },
    refreshStyle() {
      this.syncLabels({
        labels: this.labels,
        nodes: this.nodes,
      });
      this.nodes.forEach((n) => {
        if (!n.labels) {
          return;
        }
        const label = n.labels.join('+');
        const propLabel = n.properties[this.labelStyles[label].prop];
        if (this.labelStyles[label]) {
          n.color = this.labelStyles[label].color;
          n.mass = this.labelStyles[label].size;
          n.label = propLabel && propLabel.length ? propLabel : label;
          n.size = this.labelStyles[label].size * 30;
        }
        this.nodes.update(n);
      });
      // this.networkInst.redraw();
    },
    setDataSet({
      nodes,
      edges,
    }, append) {
      if (append) {
        nodes.forEach((n) => {
          if (!this.nodes.get(n.id)) {
            this.nodes.add(n);
          }
        });
        edges.forEach((n) => {
          if (!this.edges.get(n.id)) {
            this.edges.add(n);
          }
        });
      } else {
        this.edges = new vis.DataSet(edges.map(edge => ({
          ...edge,
          label: edge.type,
        })));
        this.nodes = new vis.DataSet(nodes);
      }
      this.syncLabels({
        labels: this.labels,
        nodes,
      });
      nodes.forEach((n) => {
        if (!n.labels) {
          return;
        }
        const label = n.labels.join('+');
        const propLabel = n.properties[this.labelStyles[label].prop];
        if (this.labelStyles[label]) {
          n.color = this.labelStyles[label].color;
          n.mass = this.labelStyles[label].size;
          n.label = propLabel && propLabel.length ? propLabel : label;
          n.size = this.labelStyles[label].size * 30;
        }
        this.nodes.update(n);
      });

      this.networkInst.setData({
        nodes: this.nodes,
        edges: this.edges,
      });
    },
  },
};
</script>

<style lang="less">
@import '../assets/styles/vars.less';
@import '../assets/styles/mixins.less';

.vis-node-style-editor {
  section {
    margin-top: 20px;

    &:first-of-type {
      margin-top: 0;
    }

    .label {
      display: block;
      margin-bottom: 5px;
    }

    .options {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
  }

  .color-option {
    display: inline-block;
    width: 14px;
    height: 14px;
    overflow: hidden;
    text-align: center;
    margin: 1px 2px 1px 0;
    border: solid 1px fadeout(@white, 50);
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    transition: all 0.4s;
    box-shadow: 0 0 3px fadeout(@black, 80) inset;

    &.active {
      border-width: 2px;
      border-color: fadeout(@white, 0);
      z-index: 2;
      transform: scale(1.2);
      box-shadow: 0 0 10px fadeout(@black, 50), 0 0 3px fadeout(@black, 80) inset;
    }
  }

  .sizes {
    justify-content: space-between;
    padding-right: 4px;
  }

  .size-option {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 7px;
    overflow: hidden;
    text-align: center;
    background: @gray;
    border: solid 2px fadeout(@white, 50);
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    transition: all 0.4s;
    box-shadow: 0 0 3px fadeout(@black, 80) inset;

    &.active {
      border-width: 3px;
      border-color: fadeout(@white, 0);
      z-index: 2;
      box-shadow: 0 0 10px fadeout(@black, 50), 0 0 3px fadeout(@black, 80) inset;
    }
  }

  .prop-option {
    display: inline-block;
    white-space: nowrap;
    position: relative;
    z-index: 1;
    transition: all 0.4s;
    color: @gray;
    margin: 3px 5px 0 0;
    cursor: pointer;

    &:hover {
      color: @gray-light;
    }

    &.active {
      z-index: 2;
      color: @white;
    }
  }
}

.vis-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;

  .toolbar {
    flex: 0 0 0;

    .labels {
      padding: 5px 8px 4px;
      background: lighten(@gray-dark, 2);
      border-bottom: solid 1px darken(@gray-dark, 4);
    }

    .options,
    .info {}
  }

  .graph-wrapper {
    flex-grow: 1;
    position: relative;
  }

  .vis-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .tag {
    font-size: 12px;
    margin: 0px 4px 4px 0;
    display: inline-block;
    padding: 0px 5px;
    border-radius: 3px;
    border: solid 1px fadeout(@green, 40);
    background: fadeout(@green, 94);
    color: fadeout(@white, 20);
    cursor: pointer;
    transition: all 0.4s;
    opacity: 0.8;
    transform: scale(0.95);

    em {
      color: fadeout(@white, 60);
      font-style: normal;
    }

    &:hover {
      opacity: 1;
      transform: scale(1);
      background: fadeout(@white, 94);
      border: solid 1px fadeout(@white, 40);
      color: fadeout(@white, 0);
    }
  }
  .labels.hover .tag {
    opacity: 0.3;
    &.hover {
      opacity: 1;
      background: fadeout(@white, 94);
      border: solid 1px fadeout(@white, 40);
      color: fadeout(@white, 0);
    }
  }
  .tool-box {
    position: absolute;
    bottom: 15px;
    left: 15px;
    visibility: hidden;
    transition: all 0.4s;
    opacity: 0;
    &.show {
      visibility: visible;
      opacity: 1;
    }
  }
  .add-ons-pop-tip {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 300px;
    background: fadeout(@gray-darker, 50);
    border: solid 1px fadeout(@gray, 50);
    color: @white;
    border-radius: 4px;
    opacity: 0;
    visibility: hidden;

    &.show {
      visibility: visible;
      opacity: 1;
    }

    .wrapper {
      padding: 15px;
      font-size: 12px;
      color: @gray-light;

      .name {
        font-size: 14px;
        font-weight: 500;
        color: @white;
        margin-bottom: 5px;
      }

      .model {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .label {
        color: @gray-light;
      }

      .val {}

      .props {
        border-top: solid 1px fadeout(@gray, 50);
        margin-top: 7px;
        padding-top: 7px;
        .table-common();
      }

      .prop {
        .clearfix();
        margin-bottom: 4px;
        word-wrap: break-word;
        word-break: break-all;

      }
    }
  }
}
</style>
