<template>
  <div class="virtual-list">
    <div v-for="(item, index) in renderList" :key="item.id" class="virtual-list__item">
      <slot :dataItem="item" :index="index" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';

// virtual-list
export default defineComponent({
  name: 'virtual-list',
  props: {
    dataSource: {
      type: Array,
      default: [],
    },
    startIndex: {
      type: Number,
      default: 0,
    },
    renderCount: {
      type: Number,
      default: 10,
    },
  },
  setup(props, ctx) {
    const startIndex = ref(props.startIndex);
    const renderCount = ref(props.renderCount);
    const renderList = ref<any[]>([]);

    watch(
      () => props.dataSource,
      (val) => {
        renderList.value = val.slice(startIndex.value, renderCount.value);
      },
    );

    return {
      renderList,
    };
  },
});
</script>

<style lang="less">
@import './styles.less';
</style>
