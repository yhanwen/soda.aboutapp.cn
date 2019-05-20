<template>
<div class="tab-welcome-view">
  Welcome! {{this.date}} <el-button @click="handleOpenTab" size="mini">开新tab</el-button>
</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    date: {
      default: 'aaa',
    },
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
    ...mapActions('Tabs', ['openNewTab']),
    handleOpenTab() {
      this.openNewTab({
        title: '欢迎使用1',
        component: 'welcome',
        props: {
          date: +new Date(),
        },
      });
    },
  },
};
</script>

<style lang="less">
@import '../../assets/styles/vars.less';
@import '../../assets/styles/mixins.less';
.tab-welcome-view {
}
</style>
