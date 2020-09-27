<template>
  <span class="date">{{ value }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Date',
  props: {
    value: {
      type: String
    }
  }
})
</script>

<style lang="less" scoped>
.date {
  background-color: paleturquoise;
}
</style>