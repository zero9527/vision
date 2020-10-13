<template>
  <a-select
    mode="multiple"
    v-model:value="selectValue"
    style="width: 100%;"
    placeholder="Please select"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    @change="onChange"
  >
    <a-select-option v-for="name in selectList" :key="name">
      {{ name }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';
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
      default: () => []
    }
  },
  setup(props, ctx) {
    const selectValue = usePropsValue(props.value);

    const selectList = ref(['跑步', '篮球', '羽毛球', '足球', '爬山', '街舞', '单车', '跳伞']);

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