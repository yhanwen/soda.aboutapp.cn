<template>
<div class="relation-types-wrapper">
  <div class="list" v-if="relationTypes.length">
    <span class='tag' v-for="label in relationTypes" :key="label.type" @click="showTypeGraph(label.type)">{{label.type}} <em v-if="label.count">({{label.count}})</em></span>
  </div>
  <div class="empty" v-else-if="loadingTypes">
    {{$t('ui.loading')}}...
  </div>
  <div class="empty" v-else>
    {{$t('ui.empty')}}
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapState('Connections', {
      relationTypes: state => state.relationTypes,
      loadingTypes: state => state.loadingTypes,
    }),
  },
  methods: {
    ...mapActions('Tabs', ['openNewTab']),
    showTypeGraph(label) {
      this.openNewTab({
        title: `RelationType#${label}`,
        component: 'query',
        props: {
          cypher: `MATCH p=()-[:${label}]-() RETURN p LIMIT 100`,
        },
      });
    },
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
      border: solid 1px fadeout(@yellow, 40);
      background: fadeout(@yellow, 94);
      color: fadeout(@white, 20);
      cursor: pointer;
      transition: all 0.4s;
      em {
        color: fadeout(@white, 60);;
        font-style: normal;
      }
      &:hover {
        background: fadeout(@white, 94);
        border: solid 1px fadeout(@white, 40);
        color: fadeout(@white, 0);
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
