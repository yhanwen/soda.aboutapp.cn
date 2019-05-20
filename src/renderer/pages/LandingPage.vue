<template>
<div class="soda-frame-page">
  <div class="side-wrapper">
    <resource-manager />
  </div>
  <div class="main-wrapper">
    <tab-view />
  </div>
</div>
</template>

<script>
import TabView from '../components/TabView';
import ResourceManager from '../components/ResourceManager';
export default {
  name: 'landing-page',
  components: {
    TabView,
    ResourceManager,
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>

<style lang="less">
@import '../assets/styles/vars.less';
@import '../assets/styles/mixins.less';
* {
  outline-width: 0;
}
html,
body {
  width: 100%;
  height: 100%;
  position: relative;
  margin: 0;
  padding: 0;
  font-family: PingFang SC,Lantinghei SC,Helvetica Neue,Helvetica,Arial,Microsoft YaHei,"\5FAE\8F6F\96C5\9ED1",STHeitiSC-Light,simsun,"\5B8B\4F53",WenQuanYi Zen Hei,WenQuanYi Micro Hei,"sans-serif";
}

.soda-frame-page {
  padding-top: @titleHeight;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: @gray-dark;
  .side-wrapper {
    flex: 0 0 300px;
    background: lighten(@gray-dark, 2);
    -webkit-app-region: no-drag;
  }

  .main-wrapper {
    width: 100%;
    position: relative;
    -webkit-app-region: no-drag;
  }
}
</style>
