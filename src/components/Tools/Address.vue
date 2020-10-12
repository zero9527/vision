<template>
  <a-cascader
    v-model:value="selectValue"
    placeholder="Please select"
    :options="options"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    @change="onChange"
  />
</template>

<script lang="ts">
import { defineComponent, ref, toRaw, unref, watchEffect } from 'vue';
import { Cascader } from 'ant-design-vue';
import { usePropsValue } from '/@/hooks';

const address = [
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '广州市',
        label: '广州市',
        children: [
          {
            value: '天河区',
            label: '天河区',
          },
          {
            value: '白云区',
            label: '白云区',
          },
        ],
      },
    ],
  },
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '东城区',
        label: '东城区',
        children: [
          {
            value: '故宫',
            label: '故宫',
          },
        ],
      },
    ],
  },
];

export default defineComponent({
  name: 'address',
  components: {
    ACascader: Cascader,
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    const selectValue = usePropsValue(props.value);
    const options = ref(address);

    const onChange = (value: string) => {
      ctx.emit('valueChange', value);
    }

    return {
      selectValue,
      options,
      onChange
    }
  }
})
</script>
