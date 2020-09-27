<script lang="ts">
import { computed, defineComponent, h, inject, PropType, reactive } from 'vue';
import { getShowKeys, getCellWidth, getRenderType } from '../utils';
import NumberComp from '/@/components/Tools/Number.vue';
import StringComp from '/@/components/Tools/String.vue';
import DateComp from '/@/components/Tools/Date.vue';
import AddRow from '/@/components/Tools/AddRow.vue';
import { Table } from '../types.d';

export default defineComponent({
  name: 'TBody',
  props: {
    columns: {
      type: Array as PropType<Table.ColumnsItem[]>,
      default: [],
    },
    dataSource: {
      type: Array as PropType<Table.ColumnsItem[]>,
      default: [],
    },
  },
  setup(props, ctx) {
    const pos = reactive({ top: 0, left: 0 });

    const columnKeys = computed(() =>
      props.columns.map((col: Table.ColumnsItem) => col.keyCode),
    );

    const onClick = (e: MouseEvent) => {
      debugger
      // const { offsetTop, offsetLeft } = e.currentTarget!;
      // pos.top = offsetLeft;
      // pos.left = offsetTop;
    }

    const getValueType = (keyCode: string) => {
      const item = props.columns.find(i => i.keyCode === keyCode);
      return item?.valueType;
    }

    const tableBody = (children: any[]) => h('section', { class: 'table__body' }, children);

    const tableCell = (key: string, index: number, children: any[]) => h('span', {
      class: `table__cell cell_${key}_${index}`,
      style: { width: getCellWidth(props.columns, key) },
      onDblClick: onClick
    }, children);

    const wrapper = (value: any, type?: Table.ColumnItemType) => {
      if (!type) return value;
      const compMap = { STRING: StringComp, NUMBER: NumberComp, DATE: DateComp };
      return compMap[type] ? h(compMap[type] as any, { value }) : value;
    }

    return () => tableBody([
      h('span', { style: {
        width: '100px',
        height: '100px',
        position: 'fixed',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        background: '#666'
      } }),
      props.dataSource.map((dataItem: Table.ColumnsItem, index: number) =>
        h('div', { class: 'table__row' }, [
          getShowKeys(columnKeys.value, dataItem).map((key) => tableCell(key, index, [
            wrapper(
              getRenderType(h, { columns: props.columns, dataItem, key }), 
              getValueType(key)
            )
          ])),
        ]),
      ),
      h(AddRow, { className: 'table__cell' }),
    ]);
  },
});
</script>
