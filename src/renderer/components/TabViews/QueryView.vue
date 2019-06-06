<template>
<div class="tab-query-view">
  <div class="input-wrapper">
    <div class="input" v-if="!isFold">
      <cypher-editor :value="cypherText" @change="setCypherText" :db-schema="dbSchema" />
    </div>
    <div class="actions">
      <div class="button-wrap">
        <el-button class="button" type="primary" size="mini" v-if="!isFold" @click="runCypher">{{$t('ui.excute')}}</el-button>
        <div class="info" :class="[info.type]">{{info.message}}</div>
      </div>
      <div class="view-switch">
        <el-radio-group v-model="currentView" size="mini">
          <el-radio-button label="graph">{{$t('ui.graph')}}</el-radio-button>
          <el-radio-button label="nodes">{{$t('ui.nodes')}}</el-radio-button>
          <el-radio-button label="relations">{{$t('ui.relations')}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="fold el-icon-arrow-up" v-if="!isFold" @click="fold()">{{$t('ui.fold')}}</div>
      <div class="fold el-icon-arrow-down" v-else @click="unfold()">{{$t('ui.unfold')}}</div>
    </div>
  </div>
  <div class="view-wrapper" v-loading="loading">
    <div class="graph" :class="{show: currentView=='graph'}">
      <vis ref="vis" :toolbox="true" 
        @remove="handleRemove"
        @editNode="handleEditNode"
        @editEdge="handleEditEdge" 
        @addNode="handleAddNode" 
        @addEdge="handleAddEdge" />
    </div>
    <div class="table-view" :class="{show: currentView=='nodes'}">
      <div class="empty" v-if="!nodesData.length">
        {{$t('ui.empty')}}
      </div>
      <el-table :data="nodesData" border style="width: 100%" v-if="nodesData.length" size="mini" height="100%">
        <el-table-column :prop="field" :label="field" v-for="field in nodeFields" :key="field" sortable>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-view" :class="{show: currentView=='relations'}">
      <div class="empty" v-if="!relationsData.length">
        {{$t('ui.empty')}}
      </div>
      <el-table :data="relationsData" border style="width: 100%" v-if="relationsData.length" size="mini" height="100%">
        <el-table-column :prop="field" :label="field" v-for="field in relationFields" :key="field" sortable>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <node-editor ref="nodeEditor" />
  <edge-editor ref="edgeEditor" />
</div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import { pool } from '../../services/neo4j';
import Vis from '../Vis';
import CypherEditor from '../CypherEditor/index';
import NodeEditor from '../Dialogs/NodeEditor';
import EdgeEditor from '../Dialogs/EdgeEditor';
export default {
  name: 'query-view',
  props: {
    cypher: {
      default: '',
    },
  },
  components: {
    Vis,
    CypherEditor,
    NodeEditor,
    EdgeEditor,
  },
  data() {
    return {
      cypherText: '',
      info: {
        type: 'normal',
        message: this.$t('message.not_excute'),
      },
      isFold: false,
      loading: false,
      currentView: 'graph',
      data: {
        nodes: [],
        edges: [],
      },
    };
  },
  mounted() {
    if (this.cypher) {
      this.cypherText = this.cypher;
      this.runCypher();
      this.fold();
    }
    this.nodeEditor = this.$refs.nodeEditor;
    this.edgeEditor = this.$refs.edgeEditor;
  },
  computed: {
    ...mapState('Connections', {
      dbSchema: state => ({
        labels: state.nodeLabels.map(l => `:${l.label}`),
        relationshipTypes: state.relationTypes.map(l => `:${l.type}`),
        propertyKeys: state.propertyKeys.map(l => `${l.key}`),
      }),
      connection: state => state.currentConnection,
    }),
    session() {
      return pool[this.connection.id];
    },
    nodeFields() {
      let result = [];
      result.push('id');
      result.push('labels');
      this.data.nodes.forEach((n) => {
        result = result.concat(Object.keys(n.properties || {}));
      });
      return _.uniq(result);
    },
    relationFields() {
      let result = [];
      result.push('id');
      result.push('type');
      result.push('from');
      result.push('to');
      this.data.edges.forEach((n) => {
        result = result.concat(Object.keys(n.properties || {}));
      });
      return _.uniq(result);
    },
    nodesData() {
      const list = this.data.nodes.map(n => ({
        id: n.id,
        labels: n.labels.join(','),
        ...n.properties,
      }));
      return list;
    },
    relationsData() {
      const list = this.data.edges.map(n => ({
        id: n.id,
        type: n.type,
        from: n.from,
        to: n.to,
        ...n.properties,
      }));
      return list;
    },
  },
  methods: {
    handleEditNode({ data, callback }) {
      this.nodeEditor.editNode(data, callback);
    },
    handleEditEdge({ data, callback }) {
      this.edgeEditor.editEdge(data, callback);
    },
    handleAddNode({ data, callback }) {
      this.nodeEditor.editNode(data, callback);
    },
    handleAddEdge({ data, callback }) {
      this.edgeEditor.editEdge(data, callback);
    },
    // handleRemove() {},
    handleRemove({ data: { nodes = [], edges = [] }, callback }) {
      this.$confirm(this.$t('message.confirm_delete_remote_data'), this.$t('ui.confirm'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('ui.delete_remote_data'),
        cancelButtonText: this.$t('ui.delete_local_data_only'),
      })
        .then(async () => {
          await this.session.removeNodes(nodes);
          await this.session.removeEdges(edges);
          const nodesLen = nodes.length;
          const edgesLen = edges.length;
          callback();
          this.$notify({
            title: this.$t('ui.success'),
            message: this.$t('message.success_delete_affect_count')
              .replace('{{nodesCount}}', nodesLen)
              .replace('{{edgesCount}}', edgesLen),
            type: 'success',
          });
        })
        .catch((action) => {
          if (action === 'cancel') {
            callback();
            this.$notify({
              title: this.$t('ui.success'),
              message: this.$t('message.success_delete'),
              type: 'success',
            });
          }
          if (action === 'close') {
            this.$notify({
              title: this.$t('ui.info'),
              message: this.$t('message.cancel_delete'),
              type: 'info',
            });
          }
        });
    },
    setCypherText(val) {
      this.cypherText = val;
    },
    async runCypher() {
      if (!this.cypherText.trim()) {
        alert(this.$t('message.please_input_cypher'));
        return;
      }
      if (this.cypherText.toLowerCase().match(/(create|delete|set|merge)(\s|$)/)) {
        alert(this.$t('message.support_query_only'));
        return;
      }
      this.loading = true;
      const res = await this.session.getGraphByCypher(this.cypherText);
      this.$refs.vis.setDataSet(res);
      this.data = Object.assign({}, res);
      this.info = {
        message: this.$t('message.success_excute'),
        type: 'success',
      };
      this.currentView = 'graph';
      this.loading = false;
    },
    fold() {
      this.isFold = true;
    },
    unfold() {
      this.isFold = false;
    },
  },
};
</script>

<style lang="less">
@import '../../assets/styles/vars.less';
@import '../../assets/styles/mixins.less';

.tab-query-view {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;

  .input-wrapper {
    flex: 0 0 0;
    background: lighten(@gray-dark, 0);
    padding: 8px;
    border-bottom: solid 1px darken(@gray-dark, 3);

    .input {
      margin-bottom: 5px;

      textarea {
        height: 80px;
      }
    }

    .view-switch {
      .el-radio-button__inner {
        background: lighten(@gray-dark, 2);
      }

      .el-radio-button__inner:hover {
        color: @white;
      }

      .is-active .el-radio-button__inner {
        color: #222;
        background: @gray-light;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .button-wrap {
        display: flex;
        align-items: center;
      }

      .button {
        margin-right: 15px;
      }

      .info {
        font-size: 12px;
        color: @gray;

        &.error {
          color: @red;
        }

        &.success {
          color: @green;
        }
      }

      .fold {
        color: @white;
        font-size: 12px;
        padding: 5px 10px;
        cursor: pointer;

        &:before {
          margin-right: 5px;
        }
      }
    }
  }

  .view-wrapper {
    height: 100%;
    position: relative;
    .el-loading-mask {
      background: fadeout(@black, 10);
    }
  }

  .graph, .table-view {
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom: 0;
    visibility: hidden;
    opacity: 0;
    transition: all 0.4s;
    z-index: 0;
    .empty {
      color: @gray;
      padding: 100px 0 0;
      text-align: center;
      font-size: 13px;
    }
    &.show {
      visibility: visible;
      opacity: 1;
      z-index: 10;
    }
  }
  .table-view {
    overflow: auto;
    .table-common();
  }
}
</style>
