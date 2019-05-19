<template>
<div class="vis-wrapper" ref="container">

</div>
</template>

<script>
import vis from 'vis';
let networkInst = null;
export default {
  props: {
    options: {
      default() {
        return {
          nodes: {
            shape: 'dot',
            font: {
              color: '#fff',
              strokeWidth: 2,
              strokeColor: '#333',
              size: 12,
            },
          },
          edges: {
            arrows: {
              to: { enabled: true },
            },
            font: {
              color: '#fff',
              strokeColor: '#333',
              size: 20,
            },
          },
        };
      },
    },
  },
  data() {
    return {
      nodes: null,
      edges: null,
    };
  },
  async mounted() {
    this.initNetwork();
  },
  computed: {
  },
  methods: {
    initNetwork() {
      networkInst = new vis.Network(this.$refs.container, {
        nodes: [],
        edges: [],
      }, this.options);
    },
    setDataSet({ nodes, edges }) {
      networkInst.setData({
        nodes,
        edges,
      });
    },
  },
};
</script>

<style lang="less">
.vis-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
