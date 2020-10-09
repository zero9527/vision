<script lang="ts">
import { computed, defineComponent, h, inject, PropType, ref, RenderFunction, VNode } from 'vue';
import AddColumn from '../../Tools/AddColumn.vue';
import { fixedLeft } from '../utils';
import { Table } from '../types.d';

const edit = (props: object) => h('span', props, '🖊');

const getCellWidth = (width?: number) => width ? `${width}px` : undefined;

const tableHeader = (wrapperClass: string, children: any[]) => h('section', {
  class: `table__header ${wrapperClass}`.trim()
}, children);

const headerCell = (col: Table.ColumnsItem, onColumnEdit: (col: Table.ColumnsItem) => void) => h('span', {
  key: col.keyCode,
  class: 'label table__cell',
  style: { width: getCellWidth(col.width), minWidth: getCellWidth(col.width) },
}, [
  col.label,
  edit({ class: 'edit', onClick: () => onColumnEdit(col) }),
]);

// header
export default defineComponent({
  name: 'THeader',
  props: {
    wrapperClass: {
      type: String,
    },
    columns: {
      type: Array as PropType<Table.ColumnsItem[]>,
      default: [],
    },
  },
  setup(props, ctx) {
    const onAddColumn: Function | undefined = inject('addColumn');

    const defaultValueType = ref<Table.ColumnItemType>('TEXT');
    const valueTypeList = ref<{ label: string, valueType: Table.ColumnItemType }[]>([
      { label: '字符串', valueType: 'TEXT' },
      { label: '数字', valueType: 'NUMBER' },
      { label: '日期', valueType: 'DATE' },
    ]);

    const columnsFixed = computed(() => props.columns.filter(i => i.fixed));
    const columnsNormal = computed(() => props.columns.filter(i => !i.fixed));
    
    // 添加
    const addColumn = (item: Table.ColumnsItem) => {
      if (onAddColumn) onAddColumn(item);
    };

    // 编辑
    const onColumnEdit = (column: Table.ColumnsItem) => {};

    return () => tableHeader(props?.wrapperClass || '', [
      fixedLeft([
        h('span', { class: 'label table__cell', 'data-cell': 'index' }, '✨'),
        columnsFixed.value.map((col) => headerCell(col, onColumnEdit)),
      ]),
      columnsNormal.value.map((col) => headerCell(col, onColumnEdit)),
      props.columns.length < 100 && h(AddColumn, {
        defaultValueType: defaultValueType.value,
        valueTypeList: valueTypeList.value,
        onConfirm: addColumn
      }),
    ]);
  },
});
</script>

<style lang="less">
.table__header {
  .table__cell {
    &:hover {
      .edit {
        display: inline-block;
      }
    }
  
    /deep/ .edit {
      display: none;
      color: royalblue;
      cursor: pointer;
    }
  }
}
</style>
