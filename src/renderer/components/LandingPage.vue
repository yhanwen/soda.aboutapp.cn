<template>
  <div class="soda-home">
    <draw />
  </div>
</template>

<script>
  import Draw from 'visual-editor';

  export default {
    name: 'landing-page',
    components: { Draw },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
    },
  };
</script>

<style lang="less">
  @import '../assets/styles/vars.less';
  @import '../assets/styles/mixins.less';
  .soda-home {
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background: @gray-light;
  }
</style>
