import { App, createApp, DefineComponent, h } from 'vue';
import { getCellElment, getCellValue, getRenderType, renderStaticCell, seperateKeycodeIndex } from '../../utils';
import { useClickOutside, UseClickOutsideReturns } from '/@/hooks';
import NumberComp from '/@/components/Tools/Number.vue';
import SelectComp from '/@/components/Tools/Select.vue';
import TextComp from '/@/components/Tools/Text.vue';
import DateComp from '/@/components/Tools/Date.vue';
import AddressComp from '/@/components/Tools/Address.vue';
import { Table } from '../../types';

interface CellEditManagerProps {
  columns: Table.ColumnsItem[];
  dataSource: any[];
  clearEditCell: () => void;
}

type ChangeRows = {
  [prop: string]: Table.DataItem;
}

type CBdata = {
  offsetWidth: number, 
  offsetHeight: number, 
  offsetTop: number, 
  offsetLeft: number
};

const compMap: Record<Table.ColumnItemType, DefineComponent> = { 
  TEXT: TextComp, 
  NUMBER: NumberComp, 
  DATE: DateComp, 
  SELECT: SelectComp,
  ADDRESS: AddressComp
};

// 当前编辑的单元格对应的组件实例
let EditComp: App | null = null;

/**
 * 编辑管理
 */
export default class CellEditManager {
  private props: Readonly<CellEditManagerProps>;

  private outsideHandler: UseClickOutsideReturns | null = null;

  private editCell_old: string = '';

  // 当前编辑单元格 data-cell
  private editCell: string = '';

  // 当前修改的行数据
  private updatedRows: ChangeRows = {};

  // 修改的行数据集合
  public changeRows: ChangeRows = {};
  
  constructor(props: CellEditManagerProps) {
    this.props = props;
  }

  // 更新的时候，优先使用 editCell_old
  private get getEditCell() {
    return this.editCell_old || this.editCell;
  }

  // 修改 editCell，同时更新 editCell_old
  private updateCellValue = (value: string) => {
    this.editCell_old = this.editCell;
    this.editCell = value;
  }
  
  // 点击外部
  private onClickOutside = () => {
    if (this.outsideHandler) this.outsideHandler.removeListener();
    this.destroyEditCell(this.editCell);
    this.props.clearEditCell();
  }
  
  // 编辑的组件回调函数，使用@change的话调用了两次
  private onCellValueChange = (value: string | number) => {
    // 更新数据
    this.updateChangeRows(value);
    // 更新DOM
    this.updateCellEl();
  };

  // 更新修改的行数据
  private updateChangeRows = (value: any) => {
    if (!this.getEditCell) return;
    const [keyCode, index] = seperateKeycodeIndex(this.getEditCell);
    this.changeRows[index] = Object.assign(
      {}, 
      this.changeRows[index] || this.props.dataSource[index], 
      { [keyCode]: value }
    );
  };

  // 更新单元格
  public updateCellEl = () => {
    if (!this.getEditCell) return;
    const oldEditCell = getCellElment(this.getEditCell);
    const oldShowContent = oldEditCell.querySelector(`.show-content`)!;
    const [keyCode, index] = seperateKeycodeIndex(this.getEditCell);
    const valueType = oldEditCell.dataset['valueType'.toLowerCase()] as Table.ColumnItemType;
    createApp({
      render: () => renderStaticCell(h, getRenderType(h, { // 自定义列渲染
        columns: this.props.columns, 
        dataItem: this.changeRows[index] || this.props.dataSource[index], 
        keyCode
      }), valueType)
    }).mount(oldShowContent);
  };

  // 更新行状态
  public updateRowData = (value: string, oldValue: string) => {
    const indexOld = seperateKeycodeIndex(oldValue)[1];
    if (Number(value.split('_')[1]) === indexOld) return;

    const oldActiveRow = this.changeRows[indexOld];
    if (!oldActiveRow) return; // 第一一次编辑
    
    if (this.updatedRows[indexOld]) {
      const hasChange = Object.keys(this.updatedRows[indexOld])
        .some(key => oldActiveRow[key] !== this.updatedRows[indexOld][key]);
      if (!hasChange) return; // 已经更新过了
    }

    const rowEl = document.querySelector(`.table__row[index="${indexOld}"]`);
    if (!rowEl) return; // 找不到元素

    rowEl.classList.add('updating');
    console.log(this.changeRows[indexOld]);
    setTimeout(() => {
      rowEl.classList.remove('updating');
      this.updatedRows[indexOld] = Object.assign({}, oldActiveRow);
    }, 500);
  };

  // 渲染编辑单元格
  public renderEditCell = ({ currentCell, setTableScroll, cb }: {
    currentCell: string, 
    setTableScroll: Function, 
    cb: (data: CBdata) => void
  }) => {
    this.destroyEditCell(this.editCell);
    this.updateCellValue(currentCell);

    const value = getCellValue(this.changeRows, this.props.dataSource, currentCell);
    const cellElement = getCellElment(currentCell);
    cellElement.classList.add('edit');
    
    if (this.outsideHandler) this.outsideHandler.removeListener();
    this.outsideHandler = useClickOutside(cellElement, this.onClickOutside);
    this.outsideHandler.addListener();

    const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = cellElement;
    const rect = cellElement.getBoundingClientRect();
    // 部分被隐藏时，滚动到可视区域
    setTableScroll(rect);
    
    cb({ offsetWidth, offsetHeight, offsetTop, offsetLeft });
    
    let cellEditContent: Element | null = cellElement.querySelector('.edit-content');
    const type = cellElement!.dataset['valueType'.toLowerCase()] as Table.ColumnItemType;

    EditComp = createApp(compMap[type], { 
      value, 
      onValueChange: this.onCellValueChange 
    });
    EditComp.mount(cellEditContent);
    cellEditContent = null;
  };

  /**
   * 卸载编辑的单元格相关的组件
   */
  public destroyEditCell = (cell: string) => {
    if (!cell) return;
    this.updateCellValue('');
    if (EditComp) EditComp.unmount(EditComp._container);
  }
}
