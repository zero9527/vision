<template>
  <span class="number">{{ value }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Number',
  props: {
    value: {
      type: Number
    }
  }
})
</script>

<style lang="less" scoped>
.number {
  background-color: aquamarine;
}
</style>