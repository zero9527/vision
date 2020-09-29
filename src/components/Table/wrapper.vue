<template>
  <main class="wrapper">
    <table-bar 
      :tables="['班级表', '成绩表', '课程表']" 
      :active="activeTable" 
      @add=""
      @change="onActiveChange" 
    />
    <t-table
      :startIndex="startIndex"
      :height="100"
      :columns="columns"
      :dataSource="dataSource"
      @addColumn="onAddColumn"
      @addRow="onAddRow"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import TableBar from '../TableBar/index.vue';
import TTable from './index.vue';
import { Table } from './types.d';
import { useScroll } from '/@/hooks';

interface DataSourceItem {
  id?: number;
  no?: number;
  name?: string;
  time?: string;
}

export default defineComponent({
  name: 'TableWrapper',
  components: {
    TableBar,
    TTable,
  },
  setup() {
    const startIndex = ref(0);
    const columns = ref<Table.ColumnsItem[]>([]);
    const dataSource = ref<DataSourceItem[]>([]);
    const activeTable = ref('班级表');

    const { y } = useScroll();

    // watch(
    //   () => y.value,
    //   () => {
    //     const { innerHeight } = window;
    //     const { scrollHeight } = document.documentElement;
    //     if (scrollHeight - innerHeight - y.value < 200) {
    //       loadMore();
    //     }
    //   },
    // );

    onMounted(() => {
      const baseColumns: Table.ColumnsItem[] = [
        { label: '姓名', keyCode: 'name', valueType: 'STRING', fixed: true },
        { label: '时间', keyCode: 'time', valueType: 'DATE', width: 260 },
        { label: '学号', keyCode: 'sid', valueType: 'NUMBER' },
        { label: '爱好', keyCode: 'like', valueType: 'STRING' },
        { label: '身高', keyCode: 'height', valueType: 'STRING' },
        { label: '体重', keyCode: 'weight', valueType: 'STRING' },
        { label: '手机号', keyCode: 'phone', valueType: 'NUMBER', width: 140 },
      ];
      const addColumns: Table.ColumnsItem[] = new Array(100).fill('').map((item, index) => ({
        label: 'column'+index,
        keyCode: 'key'+index,
        valueType: 'STRING'
      }));
      columns.value = [...baseColumns, ...addColumns];
      loadMore();
    });

    const loadMore = () => {
      const list = [];
      for (let i = startIndex.value; i < startIndex.value + 50; i++) {
        list.push({
          id: i + 1,
          name: `小明-${i + 1}`,
          time: new Date().toString(),
          sid: i + 1,
          like: '运动、篮球、爬山',
          height: '170cm',
          weight: '60kg',
          phone: 13000000000
        });
      }
      list.forEach(item => {
        for (let i=0; i< 100; i++) {
          item[`key${i}`] = `key${i}`;
        }
      })
      console.log('loadMore');
      dataSource.value = [...dataSource.value, ...list];
      startIndex.value = dataSource.value.length;
    };

    // 增加行
    const onAddColumn = (column: Table.ColumnsItem) => {
      columns.value.push(column);
    };

    // 增加列
    const onAddRow = () => {
      const len = dataSource.value.length + 1;
      dataSource.value.push({
          id: len,
          no: len,
          name: '',
          time: '',
        });
    };

    const onActiveChange = (active: string) => {
      activeTable.value = active;
    }

    return {
      activeTable,
      startIndex,
      columns,
      dataSource,
      onAddColumn,
      onAddRow,
      onActiveChange,
    };
  },
});
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: calc(100vh - 16px);
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}
</style>
