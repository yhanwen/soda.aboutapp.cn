<template>
<div class="tab-welcome-view">
  <!-- <div class="content-wrapper">
    <div class="hd">
      <div class="logo"><img src="~@/assets/images/logo.png" alt=""></div>
      <div class="text">Soda for Neo4j</div>
    </div>
    <div class="main">
      <div class="features">
        <section>
          <h3>Connections</h3>
          <div class="list">
            <div class="item"><el-button type="text">New Connections</el-button></div>
            <div class="item"><el-button type="text">New Connections</el-button></div>
          </div>
        </section>
      </div>
    </div>
  </div> -->
</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'welcom-view',
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
  },
};
</script>

<style lang="less">
@import '../../assets/styles/vars.less';
@import '../../assets/styles/mixins.less';
.tab-welcome-view {
}
</style>
