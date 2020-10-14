<script lang="ts">
import { defineComponent, h, inject, nextTick, onMounted, onUnmounted, PropType, reactive, ref, watch } from 'vue';
import CellRenderManager from './manager/CellRenderManager';
import CellEditManager from './manager/CellEditManager';
import { getCellName, getEditCellSelector, setRowActive } from '../utils';
import AddRow from '/@/components/Tools/AddRow.vue';
import { Table } from '../types.d';

export default defineComponent({
  name: 'TBody',
  props: {
    columns: {
      type: Array as PropType<Table.ColumnsItem[]>,
      default: [],
    },
    dataSource: {
      type: Array as PropType<Table.DataItem[]>,
      default: [],
    },
  },
  setup(props, ctx) {
    const cellRenderManager = ref<CellRenderManager>();
    const cellEditManager = ref<CellEditManager>();
    const cellHeight = ref(50);
    const editCell = ref('');
    const editCellStyle = reactive({ width: 0, height: 0, top: 0, left: 0 });
    const setTableScroll: Function = inject('setTableScroll') || console.log;

    onMounted(() => {
      window.addEventListener('keydown', onTabClick);
    });
 
    onUnmounted(() => {
      window.removeEventListener('keydown', onTabClick);
      cellEditManager.value?.destroyEditCell(editCell.value);
    });

    watch(() => [cellHeight.value, props.columns, props.dataSource], () => {
      cellRenderManager.value = new CellRenderManager({ 
        columns: props.columns, 
        dataSource: props.dataSource,
        cellHeight: cellHeight.value, 
        onRowClick 
      });
      cellEditManager.value = new CellEditManager({
        columns: props.columns,
        dataSource: props.dataSource,
        clearEditCell,
      });
      nextTick(() => cellRenderManager.value!.renderRowFrame());
    }, { deep: true });

    watch(() => editCell.value, (value, oldValue) => {
      if (oldValue) {
        cellEditManager.value?.updateRowData(value, oldValue);
        const selector = getEditCellSelector(oldValue);
        let oldEditCell = document.querySelector(selector) as Element;
        if (oldEditCell) {
          oldEditCell.classList.remove('edit');
        }
      }
    });

    // 编辑一个单元格的时候，点击tab，切换到编辑同一行下一个单元格
    const onTabClick = (e: KeyboardEvent) => {
      if (!editCell.value) return;
      if (e.keyCode === 9 || e.key === 'Tab') {
        const currentEditCell = document.querySelector('.table__cell.edit')!;
        const nextEditCell = currentEditCell.nextElementSibling as HTMLElement;
        if (nextEditCell) nextEditCell.click();
      }
    }

    // 行点击事件代理，不直接对每个cell绑定事件
    const onRowClick = (e: MouseEvent) => {
      e.stopPropagation();
      setRowActive(e.currentTarget as HTMLElement);
      
      const currentCell = getCellName(e);
      if (!currentCell || currentCell === 'index' || editCell.value === currentCell) return;
      editCell.value = currentCell;

      cellEditManager.value?.renderEditCell({
        currentCell,
        setTableScroll,
        cb: (pos) => {
          editCellStyle.width = pos.offsetWidth;
          editCellStyle.height = pos.offsetHeight;
          editCellStyle.top = pos.offsetTop;
          editCellStyle.left = pos.offsetLeft;
        }
      });
    };

    const clearEditCell = () => {
      editCell.value = '';
    }

    // 手动逐行渲染 renderRowFrame
    return () => h('section', { class: 'table__body' });
  },
});
</script>
