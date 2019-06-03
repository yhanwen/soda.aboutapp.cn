<template>
<div class="tab-schema-view">
  <div class="graph">
    <vis ref="vis" />
  </div>
  <!-- <div class="content-wrapper">
    <div class="hd">
      <div class="logo"><img src="~@/assets/images/logo.png" alt=""></div>
      <div class="text">Soda for Neo4j</div>
    </div>
    <div class="main">
      <div class="features">
        <section>
          <h3>Connections</h3>
          <div class="list">
            <div class="item"><el-button type="text">New Connections</el-button></div>
            <div class="item"><el-button type="text">New Connections</el-button></div>
          </div>
        </section>
      </div>
    </div>
  </div> -->
</div>
</template>

<script>
import { mapActions } from 'vuex';
import { pool } from '../../services/neo4j';
import Vis from '../Vis';
export default {
  name: 'schema-view',
  props: {
    connectionId: {
      default: '',
    },
  },
  components: { Vis },
  data() {
    return {
      loading: true,
    };
  },
  async mounted() {
    const graph = await this.session.getGraphByCypher('call db.schema()');
    this.$refs.vis.setDataSet(graph);
  },
  computed: {
    session() {
      return pool[this.connectionId];
    },
  },
  methods: {
    ...mapActions('Tabs', ['openNewTab']),
  },
};
</script>

<style lang="less">
@import '../../assets/styles/vars.less';
@import '../../assets/styles/mixins.less';
.tab-schema-view {
}
</style>
