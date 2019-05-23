<template>
<div class="node-labels-wrapper">
  <div class="list" v-if="nodeLabels.length">
    <span class="tag" v-for="label in nodeLabels" :key="label.label">{{label.label}}({{label.count}})</span>
  </div>
  <div class="empty" v-else-if="loadingLabels">
    加载中...
  </div>
  <div class="empty" v-else>
    暂无数据
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
    };
  },
  methods: {},
  computed: {
    ...mapState('Connections', {
      nodeLabels: state => state.nodeLabels,
      loadingLabels: state => state.loadingLabels,
    }),
  },
};
</script>

<style lang="less">
@import '../../assets/styles/vars.less';
@import '../../assets/styles/mixins.less';

.node-labels-wrapper {
  .list {
    padding: 10px;
    .tag {
      font-size: 12px;
      margin: 0px 4px 4px 0;
      display: inline-block;
      padding: 0px 5px;
      border-radius: 3px;
      border: solid 1px @gray;
      background: fadeout(@gray-light, 94);
      color: @gray-light;
      cursor: pointer;
      transition: none !important;
      &:hover {
        color: @white;
      }
    }
  }
  .empty {
    padding: 50px 0;
    text-align: center;
    color: @gray;
    font-size: 12px;
  }
}
</style>
