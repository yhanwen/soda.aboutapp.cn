<template>
<div class="connections-wrapper">
  <div class="list" v-if="connections && connections.length">
    <div class="item item-add" @click="handleShowAddForm">
      <i class="status el-icon-document-add"></i>
      <span class="name">创建新连接</span>
    </div>
    <div
      class="item"
      v-for="item in connections"
      :class="[item.status, {active: item.active}]"
      :key="item.id"
      @click="handleClickConnect(item)"
      @dblclick="handleDblclickConnect(item)">
      <div class="info">
        <i class="status el-icon-s-opportunity"></i>
        <span class="name">{{item.name}}</span>
      </div>
      <div class="actions">
        <span class="el-icon-edit-outline edit" @click.stop="handleEditItem(item)" title="编辑"></span>
        <span class="el-icon-delete delete" @click.stop="handleDeleteItem(item)" title="删除"></span>
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
    <el-form-item label="主机" prop="host">
      <el-input v-model="form.host" placeholder="主机IP"></el-input>
    </el-form-item>
    <el-form-item label="端口" prop="port">
      <el-input v-model="form.port" placeholder="主机端口"></el-input>
    </el-form-item>
    <el-form-item label="账号" prop="user">
      <el-input v-model="form.user" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">创建</el-button>
      <el-button @click="hideAddForm">取消</el-button>
      <el-button @click="handleTestConnection" type="text">测试连接</el-button>
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
          message: '请输入主机地址',
          trigger: 'submit',
        }],
        port: [{
          required: true,
          message: '请输入端口',
          trigger: 'submit',
        }],
        user: [{
          required: true,
          message: '请输入用户名',
          trigger: 'submit',
        }],
        password: [{
          required: true,
          message: '请输入密码',
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
  mounted() {
    this.resetAllConnections();
  },
  computed: {
    ...mapState('Connections', {
      connections: state => state.connections,
      connecting: state => state.connecting,
    }),
  },
  watch: {
    connecting(newVal, oldVal) {
      // if (newVal === 1) {
      //   this.$message.info('正在连接中...');
      // }
      if (newVal === 0 && oldVal === 1) {
        this.$message.success('连接成功');
      }
      if (newVal === 2 && oldVal === 1) {
        this.$message.error('连接失败');
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
      this.$confirm('此操作将永久删除该连接, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.deleteConnection(item);
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    handleTestConnection() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$refs.form.clearValidate();
          const fail = await testConnection(this.form);
          if (fail) {
            this.$message.error(`${fail}`);
          } else {
            this.$message.success('测试成功');
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
          console.log('error submit!!');
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
      font-size: 14px;
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
        flex: 0 0 26px;
        text-align: center;
        display: block;
        font-size: 12px;
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
