<script lang="ts">
import { App, compile, computed, createApp, createBlock, createRenderer, createStaticVNode, DefineComponent, defineComponent, h, inject, nextTick, onUnmounted, PropType, reactive, ref, watch } from 'vue';
import { fixedLeft, getCellValue, getCellWidth, getRenderType, getValueType, renderStaticCell } from '../utils';
import NumberComp from '/@/components/Tools/Number.vue';
import TextComp from '/@/components/Tools/Text.vue';
import DateComp from '/@/components/Tools/Date.vue';
import AddRow from '/@/components/Tools/AddRow.vue';
import { useClickOutside, UseClickOutsideReturns } from '/@/hooks';
import { Table } from '../types.d';

interface TalbeCellProps {
  key: string;
  index: number
  children: any[];
  valueType?: Table.ColumnItemType;
}

let EditComp: App;

const tableIndex = (index: number) => h('div', { 
  'data-cell': 'index', 
  class: 'table__cell' 
}, [ h('span', { class: 'move', }, '🤚'), index+1 ]);

const tableBody = (children: any[]) => h('section', { class: 'table__body' }, children);

const renderCellStyle = (value: any, type?: Table.ColumnItemType) => {
  if (!type) return value;
  return renderStaticCell(h, value, type);
}

// 获取当前编辑的cell css选择器
const getEditCellSelector = (cell: string) => `.table__cell[data-cell="${cell}"]`;

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
    const setTableScroll: Function = inject('setTableScroll') || console.log;
    // const updateCell: Function | undefined = inject('updateCell');

    onUnmounted(() => {
      if (!editCell.value) return;
      const selector = getEditCellSelector(editCell.value);
      let oldEditCell = document.querySelector(selector) as Element;
      let editContent: Element | null = oldEditCell.querySelector('.edit-content');
      if (EditComp) EditComp.unmount(editContent);
      editContent = null;
    });

    watch(() => editCell.value, (value, oldValue) => {
      if (oldValue) {
        const selector = getEditCellSelector(oldValue);
        let oldEditCell = document.querySelector(selector) as Element;
        if (oldEditCell) {
          oldEditCell.classList.remove('edit');
        }
      }
    })

    // 获取需要渲染的列 keyCode
    const columnKeys = computed(() =>
      props.columns.map((col: Table.ColumnsItem) => col.keyCode),
    );

    // 固定列
    const columnsFixed = computed(() => columnKeys.value.filter(
      col => props.columns.find(i => col === i.keyCode)!.fixed)
    );

    // 正常列
    const columnsNormal = computed(() => columnKeys.value.filter(
      col => !props.columns.find(i => col === i.keyCode)!.fixed)
    );

    const onClickOutside = () => {
      outsideHandler.removeListener();
      if (EditComp) {
        setTimeout(() => {
          EditComp.unmount(document.querySelector(`.${editCell.value} .edit-content`));
          editCell.value = '';
        }, 0);
      }
    };

    const updateCell = (value: any) => {
      const selector = getEditCellSelector(editCell.value);
      const oldEditCell = document.querySelector(selector)! as HTMLElement;
      const oldShowContent = oldEditCell.querySelector(`.show-content`)!;
      const valueType = oldEditCell.dataset['valueType'.toLowerCase()] as Table.ColumnItemType;
      createApp({ render: () => renderStaticCell(h, value, valueType) }).mount(oldShowContent);
    }

    // 使用@change的话调用了两次
    const onCellChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      const [keyCode, index] = editCell.value.split('_');

      // 手动更新：速度快
      updateCell(value);
      // 修改数据 -> Vue更新：50行100列耗时：600多ms
      // if (updateCell) updateCell(index, keyCode, value);
      
      const now = Date.now();
      nextTick(() => {
        console.log('单元格更新渲染时间：', Date.now() - now, 'ms');
      })
    };

    // 行点击事件代理，不直接对每个cell绑定事件
    const onRowClick = (e: MouseEvent) => {
      e.stopPropagation();
      const now = Date.now();
      nextTick(() => {
        console.log('单元格编辑渲染时间：', Date.now() - now, 'ms');
      })

      const currentRow = e.currentTarget as HTMLElement;
      let columnRowCell = e.target! as HTMLElement; 
      while (
        currentRow.contains(columnRowCell) && 
        !columnRowCell.dataset.cell
      ) {
        columnRowCell = columnRowCell?.parentNode as HTMLElement;
      }
      const cellName = columnRowCell.dataset.cell!;
      if (!cellName || cellName === 'index' || editCell.value === cellName) return;
      editCell.value = cellName;

      setRowActive(e.currentTarget as HTMLElement);
      setEditContent({ value: getCellValue(props.dataSource, cellName), cellName, onClickOutside, setTableScroll, cb: (pos) => {
        editCellStyle.width = pos.offsetWidth;
        editCellStyle.height = pos.offsetHeight;
        editCellStyle.top = pos.offsetTop;
        editCellStyle.left = pos.offsetLeft;
      }});
    }

    // 单元格编辑
    const setEditContent = ({ value, cellName, onClickOutside, setTableScroll, cb }: {
      value: any,
      cellName: string, 
      onClickOutside: Function, 
      setTableScroll: Function, 
      cb: (data: CBdata) => void
    }) => {
      const selector = getEditCellSelector(cellName);
      const cellElement = document.querySelector(selector) as HTMLElement;
      cellElement.classList.add('edit');
      
      if (outsideHandler) outsideHandler.removeListener();
      outsideHandler = useClickOutside(cellElement as HTMLElement, onClickOutside);
      outsideHandler.addListener();

      const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = cellElement;
      const rect = cellElement.getBoundingClientRect();
      // 部分被隐藏时，滚动到可视区域
      setTableScroll?.(rect);
      
      cb({ offsetWidth, offsetHeight, offsetTop, offsetLeft });
    
      let cellEditContent: Element | null = cellElement.querySelector('.edit-content');
      if (EditComp) EditComp.unmount(cellEditContent);
      const type = cellElement!.dataset['valueType'.toLowerCase()] as Table.ColumnItemType;
      const compMap = { TEXT: TextComp, NUMBER: NumberComp, DATE: DateComp };
      EditComp = createApp(compMap[type], { 
        style: { height: cellHeight.value+'px' }, value, onValueChange: onCellChange 
      });
      EditComp.mount(cellEditContent);
      // console.log(EditComp);
      cellEditContent = null;
    };
    const tableRow = (index: number, children: any[]) => h('div', { 
      class: 'table__row', 
      style: { top: `${index * cellHeight.value}px` }, 
      onClick: onRowClick 
    }, children);

    const tableCell = ({ valueType, key, index, children }: TalbeCellProps) => {
      const columnRowCell = `${key}_${index}`;
      const width = getCellWidth(props.columns, key);
      return h('div', {
        'data-valueType': valueType,
        'data-cell': columnRowCell,
        class: 'table__cell',
        style: { height: cellHeight.value+'px', width, minWidth: width },
      }, [
        h('div', { class: 'show-content' }, children),
        h('div', { class: 'edit-content' })
      ]);
    }

    const renderCell = (column: string[], dataItem: Table.ColumnsItem, index: number) => {
      return column.map((key) => tableCell({
        key,
        index: index+1, 
        valueType: getValueType(props.columns, key), 
        children: [
          renderCellStyle(
            getRenderType(h, { columns: props.columns, dataItem, key }),
            getValueType(props.columns, key)
          ),
      ]}));
    }

    return () => tableBody([
      props.dataSource.map((dataItem: Table.ColumnsItem, index: number) =>
        tableRow(index, [
          fixedLeft([
            tableIndex(index),
            renderCell(columnsFixed.value, dataItem, index),
          ]),
          renderCell(columnsNormal.value, dataItem, index),
        ]),
      ),
      tableRow(props.dataSource.length, [ h(AddRow) ])
    ]);
  },
});
</script>
