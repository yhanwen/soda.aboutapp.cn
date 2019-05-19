<template>
<el-tabs class="app-tab-view" v-model="editableTabsValue" type="border-card" closable @edit="handleTabsEdit">
  <el-tab-pane :key="item.name" v-for="(item) in editableTabs" :label="item.title" :name="item.name">
    {{item.content}}
  </el-tab-pane>
</el-tabs>
</template>

<script>
export default {
  data() {
    return {
      editableTabsValue: '2',
      editableTabs: [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content',
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content',
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content',
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content',
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content',
      }],
      tabIndex: 1,
    };
  },
  methods: {
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.tabIndex += 1;
        const newTabName = `${this.tabIndex}`;
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content',
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        const tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    },
  },
};
</script>

<style lang="less">
@import '../assets/styles/vars.less';
@import '../assets/styles/mixins.less';
.app-tab-view {
  &.el-tabs--border-card {
    background: none;
    border: 0;
    box-shadow: none;
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .el-tabs__header {
      flex: 0 0 38px;
      overflow: hidden;
      overflow-x: auto;
      background-color: lighten(@gray-dark, 10);
      border-bottom:0;
      .el-tabs__item {
        padding-right: 25px !important;
        padding-left: 15px !important;
        border-right-color: lighten(@gray-dark, 7);
        border-left-color: lighten(@gray-dark, 7);
      }
      .el-tabs__item .el-icon-close {
        transition: none;
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translate(0, -50%);
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
      height: 100%;
    }
  }
}
</style>
