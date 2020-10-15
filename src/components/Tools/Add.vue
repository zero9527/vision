<template>
  <div class="add" :class="className">➕</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Add',
  props: {
    className: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="less" scoped>
.add {
  display: inline-block;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: paleturquoise;
  }
}
</style>
