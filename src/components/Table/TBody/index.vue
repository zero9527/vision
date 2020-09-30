<script lang="ts">
import { compile, computed, defineComponent, h, inject, nextTick, PropType, reactive, ref, watch } from 'vue';
import { getCellWidth, getRenderType, getValueType } from '../utils';
import NumberComp from '/@/components/Tools/Number.vue';
import StringComp from '/@/components/Tools/String.vue';
import DateComp from '/@/components/Tools/Date.vue';
import AddRow from '/@/components/Tools/AddRow.vue';
import { useClickOutside, UseClickOutsideReturns } from '/@/hooks';
import { Table } from '../types.d';

const tableIndex = (index: number) => h('div', { 
  cell: 'index', 
  class: 'table__cell' 
}, [ h('span', { class: 'move', }, '🤚'), index+1 ]);

const tableBody = (children: any[]) => h('section', { class: 'table__body' }, children);

const renderComp = (value: any, type?: Table.ColumnItemType) => {
  if (!type) return value;
  const compMap = { STRING: StringComp, NUMBER: NumberComp, DATE: DateComp };
  return compMap[type] ? h(compMap[type] as any, { value }) : value;
}

// 获取当前编辑的cell css选择器
const getEditCellSelector = (cell: string) => `.table__cell[cell="${cell}"]`;

// 设置行active
const setRowActive = (currentTarget: HTMLElement) => {
  // 点击当前行
  if (currentTarget.classList.contains('active')) return;
  let oldActiveRow = document.querySelector('.table__row.active');
  if (oldActiveRow) {
    oldActiveRow.classList.remove('active');
    oldActiveRow = null;
  }
  currentTarget.classList.add('active');
};

type CBdata = {
  offsetWidth: number, 
  offsetHeight: number, 
  offsetTop: number, 
  offsetLeft: number
};
let outsideHandler: UseClickOutsideReturns;
const setEditContent = (cellName: string, onClickOutside: Function, setTableScroll?: Function, cb: (data: CBdata) => void) => {
  const selector = getEditCellSelector(cellName);
  const cellElement = document.querySelector(selector) as HTMLElement;
  cellElement.classList.add('edit');
  
  if (outsideHandler) outsideHandler.removeListener();
  outsideHandler = useClickOutside(cellElement as HTMLElement, onClickOutside);
  outsideHandler.addListener();

  const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = cellElement;
  const rect = cellElement.getBoundingClientRect();
  // 滚动到可视区域
  setTableScroll?.(rect);
  
  cb({ offsetWidth, offsetHeight, offsetTop, offsetLeft });

  // NumberComp.props.value = '1';
  // const Num = NumberComp.render!();
  // console.log(Num)
  // document.body.append(Num);
  
  let cellEditContent = cellElement.querySelector('.edit-content');
  // console.log(cell)
  let input: HTMLInputElement | null = document.createElement('input');
  input.style.cssText = `width: ${offsetWidth}px; height: ${offsetHeight}px; border: none;`;
  input.placeholder = '单元格编辑';
  input.autofocus = true;
  cellEditContent!.append(input);
  cellEditContent = null;
  input = null;
};

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
    const cellHeight = ref(50);
    const editCell = ref('');
    const editCellStyle = reactive({ width: 0, height: 0, top: 0, left: 0 });
    const setTableScroll: Function | undefined = inject('setTableScroll');

    // 获取需要渲染的列 keyCode
    const columnKeys = computed(() =>
      props.columns.map((col: Table.ColumnsItem) => col.keyCode),
    );

    const onClickOutside = () => {
      editCell.value = '';
      outsideHandler.removeListener();
    };

    // 行点击事件代理，不直接对每个cell绑定事件
    const onRowClick = (e: MouseEvent) => {
      e.stopPropagation();
      const now = Date.now();
      nextTick(() => {
        console.log('渲染时间：', Date.now() - now, 'ms');
      })

      const currentRow = e.currentTarget as HTMLElement;
      let columnRowCell = e.target! as HTMLElement; 
      while (
        currentRow.contains(columnRowCell) && 
        !columnRowCell.getAttribute('cell')
      ) {
        columnRowCell = columnRowCell?.parentNode as HTMLElement;
      }
      const cellName = columnRowCell.getAttribute('cell')!;
      if (!cellName || cellName === 'index' || editCell.value === cellName) return;
      editCell.value = cellName;

      setRowActive(e.currentTarget as HTMLElement);
      setEditContent(cellName, onClickOutside, setTableScroll, (pos) => {
        editCellStyle.width = pos.offsetWidth;
        editCellStyle.height = pos.offsetHeight;
        editCellStyle.top = pos.offsetTop;
        editCellStyle.left = pos.offsetLeft;
      });
    }

    const tableRow = (index: number, children: any[]) => h('div', { 
      class: 'table__row', 
      style: { top: `${index * cellHeight.value}px` }, 
      onClick: onRowClick 
    }, children);

    const tableCell = (key: string, index: number, children: any[]) => {
      const columnRowCell = `cell_${key}_${index}`;
      const width = getCellWidth(props.columns, key);
      return h('div', {
        cell: columnRowCell,
        class: 'table__cell',
        style: { height: cellHeight.value+'px', width, minWidth: width },
      }, [
        h('div', { class: 'show-content' }, children),
        h('div', { class: 'edit-content' })
      ]);
    }

    watch(() => editCell.value, (value, oldValue) => {
      if (oldValue) {
        const selector = getEditCellSelector(oldValue);
        let oldEditCell = document.querySelector(selector) as Element;
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
        tableRow(index, [
          tableIndex(index), 
          columnKeys.value.map((key) => tableCell(key, index+1, [
            renderComp(
              getRenderType(h, { columns: props.columns, dataItem, key }),
              getValueType(props.columns, key)
            ),
          ])),
        ]),
      ),
      tableRow(props.dataSource.length, [ h(AddRow) ])
    ]);
  },
});
</script>
