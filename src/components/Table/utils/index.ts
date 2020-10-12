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
    ? columnItem.render(h, dataItem)
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
    return h('span', value);
  }

  // 选择
  if (valueType === 'SELECT') {
    return h('span', value.map((label: string) => h('span', { 
      style: { 
        marginRight: '4px', 
        padding: '2px',
        borderRadius: '4px',
        backgroundColor: 'sandybrown' 
      }
     }, label)
    ))
  }

  // 地址
  if (valueType === 'ADDRESS') {
    return h('span', value.map((label: string, index: number) => h('span', [
      label, index !== value.length - 1 ? ',' : ''
    ])))
  }

  // 默认直接显示
  return h('span', null, value);
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
