<template>
  <input class="date" type="date" :value="value" @change="onChange" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Date',
  props: {
    value: {
      type: String
    }
  },
  setup(props, ctx) {
    const onChange = (e: any) => {
      ctx.emit('valueChange', e);
    }

    return {
      onChange
    }
  }
})
</script>

<style lang="less" scoped>
.date {
  width: 100%;
  padding: 8px 12px;
  border: none;
  outline: none;
}
</style>
