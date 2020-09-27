<script lang="ts">
import { computed, defineComponent, h, inject, PropType, reactive, ref } from 'vue';
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
    const currentEditCell = ref('');
    const editCellStyle = reactive({ width: 0, height: 0, top: 0, left: 0 });

    const columnKeys = computed(() =>
      props.columns.map((col: Table.ColumnsItem) => col.keyCode),
    );

    const onClick = (e: MouseEvent, columnRowCell: string) => {
      const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = e.currentTarget as HTMLElement;
      editCellStyle.width = offsetWidth;
      editCellStyle.height = offsetHeight;
      editCellStyle.top = offsetTop;
      editCellStyle.left = offsetLeft;
      currentEditCell.value = columnRowCell;
    }

    const getValueType = (keyCode: string) => {
      const item = props.columns.find(i => i.keyCode === keyCode);
      return item?.valueType;
    }

    const tableBody = (children: any[]) => h('section', { class: 'table__body' }, children);

    const tableCell = (key: string, index: number, children: any[]) => {
      const columnRowCell = `cell_${key}_${index}`;
      const className = `table__cell ${columnRowCell} ${
        currentEditCell.value === columnRowCell ? 'edit' : ''
      }`;
      return h('span', {
        class: className.trim(),
        style: { width: getCellWidth(props.columns, key) },
        onDblClick: (e: MouseEvent) => onClick(e, columnRowCell)
      }, children);
    }

    const wrapper = (value: any, type?: Table.ColumnItemType) => {
      if (!type) return value;
      const compMap = { STRING: StringComp, NUMBER: NumberComp, DATE: DateComp };
      return compMap[type] ? h(compMap[type] as any, { value }) : value;
    }

    const editCell = () => h('span', {
      class: 'edit-cell',
      style: {
        // width: `${editCellStyle.width}px`,
        // height: `${editCellStyle.height}px`,
        top: `${editCellStyle.top}px`,
        left: `${editCellStyle.left}px`,
      } 
    });

    return () => tableBody([
      editCell(),
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
