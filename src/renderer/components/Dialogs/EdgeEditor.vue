<template>
<el-dialog
  append-to-body
  class="edge-editor-wrapper"
  :title="$t('ui.edge_editor')"
  :visible="dialogVisible"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  width="30%"
  :before-close="handleClose">
  <el-form
    ref="form"
    :model="form"
    label-width="80px"
    class="form-add"
    size="mini"
    :rules="rules">
    <el-form-item :label="$t('ui.relation_types')" prop="type">
      <el-select v-model="form.type" placeholder="" filterable allow-create autocomplete>
        <el-option v-for="label in relationTypes" :key="label.type" :value="label.type">{{label.type}}</el-option>
      </el-select>
    </el-form-item>
    <el-table :data="propFields" border style="width: 100%" size="mini">
      <el-table-column prop="field" :label="$t('ui.field')">
        <template slot-scope="scope">
          <el-select  :value="scope.row.field" placeholder="" filterable allow-create autocomplete @change="handlePropFieldChange($event, scope.row)" size="mini">
            <el-option v-for="label in propertyKeys" :key="label.key" :value="label.key">{{label.key}}</el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="value" :label="$t('ui.value')">
        <template slot-scope="scope">
          <el-input :value="scope.row.value" @input="handlePropValueChange($event, scope.row)" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="value" :label="$t('ui.action')" width="50">
        <template slot-scope="scope" class="actions">
          <span class="el-icon-delete delete" @click.stop="handleDeleteItem(scope.row)" :title="$t('ui.delete')"></span>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="handleAddProp()" size="mini" type="text" icon="el-icon-plus">添加字段</el-button>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">{{$t('ui.cancel')}}</el-button>
    <el-button type="primary" @click="handleSubmit" size="mini">{{$t('ui.save')}}</el-button>
  </span>
</el-dialog>
</template>

<script>
// import _ from 'lodash';
import { mapState } from 'vuex';
import { pool } from '../../services/neo4j';
// import Vis from '../Vis';
// import CypherEditor from '../CypherEditor/index';
export default {
  props: {
  },
  components: {
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        properties: {},
      },
      propFields: [],
      rules: {
        labels: [{
          required: true,
          message: this.$t('message.input_relation_type'),
          trigger: 'submit',
        }],
      },
    };
  },
  mounted() {
  },
  computed: {
    ...mapState('Connections', {
      relationTypes: state => state.relationTypes.filter(s => s.type && s.type.trim()),
      connection: state => state.currentConnection,
      propertyKeys: state => state.propertyKeys,
    }),
    session() {
      return pool[this.connection.id];
    },
  },
  watch: {
  },
  methods: {
    handleDeleteItem(item) {
      this.propFields.forEach((o, i) => {
        if (item === o) {
          this.propFields.splice(i, 1);
        }
      });
    },
    handlePropFieldChange(field, item) {
      item.field = field;
    },
    handlePropValueChange(value, item) {
      item.value = value;
    },
    handleAddProp() {
      this.propFields.push({
        field: '',
        value: '',
      });
    },
    handleClose() {
      this.resetForm();
      this.dialogVisible = false;
    },
    async handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.propFields.filter(({ value }) => !!value).forEach(({ value, field }) => {
            this.form.properties[field] = value;
          });
          let edge = this.form;
          if (!edge.identity) {
            edge = await this.session.createEdge(edge);
          } else {
            edge = await this.session.updateEdge(edge);
          }
          this.callback(Object.assign({}, edge));
          this.resetForm();
        } else {
          return false;
        }
        return true;
      });
    },
    resetForm() {
      this.$set(this, 'form', {});
    },
    editEdge(edge, callback) {
      this.dialogVisible = true;
      this.callback = callback;
      this.$set(this, 'form', Object.assign({
        type: '',
        properties: {
        },
      }, edge));
      this.$set(this, 'propFields', Object.keys(this.form.properties).map(key => ({
        field: key,
        value: this.form.properties[key],
      })));
    },
  },
};
</script>

<style lang="less">
@import '../../assets/styles/vars.less';
@import '../../assets/styles/mixins.less';

.edge-editor-wrapper {
  .el-table {
    margin-bottom: 10px;
  }
  .cell {
    text-align: center;
  }
}
</style>
