<template>
<div class="vis-tool-box">
  
  <div class="box-list">
    <div class="box-item" v-for="item in items" :key="item.action" :class="{active: value===item.action, locked: value===`${item.action}_locked`, disabled: item.disabled}" @click="handleClick(item)">
      <el-popover
        class="toolbox-popover"
        placement="right"
        :content="getActionContent(item.action)"
        :title="item.title"
        trigger="hover">
        <i :class="item.icon" slot="reference"></i>
      </el-popover>
    </div>
  </div>
</div>
</template>

<script>
// import vis from 'vis';
// import Color from 'color';
// import _ from 'lodash';
// import {
//   mapState,
//   mapActions,
// } from 'vuex';
// import { clearTimeout, setTimeout } from 'timers';
// let networkInst = null;
export default {
  props: {
    value: {
      default: '',
    },
    selected: {},
  },
  data() {
    return {
      items: [
        {
          action: 'new_node',
          title: this.$t('ui.new_node'),
          icon: 'icon-new-object',
          allowLock: true,
        },
        {
          action: 'new_edge',
          title: this.$t('ui.new_edge'),
          icon: 'icon-new-link',
          allowLock: true,
        },
        {
          action: 'edit',
          title: this.$t('ui.edit'),
          icon: 'icon-edit',
          disabled: true,
        },
        {
          action: 'remove',
          title: this.$t('ui.delete'),
          icon: 'icon-remove',
          disabled: true,
        },
      ],
    };
  },
  mounted() {
  },
  beforeDestroy() {
  },
  computed: {
  },
  watch: {
    selected({ nodes = [], edges = [] }) {
      this.items.forEach((item) => {
        const enabled = nodes.length || edges.length;
        if (item.action === 'remove' || item.action === 'edit') {
          this.$set(item, 'disabled', !enabled);
        }
      });
    },
  },
  methods: {
    cancelAdd() {
      this.$emit('change', '');
    },
    handleClick(item) {
      const { action, disabled } = item;
      if (disabled) {
        return;
      }
      if (!item.allowLock) {
        this.$emit('change', action);
        this.$emit('action', action);
        setTimeout(() => {
          this.$emit('change', '');
        }, 200);
        return;
      }
      if (this.value && this.value.indexOf(action) > -1) {
        if (this.value.indexOf('locked') > -1) {
          this.$emit('change', '');
          this.$emit('action', `cancel_${action}`);
        } else {
          this.$emit('change', `${action}_locked`);
          this.$emit('action', `lock_${action}`);
        }
      } else {
        this.$emit('change', `${action}`);
        this.$emit('action', `active_${action}`);
      }
    },
    getActionContent(action) {
      const contents = {
        new_node: {
          default: this.$t('ui.click_to_add_new_node'),
          active: this.$t('ui.click_again_to_add_nodes'),
          locked: this.$t('ui.click_to_cancel_add'),
        },
        new_edge: {
          default: this.$t('ui.click_to_add_new_edge'),
          active: this.$t('ui.click_again_to_add_edges'),
          locked: this.$t('ui.click_to_cancel_add'),
        },
        edit: {
          default: this.$t('ui.click_to_edit_selected'),
        },
        remove: {
          default: this.$t('ui.click_to_remove_selected'),
        },
      };
      const dict = contents[action];
      let result = dict.default;
      if (this.value && this.value.indexOf(action) > -1) {
        if (this.value.indexOf('locked') > -1) {
          result = dict.locked || result;
        } else {
          result = dict.active || result;
        }
      }
      return result;
    },
  },
};
</script>

<style lang="less">
@import '../../assets/styles/vars.less';
@import '../../assets/styles/mixins.less';

.vis-tool-box {
  @size: 36px;
  .box-list {

  }
  .box-item {
    position: relative;
    width: @size;
    height: @size;
    border-radius: @size;
    background: @gray-dark;
    border: solid 2px fadeout(@white, 70);
    box-shadow: 0 0 10px fadeout(@black, 50);
    box-sizing: border-box;
    padding-top: 1px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    color: fadeout(@white, 70);
    font-size: @size * 0.4;
    transition: all 0.4s;
    cursor: pointer;
    &:hover {
      background: @gray-darker;
      color: fadeout(@white, 50);
    }
    &.active {
      background: @gray-darker;
      color: fadeout(@white, 30);
      box-shadow: 0 0 10px fadeout(@white, 30);
      border-color: fadeout(@white, 50);
    }
    &.locked {
      color: fadeout(@white, 30);
      background: @gray-darker;
      border-color: fadeout(@white, 50);
      box-shadow: 0 0 20px fadeout(@yellow, 10);
    }
    &.disabled {
      color: fadeout(@white, 90);
      background: lighten(@gray-dark, 2);
      border: solid 2px fadeout(@white, 90);
      cursor: not-allowed;
    }
  }
}
</style>
