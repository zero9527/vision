<template>
  <a-select
    mode="multiple"
    v-model:value="selectValue"
    style="width: 100%;"
    placeholder="Please select"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    @change="onChange"
  >
    <a-select-option v-for="opt in selectList" :key="opt.value">
      {{ opt.value }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { InputEvent, SelectEvent } from '../Table/types';
import { Select } from 'ant-design-vue';
import { usePropsValue } from '/@/hooks';

export default defineComponent({
  name: 'Select',
  components: {
    ASelect: Select,
    ASelectOption: Select.Option
  },
  props: {
    value: {
      type: Array as PropType<String[]>,
      default: ''
    }
  },
  setup(props, ctx) {
    const selectValue = usePropsValue(props.value);

    const selectList = ref([
      { value: '跑步', label: '跑步' },
      { value: '篮球', label: '篮球' },
      { value: '游泳', label: '游泳' },
      { value: '爬山', label: '爬山' },
    ]);

    const onChange = (value: string) => {
      ctx.emit('valueChange', value);
    }

    return {
      selectValue,
      selectList,
      onChange
    };
  },
})
</script>

<style lang="less" scoped>
.select {
  width: 100%;
  padding: 8px 12px;
  border: none;
  outline: none;
}
</style>