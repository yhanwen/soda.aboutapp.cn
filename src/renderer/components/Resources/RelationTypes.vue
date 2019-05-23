<template>
<div class="relation-types-wrapper">
  <div class="list" v-if="relationTypes.length">
    <span class='tag' v-for="label in relationTypes" :key="label.type">{{label.type}} <em>({{label.count}})</em></span>
  </div>
  <div class="empty" v-else-if="loadingTypes">
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
      relationTypes: state => state.relationTypes,
      loadingTypes: state => state.loadingTypes,
    }),
  },
};
</script>

<style lang="less">
@import '../../assets/styles/vars.less';
@import '../../assets/styles/mixins.less';

.relation-types-wrapper {
  .list {
    padding: 10px;
    white-space: normal;
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
      em {
        color: fadeout(@gray-light, 50);;
        font-style: normal;
      }
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
