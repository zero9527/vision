import { createApp, h, render } from 'vue';
import { fixedLeft, getCellWidth, getRenderType, getValueType, renderStaticCell } from '../../utils';
import { Table } from '../../types';

interface CellRenderManagerProps {
  columns: Table.ColumnsItem[];
  dataSource: any[];
  cellHeight: number;
  onRowClick: (e: MouseEvent) => void;
}

interface TalbeCellProps {
  rowIndex: number;
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

  get columnsShowFirst() {
    return this.columnsNormal.slice(0, 10);
  }

  /**
   * 动态创建行 table__row
   * @param rowIndex 行序号
   * @param cssText 样式
   * @param onRowClick 行点击 
   */
  private createTableRowEl = (rowIndex: number, cssText: string) => {
    let tableBody: Element | null = document.querySelector('.table__body')!;
    let rowEl: HTMLDivElement | null = document.createElement('div');
    rowEl.className = 'table__row';
    rowEl.setAttribute('index', `${rowIndex}`);
    rowEl.style.cssText = cssText;
    rowEl.onclick = this.props.onRowClick;
    tableBody.append(rowEl);
    tableBody = null;
    rowEl = null;
  }

  /**
   * 逐行渲染，列数多的时候（100列）会有明显的空白感，
   * 可以进一步压缩，手动渲染部分单元格（可视区域一定范围内）
   * @param rowIndex 行序号
   */
  public renderRowFrame = async (rowIndex: number = 0) => {
    const dataItem = this.props.dataSource[rowIndex];
    if (!dataItem) return;

    const cssText = `top: ${rowIndex * this.props.cellHeight}px;`;
    this.createTableRowEl(rowIndex, cssText);

    const rowEl = document.querySelector(`.table__row[index="${rowIndex}"]`);
    if (!rowEl) return;

    await createApp({
      render: () => [
        fixedLeft([
          this.tableIndex(rowIndex),
          this.renderCell(this.columnsFixed, dataItem, rowIndex),
        ]), 
        this.renderCell(this.columnsShowFirst, dataItem, rowIndex)
      ]
    }).mount(rowEl);

    setTimeout(() => this.renderRowFrame(rowIndex + 1), 0);
  }

  /**
   * TODO
   * 单元格逐个渲染
   * @param rowIndex {*} 行序号
   * @param columnIndex {*} 列序号
   */
  public renderCellFrame = async (rowIndex: number, columnIndex: number) => {
    const dataItem = this.props.dataSource[rowIndex];
    const currentColumn = this.props.columns[columnIndex];
    if (!dataItem || !currentColumn) return;

    const rowEl = document.querySelector(`.table__row[index="${rowIndex}"]`);
    if (!rowEl) return;

    const { keyCode } = this.props.columns[columnIndex];
    render(this.cellWrapper({ 
      keyCode, rowIndex,
      valueType: getValueType(this.props.columns, keyCode), 
      children: [renderStaticCell(
        h,
        getRenderType(h, { columns: this.props.columns, dataItem, keyCode }),
        getValueType(this.props.columns, keyCode) as Table.ColumnItemType
      )]
    }), rowEl);
  };

  // 渲染单元格
  private renderCell = (columns: string[], dataItem: Table.DataItem, rowIndex: number) => {
    return columns.map((keyCode) => this.cellWrapper({
      keyCode,
      rowIndex, 
      valueType: getValueType(this.props.columns, keyCode), 
      children: [renderStaticCell(
        h,
        getRenderType(h, { columns: this.props.columns, dataItem, keyCode }),
        getValueType(this.props.columns, keyCode) as Table.ColumnItemType
      )]
    }));
  };
  
  private cellWrapper = ({ valueType, keyCode, rowIndex, children }: TalbeCellProps) => {
    const cell = `${keyCode}_${rowIndex}`;
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

  private tableIndex = (rowIndex: number) => h('div', { 
    'data-cell': 'index', 
    class: 'table__cell' 
  }, [ h('span', { class: 'move', }, '🤚'), rowIndex + 1 ]);
}
