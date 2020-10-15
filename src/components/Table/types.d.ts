import { VNode } from 'vue';
import { CreateElement } from 'vue/types/umd';

export interface InputEvent extends Event {
  target: HTMLInputElement;
}

export interface SelectEvent extends Event {
  target: HTMLSelectElement;
}

export declare namespace Table {
  export interface Props {
    columns: ColumnsItem[];
    dataSource: any[];
    height?: number;
  }

  export interface Provide extends Props {}

  // 组件类型，在新增列时确定
  export type ColumnItemType = 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'ADDRESS';

  export interface ColumnsItem {
    keyCode: string; // 数据源中显示的字段对应的属性名
    label: string; // 名称
    valueType: ColumnItemType; // 组件类型，在新增列时确定
    align?: 'left' | 'center' | 'right';
    fixed?: boolean; // 固定列
    hidden?: boolean; // 不显示
    readonly?: boolean; // 只读
    required?: boolean; // 必填
    width?: number; // 自定义列宽度
    render?: (h: CreateElement, item: any) => VNode | string;
  }

  export interface DataItem {
    id: string;
    name: string;
    time: string;
    sid: number;
    like: string;
    height: string;
    weight: string;
    phone: number;
    [prop: string]: string | number;
  }

  // THeader
  namespace Header {
    export interface Props {
      wrapperClass?: string | object | object[];
      columns: ColumnsItem[];
    }
  }

  // TBody
  namespace Body {}
}
