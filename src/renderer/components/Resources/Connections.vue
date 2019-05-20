<template>
<div class="connections-wrapper">
  <div class="list" v-if="connections && connections.length">
    <div class="item item-add" @click="handleShowAddForm">
      <i class="status el-icon-document-add"></i>
      <span class="name">创建新连接</span>
    </div>
    <div class="item" v-for="item in connections" :class="item.status" :key="item.id">
      <i class="status el-icon-s-opportunity"></i>
      <span class="name">{{item.name}}</span>
    </div>
  </div>
  <div class="empty-add" v-else @click="handleShowAddForm">
    <i class="el-icon-document-add"></i>
    <span class="text">
      创建连接
    </span>
  </div>
  <el-form ref="form" :model="form" label-width="40px" class="form-add" size="mini" :class="{show: showAddForm}">
    <el-form-item label="主机">
      <el-input v-model="form.host" placeholder="主机IP"></el-input>
    </el-form-item>
    <el-form-item label="端口">
      <el-input v-model="form.port" placeholder="主机端口"></el-input>
    </el-form-item>
    <el-form-item label="账号">
      <el-input v-model="form.user" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="hideAddForm">取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data() {
    return {
      showAddForm: false,
      connections: [
        // {
        //   id: 1,
        //   name: 'localhost',
        //   status: 'connected',
        // },
        // {
        //   id: 2,
        //   name: '192.168.1.218',
        //   status: 'failed',
        // },
        // {
        //   id: 3,
        //   name: '192.168.1.254',
        //   status: 'disconnected',
        // },
      ],
      form: {
        host: 'localhost',
        port: '7687',
        user: '',
        password: '',
      },
    };
  },
  methods: {
    handleShowAddForm() {
      Object.assign(this.form, {
        host: 'localhost',
        port: '7687',
        user: '',
        password: '',
      });
      this.showAddForm = true;
    },
    hideAddForm() {
      this.showAddForm = false;
    },
    onSubmit() {

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

      &:hover {
        background: @gray-darker;
        cursor: pointer;
      }

      .status {
        flex: 0 0 30px;
        text-align: center;
        display: block;
        font-size: 12px;
      }

      .name {}

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
        margin-bottom: 10px;
      }
    }
  }

  .empty-add {
    text-align: center;
    padding: 50px 0 30px;
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
    padding: 20px 20px 10px;
    visibility: hidden;
    transform: translate(100%, 0);
    transition: all 0.4s;
    &.show {
      visibility: visible;
      transform: translate(0, 0);
    }
  }
}
</style>
