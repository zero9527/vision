import { createApp, h } from 'vue';
import { fixedLeft, getCellWidth, getRenderType, getValueType, renderStaticCell } from '../utils';
import { Table } from '../types';

export interface CellRenderManagerProps {
  columns: Table.ColumnsItem[];
  dataSource: any[];
  cellHeight: number;
  onRowClick: (e: MouseEvent) => void;
}

interface TalbeCellProps {
  index: number;
  keyCode: string;
  children: any[];
  valueType?: Table.ColumnItemType;
}

/**
 * 渲染管理
 */
export default class CellRenderManager {
  private props: Readonly<CellRenderManagerProps>;

  constructor(props: CellRenderManagerProps) {
    this.props = props;
  }
  
  // 获取需要渲染的列 keyCode
  get columnKeys() {
    return this.props.columns.map((col: Table.ColumnsItem) => col.keyCode)
  }

  // 固定列
  get columnsFixed() {
    return this.columnKeys.filter(
      col => this.props.columns.find(i => col === i.keyCode)!.fixed
    );
  }

  // 正常列
  get columnsNormal() {
    return this.columnKeys.filter(
      col => !this.props.columns.find(i => col === i.keyCode)!.fixed
    );
  }

  /**
   * 动态创建行 table__row
   * @param index 序号
   * @param cssText 样式
   * @param onRowClick 行点击 
   */
  private createTableRowEl = (index: number, cssText: string) => {
    let tableBody: Element | null = document.querySelector('.table__body')!;
    let rowEl: HTMLDivElement | null = document.createElement('div');
    rowEl.className = 'table__row';
    rowEl.setAttribute('index', `${index}`);
    rowEl.style.cssText = cssText;
    rowEl.onclick = this.props.onRowClick;
    tableBody.append(rowEl);
    tableBody = null;
    rowEl = null;
  }

  /**
   * 逐行渲染，列数多的时候会有明显的空白感，
   * 可以进一步压缩，手动渲染部分单元格（可视区域一定范围内）
   * @param index 当前序号
   */
  public renderRowFrame = async (index: number = 0) => {
    const dataItem = this.props.dataSource[index];
    if (!dataItem) return;
    const cssText = `top: ${index * this.props.cellHeight}px;`;
    this.createTableRowEl(index, cssText);

    const rowEl = document.querySelector(`.table__row[index="${index}"]`);
    if (!rowEl) return;

    await createApp({
      render: () => [
        fixedLeft([
          this.tableIndex(index),
          this.renderCell(this.columnsFixed, dataItem, index),
        ]), 
        this.renderCell(this.columnsNormal, dataItem, index)
      ]
    }).mount(rowEl);

    setTimeout(() => this.renderRowFrame(index + 1), 0);
  }

  private tableIndex = (index: number) => h('div', { 
    'data-cell': 'index', 
    class: 'table__cell' 
  }, [ h('span', { class: 'move', }, '🤚'), index+1 ]);
  
  // 渲染单元格
  private renderCell = (column: string[], dataItem: Table.DataItem, index: number) => {
    const tableCell = ({ valueType, keyCode, index, children }: TalbeCellProps) => {
      const cell = `${keyCode}_${index}`;
      const width = getCellWidth(this.props.columns, keyCode);
      return h('div', {
        'data-valueType': valueType,
        'data-cell': cell,
        class: 'table__cell',
        style: { height: this.props.cellHeight+'px', width, minWidth: width },
      }, [
        h('div', { class: 'show-content' }, children),
        h('div', { class: 'edit-content' })
      ]);
    };

    const renderCellStyle = (value: any, type?: Table.ColumnItemType) => {
      if (!type) return value;
      return renderStaticCell(h, value, type);
    }

    return column.map((keyCode) => tableCell({
      keyCode,
      index, 
      valueType: getValueType(this.props.columns, keyCode), 
      children: [
        renderCellStyle(
          getRenderType(h, { columns: this.props.columns, dataItem, keyCode }),
          getValueType(this.props.columns, keyCode)
        ),
    ]}));
  };
}
