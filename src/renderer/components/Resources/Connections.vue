<template>
<div class="connections-wrapper">
  <div class="list" v-if="connections && connections.length">
    <div class="item item-add" @click="handleShowAddForm">
      <i class="status el-icon-folder-add"></i>
      <span class="name">{{$t('ui.create_connection')}}</span>
    </div>
    <div
      class="item"
      v-for="item in connections"
      :class="[item.status, {active: item.active}]"
      :key="item.id"
      @click="handleClickConnect(item)"
      @dblclick="handleDblclickConnect(item)">
      <div class="info">
        <i class="status el-icon-folder" v-if="!item.active"></i>
        <i class="status el-icon-folder-opened" v-else></i>
        <span class="name">{{item.name}}</span>
      </div>
      <div class="actions">
        <span class="el-icon-edit-outline edit" @click.stop="handleEditItem(item)" :title="$t('ui.edit')"></span>
        <span class="el-icon-delete delete" @click.stop="handleDeleteItem(item)" :title="$t('ui.delete')"></span>
      </div>
    </div>
  </div>
  <div class="empty-add" v-else @click="handleShowAddForm">
    <i class="el-icon-document-add"></i>
    <span class="text">
      创建连接
    </span>
  </div>
  <el-form
    ref="form"
    :model="form"
    label-width="40px"
    class="form-add"
    size="mini"
    :rules="rules"
    :class="{show: showAddForm}">
    <el-form-item :label="$t('ui.host')" prop="host">
      <el-input v-model="form.host" :placeholder="$t('ui.host_ip')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('ui.port')" prop="port">
      <el-input v-model="form.port" :placeholder="$t('ui.port_value')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('ui.account')" prop="user">
      <el-input v-model="form.user" :placeholder="$t('ui.account_name')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('ui.password')" prop="password">
      <el-input v-model="form.password" type="password" :placeholder="$t('ui.password')"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" v-if="!form.id">{{$t('ui.create')}}</el-button>
      <el-button type="primary" @click="onSubmit" v-if="form.id">{{$t('ui.change')}}</el-button>
      <el-button @click="hideAddForm">{{$t('ui.cancel')}}</el-button>
      <el-button @click="handleTestConnection" type="text">{{$t('ui.test_connection')}}</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  mapActions,
  mapState,
} from 'vuex';
import { testConnection } from '../../services/neo4j';
export default {
  data() {
    return {
      showAddForm: false,
      rules: {
        host: [{
          required: true,
          message: this.$t('message.input_host'),
          trigger: 'submit',
        }],
        port: [{
          required: true,
          message: this.$t('message.input_port'),
          trigger: 'submit',
        }],
        user: [{
          required: true,
          message: this.$t('message.input_account'),
          trigger: 'submit',
        }],
        password: [{
          required: true,
          message: this.$t('message.input_password'),
          trigger: 'submit',
        }],
      },
      form: {
        host: 'localhost',
        port: '7687',
        user: '',
        password: '',
      },
    };
  },
  created() {
    this.resetAllConnections();
    this.openNewTab({
      title: this.$t('ui.welcome'),
      component: 'welcome',
    });
  },
  computed: {
    ...mapState('Connections', {
      connections: state => state.connections,
      connecting: state => state.connecting,
    }),
  },
  watch: {
    connecting(newVal, oldVal) {
      if (newVal === 0 && oldVal === 1) {
        this.$notify({
          title: this.$t('ui.success'),
          message: this.$t('message.success_connect'),
          type: 'success',
        });
      }
      if (newVal === 2 && oldVal === 1) {
        this.$notify({
          title: this.$t('ui.fail'),
          message: this.$t('message.fail_connect'),
          type: 'error',
        });
      }
    },
  },
  methods: {
    ...mapActions('Connections', [
      'addConnection',
      'editConnection',
      'connectConnection',
      'deleteConnection',
      'activeConnection',
      'resetAllConnections',
    ]),
    ...mapActions('Tabs', [
      'openNewTab',
    ]),
    resetForm() {
      this.$refs.form.clearValidate();
      this.form = Object.assign({}, {
        host: 'localhost',
        port: '7687',
        user: '',
        password: '',
      });
    },
    getConnection(id) {
      let conn;
      this.connections.forEach((c) => {
        if (c.id === id) {
          conn = c;
        }
      });
      return conn;
    },
    async handleDblclickConnect(item) {
      this.connectConnection(item);
    },
    handleClickConnect(item) {
      this.activeConnection(item);
    },
    handleShowAddForm() {
      this.showAddForm = true;
    },
    hideAddForm() {
      this.resetForm();
      this.showAddForm = false;
    },
    handleEditItem(item) {
      Object.assign(this.form, {
        ...item,
      });
      this.showAddForm = true;
    },
    handleDeleteItem(item) {
      this.$confirm(this.$t('message.confirm_delete_connection'), this.$t('ui.tip'), {
        confirmButtonText: this.$t('ui.confirm'),
        cancelButtonText: this.$t('ui.cancel'),
        type: 'warning',
        center: true,
      }).then(() => {
        this.deleteConnection(item);
        this.$notify({
          title: this.$t('ui.success'),
          message: this.$t('message.success_test'),
          type: 'success',
        });
      }).catch(() => {
        this.$notify({
          title: this.$t('ui.info'),
          message: this.$t('message.cancel_delete'),
          type: 'info',
        });
      });
    },
    handleTestConnection() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$refs.form.clearValidate();
          const fail = await testConnection(this.form);
          if (fail) {
            this.$notify.error({
              title: this.$t('ui.error'),
              message: `${fail}`,
            });
          } else {
            this.$notify.success({
              title: this.$t('ui.success'),
              message: this.$t('message.success_test'),
            });
          }
        } else {
          return false;
        }
        return true;
      });
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.form.clearValidate();
          if (this.form.id) {
            this.editConnection(this.form);
          } else {
            this.addConnection(this.form);
          }
          this.hideAddForm();
        } else {
          return false;
        }
        return true;
      });
    },
  },
};
</script>

<style lang="less">
@import '../../assets/styles/vars.less';
@import '../../assets/styles/mixins.less';

.connections-wrapper {
  @formHeight: 260px;
  position: relative;
  min-height: @formHeight;

  .list {
    padding: 10px 5px;

    .item {
      font-size: 12px;
      height: 30px;
      align-items: center;
      display: flex;
      padding: 0 10px;
      color: @gray-light;
      justify-content: space-between;
      cursor: pointer;

      &:hover {
        background: lighten(@gray-dark, 4);
      }

      &.active {
        background: @gray-darker;
      }

      .info,
      .actions {
        display: flex;
        align-items: center;
      }

      .status {
        flex: 0 0 23px;
        text-align: left;
        display: block;
        font-size: 14px;
      }

      .delete {
        color: @gray;
      }

      &:hover {
        .delete {
          color: @gray-light;

          &:hover {
            color: @red;
          }
        }
      }

      .edit {
        margin-right: 5px;
        color: @gray;
      }

      &:hover {
        .edit {
          color: @gray-light;

          &:hover {
            color: @blue;
          }
        }
      }

      .active {
        &:before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: @gray;
        }

        &.show:before {
          background: @green;
        }
      }

      &.connected {
        .status {
          color: @green;
        }

        .name {
          color: @white;
        }
      }

      &.failed {
        .status {
          color: @red;
        }

        .name {
          color: darken(@red, 20);
        }
      }

      &.item-add {
        justify-content: start;
        margin-bottom: 10px;
      }
    }
  }

  .empty-add {
    text-align: center;
    padding: 70px 0 0px;
    color: @gray-light;
    transition: all 0.4s;
    cursor: pointer;

    &:hover {
      color: @white;
    }

    i {
      font-size: 40px;
      display: block;
      margin-bottom: 10px;
    }

    .text {}
  }

  .form-add {
    min-height: @formHeight;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: lighten(@gray-dark, 1);
    z-index: 100;
    padding: 20px 17px 10px;
    visibility: hidden;
    transform: translate(100%, 0);
    transition: all 0.4s;

    .el-form-item__label {
      &:before {
        display: none;
      }
    }

    &.show {
      visibility: visible;
      transform: translate(0, 0);
    }
  }
}
</style>
