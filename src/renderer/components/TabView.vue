<template>
<div class="app-tab-wrapper">
  <el-tabs
    class="app-tab-view"
    :value="editableTabsValue"
    type="border-card"
    :closable="closable"
    @tab-click="handleSwitchTab"
    @tab-remove="handleCloseTab">
    <el-tab-pane :key="item.name" v-for="(item) in editableTabs" :label="item.title" :name="item.name">
    </el-tab-pane>
  </el-tabs>
  <div class="view-wrapper">
    <div class="view" v-for="view in viewList" :key="view.id" :class="{show: view.active}">
      <component :is="view.component" v-bind="view.props"></component>
    </div>
  </div>
</div>
</template>

<script>
import {
  mapActions,
  mapState,
} from 'vuex';
import WelcomeView from './TabViews/WelcomeView';
import SchemaView from './TabViews/SchemaView';
const views = {
  welcome: WelcomeView,
  schema: SchemaView,
};
export default {
  data() {
    return {
      tabIndex: 1,
    };
  },
  computed: {
    ...mapState('Tabs', {
      editableTabs: (state) => {
        const group = state.groups[state.activeGroup];
        return group.tabs;
      },
      editableTabsValue: (state) => {
        const group = state.groups[state.activeGroup];
        return group.active;
      },
      viewList: (state) => {
        const acitveId = state.groups[state.activeGroup].active;
        return Object.keys(state.views).map(v => ({
          id: v,
          active: acitveId === v,
          ...state.views[v],
          component: views[state.views[v].component],
        }));
      },
      currentView: (state) => {
        const group = state.groups[state.activeGroup];
        const viewInfo = state.views[group.active];
        return {
          component: views[viewInfo.component],
          props: viewInfo.props,
        };
      },
      closable: (state) => {
        const group = state.groups[state.activeGroup];
        return state.activeGroup !== 'welcome' || group.tabs.length > 1;
      },
    }),
  },
  methods: {
    ...mapActions('Tabs', ['switchTab', 'removeTab']),
    handleSwitchTab({
      $props: props,
    }) {
      this.switchTab(props.name);
    },
    handleCloseTab(name) {
      this.removeTab(name);
    },
  },
};
</script>

<style lang="less">
@import '../assets/styles/vars.less';
@import '../assets/styles/mixins.less';

.app-tab-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .app-tab-view {
    &.el-tabs--border-card {
      background: none;
      border: 0;
      box-shadow: none;
      flex: 0 0 38px;
      overflow: hidden;

      .el-tabs__header {
        overflow-x: auto;
        background-color: lighten(@gray-dark, 3);
        border-bottom: 0;

        .el-tabs__item {
          padding-right: 27px !important;
          padding-left: 15px !important;
          border-right-color: @gray-dark;
          border-left-color: @gray-dark;
          font-size: 12px;
        }

        .el-tabs__item .el-icon-close {
          transition: none;
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translate(0, -47%);
          color: fadeout(@white, 50);
          font-weight: 600;
          visibility: hidden;
        }

        .el-tabs__item .el-icon-close:hover {
          background-color: transparent;
          color: @white;
        }

        .el-tabs__item:not(.is-disabled):hover {
          color: @white;

          .el-icon-close {
            visibility: visible;
          }
        }

        .el-tabs__item.is-active {
          background: @gray-dark;
          color: @white;
          border-right-color: @gray-dark;
          border-left-color: @gray-dark;

          .el-icon-close {
            visibility: visible;
          }
        }
      }

      .el-tabs__content {
        display: none;
      }
    }
  }
  .view-wrapper {
    height: 100%;
    position: relative;
    .view {
      visibility: hidden;
      &.show {
        visibility: visible;
      }
    }
  }
}
</style>
