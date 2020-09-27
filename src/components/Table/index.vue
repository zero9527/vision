<template>
  <div class="table">
    <t-header :columns="columns"/>
    <t-body :columns="columns" :dataSource="dataSource" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, provide, readonly, ref, watchEffect } from 'vue';
import THeader from './THeader/index.vue';
import TBody from './TBody/index.vue';
import { Table } from './types.d';

// table
export default defineComponent({
  name: 'Table',
  components: {
    THeader,
    TBody,
  },
  props: {
    height: {
      type: Number,
      default: false,
    },
    columns: {
      type: Array as PropType<Table.ColumnsItem[]>,
      default: [],
    },
    dataSource: {
      type: Array,
      default: [],
    },
  },
  setup(props, ctx) {
    const columns = ref<Table.ColumnsItem[]>([]);
    const dataSource = ref<any[]>([]);

    watchEffect(() => {
      columns.value = props.columns;
      dataSource.value = props.dataSource;
    })

    provide('columns', readonly(columns));
    provide('dataSource', readonly(dataSource));

    // 增加列
    const addColumn = (column: Table.ColumnsItem) => {
      ctx.emit('addColumn', column);
    };

    // 增加行
    const addRow = (data: any) => {
      ctx.emit('addRow');
    };

    provide('addColumn', addColumn);
    provide('addRow', addRow);
  },
});
</script>

<style lang="less">
@import './styles.less';
</style>
