<template>
<div class="soda-frame-page">
  <div class="side-wrapper">
  </div>
  <div class="main-wrapper">
    <tab-view />
  </div>
</div>
</template>

<script>
import TabView from '../components/TabView';
export default {
  name: 'landing-page',
  components: {
    TabView,
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

html,
body {
  width: 100%;
  height: 100%;
  position: relative;
  margin: 0;
  padding: 0;
}

.soda-frame-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: @gray-dark;

  .side-wrapper {
    flex: 0 0 260px;
    border-right: lighten(@gray-dark, 10) solid 1px;
  }

  .main-wrapper {
    width: 100%;
    position: relative;
  }
}
</style>
