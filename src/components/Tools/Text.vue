<template>
  <input
    class="text"
    type="text"
    placeholder="短文本"
    :defaultValue="value"
    @change="onChange"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Text',
  props: {
    value: {
      type: String,
    },
  },
  setup(props, ctx) {
    const onChange = (e: any) => {
      ctx.emit('valueChange', e.target.value);
    };

    return {
      onChange,
    };
  },
});
</script>

<style lang="less" scoped>
.text {
  width: 100%;
  padding: 8px 12px;
  border: none;
  outline: none;
}
</style>
