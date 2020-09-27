<template>
  <span class="string">{{ value }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'String',
  props: {
    value: {
      type: String
    }
  }
})
</script>

<style lang="less" scoped>
.string {
  background-color: sandybrown;
}
</style>