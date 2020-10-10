<template>
  <input 
    ref="inputRef" 
    class="number" 
    type="text" 
    placeholder="数字" 
    :value="inputValue" 
    @input="onInput" 
    @change="onChange" 
  />
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { InputEvent } from '../Table/types';

export default defineComponent({
  name: 'Number',
  props: {
    value: {
      type: [Number, String]
    }
  },
  setup(props, ctx) {
    const inputRef = ref<HTMLInputElement | null>(null);
    const inputValue = ref(props.value);

    watchEffect(() => {
      console.log(inputValue.value)
    })

    const transform = (value: string) => {
      return value.replace(/\D/g, '').substr(0, 11);
    }

    const onInput = (e: InputEvent) => {
      const val = transform(e.target.value);
      if (inputRef.value) inputRef.value!.value = val;
      inputValue.value = val;
    }

    const onChange = (e: InputEvent) => {
      const val = transform(e.target.value);
      ctx.emit('valueChange', Number(val));
    }

    return {
      inputRef,
      inputValue,
      onInput,
      onChange
    }
  }
})
</script>

<style lang="less" scoped>
.number {
  width: 100%;
  padding: 8px 12px;
  border: none;
  outline: none;
}
</style>
