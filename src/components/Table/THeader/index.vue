<script lang="ts">
import { defineComponent, h, inject, PropType, ref, RenderFunction, VNode } from 'vue';
import AddColumn from '../../Tools/AddColumn.vue';
import { Table } from '../types.d';

const edit = (props: object) => h('span', props, '🖊');

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

    const defaultValueType = ref<Table.ColumnItemType>('STRING');
    const valueTypeList = ref<{ label: string, valueType: Table.ColumnItemType }[]>([
      { label: '字符串', valueType: 'STRING' },
      { label: '数字', valueType: 'NUMBER' },
      { label: '日期', valueType: 'DATE' },
    ]);
    
    // 添加
    const addColumn = (item: Table.ColumnsItem) => {
      if (onAddColumn) onAddColumn(item);
    };

    // 编辑
    const onColumnEdit = (column: Table.ColumnsItem) => {};

    const getCellWidth = (width?: number) => width ? `${width}px` : undefined;

    return () => h('section', {
      class: `table__header ${props?.wrapperClass || ''}`.trim()
    }, [
      h('span', { class: 'label table__cell', }, '✨'),
      props.columns.map((col) =>
        h('span', {
          key: col.keyCode,
          class: 'label table__cell',
          style: { width: getCellWidth(col.width), minWidth: getCellWidth(col.width) },
        }, [
          col.label,
          edit({ class: 'edit', onClick: () => onColumnEdit(col) }),
        ]),
      ),
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
