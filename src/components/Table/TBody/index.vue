<script lang="ts">
import { compile, computed, defineComponent, h, inject, nextTick, PropType, reactive, ref, watch } from 'vue';
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
    const editCell = ref('');
    const editCellStyle = reactive({ width: 0, height: 0, top: 0, left: 0 });

    // 获取需要渲染的列 keyCode
    const columnKeys = computed(() =>
      props.columns.map((col: Table.ColumnsItem) => col.keyCode),
    );

    // 行点击事件代理，不直接对每个cell绑定事件
    const onRowClick = (e: MouseEvent) => {
      const now = Date.now();
      nextTick(() => {
        console.log(Date.now() - now);
      })

      let columnRowCell = e.target! as HTMLElement; 
      while (!columnRowCell.getAttribute('cell')) {
        columnRowCell = columnRowCell?.parentNode as HTMLElement;
      }
      const cellName = columnRowCell.getAttribute('cell')!;
      if (cellName === 'index' || editCell.value === cellName) return;
      editCell.value = cellName;

      setRowActive(e.currentTarget as HTMLElement);
      setEditContent();
    }

    const setEditContent = () => {
      const cellElement = document.querySelector(`.table__cell[cell="${editCell.value}"]`) as HTMLElement;
      cellElement.classList.add('edit');
      // cellElement.scrollIntoView({ inline: 'end' });
      const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = cellElement;
      editCellStyle.width = offsetWidth;
      editCellStyle.height = offsetHeight;
      editCellStyle.top = offsetTop;
      editCellStyle.left = offsetLeft;
      
      let cellEditContent = cellElement.querySelector('.edit-content');
      // console.log(cell)
      let input: HTMLInputElement | null = document.createElement('input');
      input.style.cssText = `width: ${editCellStyle.width}px; height: ${editCellStyle.height}px; border: none;`;
      input.placeholder = '单元格编辑';
      input.autofocus = true;
      cellEditContent!.append(input);
      cellEditContent = null;
      input = null;
    };

    const setRowActive = (currentTarget: HTMLElement) => {
      let oldActiveRow = document.querySelector('.table__row.active');
      if (oldActiveRow) {
        oldActiveRow.classList.remove('active');
        oldActiveRow = null;
      }
      currentTarget.classList.add('active');
    };

    const tableBody = (children: any[]) => h('section', { class: 'table__body' }, children);

    const tableCell = (key: string, index: number, children: any[]) => {
      const columnRowCell = `cell_${key}_${index}`;
      const width = getCellWidth(props.columns, key);
      return h('div', {
        cell: columnRowCell,
        class: 'table__cell',
        style: { width, minWidth: width  },
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

    watch(() => editCell.value, (value, oldValue) => {
      if (oldValue) {
        let oldEditCell = document.querySelector(`.table__cell[cell="${oldValue}"]`) as Element;
        if (oldEditCell) {
          oldEditCell.classList.remove('edit');
          let editContent: Element | null = oldEditCell.querySelector('.edit-content')!;
          editContent.innerHTML = '';
          editContent = null;
        }
      }
    })

    return () => tableBody([
      props.dataSource.map((dataItem: Table.ColumnsItem, index: number) =>
        h('div', { class: 'table__row', onClick: onRowClick }, [
          h('div', { cell: 'index', class: 'table__cell' }, [index+1]), 
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
