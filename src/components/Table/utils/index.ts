import { CreateElement } from 'vue/types/umd';
import { Table } from '../types.d';

// 获取列宽度
export function getColumnByKeyCode(columns: Table.ColumnsItem[], keyCode: string) {
  const item = columns.find((it) => it.keyCode === keyCode);
  if (!item) return undefined;
  return item;
}

// 获取显示的key
export function getShowKeys(columnKeys: string[], item: Table.ColumnsItem) {
  const filterArr: string[] = [];
  Object.keys(item).forEach((key) => {
    if (columnKeys.includes(key)) filterArr.push(key);
  });
  return filterArr;
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
