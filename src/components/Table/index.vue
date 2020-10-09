<template>
  <div class="table" ref="tableRef">
    <t-header :columns="columns"/>
    <t-body :columns="columns" :dataSource="dataSource" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, provide, readonly, ref, watchEffect } from 'vue';
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
    const tableRef = ref<HTMLElement | null>(null);
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

    const updateCell = (index: number, keyCode: string, value: any) => {
      ctx.emit('updateCell', index, keyCode, value);
    };
    provide('updateCell', updateCell);

    const setTableScroll = (rect: DOMRect) => {
      const OFFSET_TOP = 100;
      const OFFSET_BOTTOM = 50;
      const OFFSET_LEFT = 30;
      const { offsetWidth, offsetHeight, scrollTop, scrollLeft } = tableRef.value!;
      if (rect.bottom >= offsetHeight + OFFSET_BOTTOM) {
        tableRef.value!.scrollTop = scrollTop + (rect.bottom - offsetHeight);
      }
      if (rect.top < OFFSET_TOP) {
        tableRef.value!.scrollTop = scrollTop - rect.top;
      }
      if (rect.left < OFFSET_LEFT) {
        tableRef.value!.scrollLeft = scrollLeft - Math.abs(rect.left) - OFFSET_LEFT;
      }
      if (rect.right >= offsetWidth) {
        tableRef.value!.scrollLeft = scrollLeft + rect.right - offsetWidth + OFFSET_LEFT;
      }
    }

    provide('setTableScroll', setTableScroll);

    return {
      tableRef
    }
  },
});
</script>

<style lang="less">
@import './styles.less';
</style>
