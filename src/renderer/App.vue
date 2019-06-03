<template>
<div id="app">
  <div class="window-title">
    {{this.title}}
  </div>
  <router-view></router-view>
</div>
</template>

<script>
import { mapState } from 'vuex';
import 'visual-editor/lib/visualEditor.css';
export default {
  name: 'Soda',
  computed: {
    ...mapState('Tabs', {
      title: (state) => {
        const group = state.groups[state.activeGroup];
        let title = 'Soda';
        if (!group) {
          return title;
        }
        group.tabs.forEach((tab) => {
          if (tab.name === group.active) {
            title = `${tab.title}-${title}`;
          }
        });
        return title;
      },
    }),
  },
};
</script>


<style lang="less">
@import './assets/styles/vars.less';
@import './assets/styles/mixins.less';
body {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
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
