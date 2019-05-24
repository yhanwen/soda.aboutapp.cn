<template>
<div class="tab-query-view">
  <div class="input-wrapper">
    <div class="input" v-if="!isFold">
      <el-input type="textarea" v-model="cypherText" placeholder="请输入cypher..."></el-input>
    </div>
    <div class="actions">
      <div class="button-wrap">
        <el-button size="mini" v-if="!isFold">执行</el-button>
        <div class="info" :class="[info.type]">{{info.message}}</div>
      </div>
      <div class="fold el-icon-arrow-up" v-if="!isFold" @click="fold()">收起</div>
      <div class="fold el-icon-arrow-down" v-else @click="unfold()">展开</div>
    </div>
  </div>
  <div class="graph">
    <vis ref="vis" />
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import { pool } from '../../services/neo4j';
import Vis from '../Vis';
export default {
  name: 'query-view',
  props: {
    cypher: {
      default: '',
    },
  },
  components: { Vis },
  data() {
    return {
      cypherText: '',
      info: {
        type: 'normal',
        message: '未执行',
      },
      isFold: false,
    };
  },
  mounted() {
    if (this.cypher) {
      this.cypherText = this.cypher;
      this.runCypher();
      this.fold();
    }
  },
  computed: {
    ...mapState('Connections', {
      connection: state => state.currentConnection,
    }),
    session() {
      return pool[this.connection.id];
    },
  },
  methods: {
    async runCypher() {
      const res = await this.session.getGraphByCypher(this.cypherText);
      this.$refs.vis.setDataSet(res);
      this.info = {
        message: '执行成功',
        type: 'success',
      };
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
    background: @gray-dark;
    padding:10px;
    border-bottom: solid 1px darken(@gray-dark, 3);
    .input {
      margin-bottom: 10px;
      textarea {
        height: 80px;
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
      .info {
        margin-left: 15px;
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
        padding: 10px;
        cursor: pointer;
        &:before {
          margin-right: 5px;
        }
      }
    }
  }
  .graph {
    position: relative;
    height: 100%;
  }
}
</style>
