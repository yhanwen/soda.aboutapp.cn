<template>
<div id="app">
  <div class="window-title">
    Soda
  </div>
  <router-view></router-view>
</div>
</template>

<script>
import 'visual-editor/lib/visualEditor.css';
export default {
  name: 'soda',
};
</script>


<style lang="less">
@import './assets/styles/vars.less';
@import './assets/styles/mixins.less';
body {
  -webkit-touch-callout: none;
  -webkit-user-select: none;  /*webkit浏览器*/
  user-select: none;
}
/* CSS */
.window-title {
  height: @titleHeight;
  background: @gray-darker;
  position: absolute;
  top:0;
  left:0;
  right: 0;
  color: @white;
  text-align: center;
  z-index: 200;
  font-size: 12px;
  color: @gray-light;
  line-height: @titleHeight;
}
</style>
