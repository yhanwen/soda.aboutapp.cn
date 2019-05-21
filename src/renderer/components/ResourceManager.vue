<template>
<div class="resource-manager-wrapper">
  <div class="head-title">资源管理器</div>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="连接管理" name="1">
      <connections />
    </el-collapse-item>
    <el-collapse-item title="Node Labels" name="2">
      <node-labels />
    </el-collapse-item>
    <el-collapse-item title="Relation Types" name="3">
      <relation-types />
    </el-collapse-item>
  </el-collapse>
</div>
</template>

<script>
import Connections from './Resources/Connections';
import NodeLabels from './Resources/NodeLabels';
import RelationTypes from './Resources/RelationTypes';
export default {
  components: {
    Connections,
    NodeLabels,
    RelationTypes,
  },
  data() {
    return {
      activeNames: ['1', '2', '3'],
    };
  },
  methods: {},
};
</script>

<style lang="less">
@import '../assets/styles/vars.less';
@import '../assets/styles/mixins.less';

.resource-manager-wrapper {
  @headHeight: 38px;
  @collapseHeaderHeight: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .head-title {
    height: @headHeight;
    line-height: @headHeight;
    color: @white;
    font-size: 12px;
    padding: 0 10px;
    flex: 0 0 @headHeight;
  }
  .el-collapse {
    border: 0;
    height: 100%;
    overflow: auto;
  }
  .el-collapse-item__wrap {
    background: none;
    border: 0;
  }
  .el-collapse-item__header {
    height: @collapseHeaderHeight;
    line-height: @collapseHeaderHeight;
    font-size: 12px;
    padding-left: 10px;
    background: lighten(@gray-dark, 7);
    color: @white;
    border-bottom: 0;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
    color: @white;
  }
}
</style>
