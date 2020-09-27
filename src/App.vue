<template>
  <div id="app">
    <!-- <img src="./assets/logo.png" alt="Vue logo" /> -->
    <!-- <hello-world msg="Welcome to Your Vue.js + TypeScript App" /> -->
    <TableWrapper />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HelloWorld from '/@/components/HelloWorld.vue';
import TableWrapper from './components/Table/wrapper.vue';

export default defineComponent({
  name: 'App',
  components: {
    // HelloWorld,
    TableWrapper
  },
});
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
