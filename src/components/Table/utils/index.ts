import { CreateElement } from 'vue/types/umd';
import { h } from 'vue';
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
  key: string;
}
// 渲染label或执行render方法
export function getRenderType(
  h: CreateElement,
  { columns, dataItem, key }: RenderTypeProps,
) {
  const columnItem = getColumnByKeyCode(columns, key);
  if (!columnItem) return null;
  return columnItem?.render
    ? columnItem?.render(h, dataItem)
    : dataItem[columnItem.keyCode];
}

// valueType
export function getValueType(columns: Table.ColumnsItem[], keyCode: string) {
  const item = columns.find(i => i.keyCode === keyCode);
  return item?.valueType;
}

// 单元格 静态显示
export function renderStaticCell(h: any, value: any, valueType: Table.ColumnItemType) {
  // 数字
  if (valueType === 'NUMBER') {
    return h('span', { 
      style: { backgroundColor: 'aquamarine' }
    }, value);
  }

  // 日期
  if (valueType === 'DATE') {
    return h('span', { 
      style: { fontFamily: 'monospace', fontSize: '14px' }
    }, value);
  }

  // 短文本
  if (valueType === 'TEXT') {
    return h('span', { 
      style: { backgroundColor: 'sandybrown' }
    }, value);
  }

  // 单选
  if (valueType === 'SELECT') {
    return h('span', value)
  }

  // 默认直接显示
  return h('span', value);
}

// 单元格编辑
export function getCellValue(dataSource: any[], cellName: string) {
  const [keyCode, index] = cellName.split('_') as [string, number];
  return dataSource[index-1][keyCode];
}
