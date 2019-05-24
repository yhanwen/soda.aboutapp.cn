<template>
<div class="vis-wrapper" ref="container">

</div>
</template>

<script>
import vis from 'vis';
// let networkInst = null;
export default {
  props: {
    options: {
      default() {
        return {
          physics: {
            barnesHut: {
              gravitationalConstant: -5000,
              centralGravity: 0.3,
              springLength: 300,
              springConstant: 0.04,
              damping: 0.09,
              avoidOverlap: 0,
            },
          },
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
      this.networkInst = new vis.Network(this.$refs.container, {
        nodes: [],
        edges: [],
      }, this.options);
    },
    setDataSet({ nodes, edges }) {
      this.networkInst.setData({
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
