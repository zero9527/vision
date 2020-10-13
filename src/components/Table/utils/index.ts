import { CreateElement } from 'vue/types/umd';
import { h, VNode } from 'vue';
import { Table } from '../types.d';

// 固定列
export function fixedLeft(children: any[]) {
  return h('div', { class: 'fixed-column shadow' }, children);
}

// 获取列宽度
export function getColumnByKeyCode(columns: Table.ColumnsItem[], keyCode: string) {
  const item = columns.find((it) => it.keyCode === keyCode);
  if (!item) return undefined;
  return item;
}

// 获取column宽度width
export function getCellWidth(columns: Table.ColumnsItem[], key: string) {
  const item = getColumnByKeyCode(columns, key);
  return item?.width ? `${item?.width}px` : undefined;
}

interface RenderTypeProps {
  columns: Table.ColumnsItem[];
  dataItem: any;
  keyCode: string;
}
// 渲染label或执行render方法
export function getRenderType(
  h: CreateElement,
  { columns, dataItem, keyCode }: RenderTypeProps,
) {
  const columnItem = getColumnByKeyCode(columns, keyCode);
  if (!columnItem) return null;
  return columnItem?.render
    ? columnItem.render(h, dataItem)
    : dataItem[columnItem.keyCode];
}

// valueType
export function getValueType(columns: Table.ColumnsItem[], keyCode: string) {
  const item = columns.find(i => i.keyCode === keyCode);
  return item?.valueType;
}

// 单元格 静态显示
export function renderStaticCell(h: any, value: any, valueType: Table.ColumnItemType): VNode {
  // 数字
  if (valueType === 'NUMBER') {
    return h('span', { 
      style: { backgroundColor: 'aquamarine' }
    }, value);
  }

  // 日期
  if (valueType === 'DATE') {
    return h('span', value);
  }

  // 选择
  if (valueType === 'SELECT') {
    return h('span', value.map((label: string) => h('span', { 
      class: 'table__cell-select-item'
     }, label)));
  }

  // 地址
  if (valueType === 'ADDRESS') {
    return h('span', value.join(' / '));
  }

  // 默认直接显示
  return h('span', null, value);
}

// 设置行active
export function setRowActive(currentTarget: HTMLElement) {
  // 点击当前行
  if (currentTarget.classList.contains('active')) return;
  let oldActiveRow = document.querySelector('.table__row.active');
  if (oldActiveRow) {
    oldActiveRow.classList.remove('active');
    oldActiveRow = null;
  }
  currentTarget.classList.add('active');
};

// 获取单元格的cell名称
export function getCellName(e: MouseEvent) {
  let currentRow: HTMLElement | null = e.currentTarget as HTMLElement;
  let columnRowCell: HTMLElement | null = e.target! as HTMLElement;
  while (
    currentRow.contains(columnRowCell) && 
    !columnRowCell!.dataset.cell
  ) {
    columnRowCell = columnRowCell?.parentNode as HTMLElement;
  }
  const cellName = columnRowCell!.dataset.cell!;
  currentRow = null;
  columnRowCell = null;
  return cellName;
}
    
// 分割 keyCode, index
export function seperateKeycodeIndex(cellName: string): [string, number] {
  const [keyCode, index] = cellName.split('_') as [string, number];
  return [keyCode, Number(index)];
}

// 单元格编辑
export function getCellValue(changeRows: any, dataSource: any[], cellName: string) {
  const [keyCode, index] = cellName.split('_') as [string, number];
  // 优先使用修改的数据
  if (changeRows[index]) return changeRows[index][keyCode];
  return dataSource[index][keyCode]; 
}

// 获取当前编辑的cell css选择器
export function getEditCellSelector(cell: string) {
  return `.table__cell[data-cell="${cell}"]`;
}

// 获取当前编辑的cell元素
export function getCellElment(cell: string) {
  const selector = getEditCellSelector(cell);
  const cellElement = document.querySelector(selector)! as HTMLElement;
  return cellElement;
}
