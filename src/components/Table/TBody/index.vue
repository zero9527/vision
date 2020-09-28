<script lang="ts">
import { computed, defineComponent, h, inject, PropType, reactive, ref, watch } from 'vue';
import { getCellWidth, getRenderType, getValueType } from '../utils';
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

    // 获取需要渲染的列 keyCode
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

    const tableBody = (children: any[]) => h('section', { class: 'table__body' }, children);

    const tableCell = (key: string, index: number, children: any[]) => {
      const columnRowCell = `cell_${key}_${index}`;
      const className = `table__cell ${columnRowCell} ${
        currentEditCell.value === columnRowCell ? 'edit' : ''
      }`;
      const width = getCellWidth(props.columns, key);
      return h('div', {
        class: className.trim(),
        style: { width, minWidth: width  },
        onClick: (e: MouseEvent) => onClick(e, columnRowCell)
      }, [
        h('div', { class: 'show-content' }, children),
        h('div', { class: 'edit-content' })
      ]);
    }

    const wrapper = (value: any, type?: Table.ColumnItemType) => {
      if (!type) return value;
      const compMap = { STRING: StringComp, NUMBER: NumberComp, DATE: DateComp };
      return compMap[type] ? h(compMap[type] as any, { value }) : value;
    }

    watch(() => currentEditCell.value, (value, oldValue) => {
      if (oldValue) {
        let oldEditCell = document.querySelector(`.${oldValue} .edit-content`);
        if (oldEditCell) {
          oldEditCell.innerHTML = '';
          oldEditCell = null;
        }
      }
      // console.log(editCell());
      let cell = document.querySelector(`.${value} .edit-content`);
      // console.log(cell)
      let input: HTMLInputElement | null = document.createElement('input');
      input.style.cssText = `width: ${editCellStyle.width}px; height: ${editCellStyle.height}px; border: none;`;
      input.placeholder = '单元格编辑';
      input.autofocus = true;
      cell!.append(input);
      cell = null;
      input = null;
    })

    /**
     * 滚动时位置问题，可以试试点击时候再手动渲染组件，
     * 然后append插入 .table__cell.edit 的元素内
     */
    const editCell = () => h('span', {
      class: 'edit-cell',
      style: {
        width: `${editCellStyle.width}px`,
        // height: `${editCellStyle.height}px`,
      }
    });

    return () => tableBody([
      props.dataSource.map((dataItem: Table.ColumnsItem, index: number) =>
        h('div', { class: 'table__row' }, [
          h('div', { class: 'table__cell' }, [index+1]), 
          columnKeys.value.map((key) => tableCell(key, index+1, [
            wrapper(
              getRenderType(h, { columns: props.columns, dataItem, key }),
              getValueType(props.columns, key)
            )
          ])),
        ]),
      ),
      h(AddRow),
    ]);
  },
});
</script>
