<template>
  <div class="table__cell">
    <Add @click="addRow" />
  </div>
</template>

<script lang="ts">
import {defineComponent, inject, PropType} from 'vue';
import Add from './Add.vue';

export default defineComponent({
  name: 'AddRow',
  components: {
    Add,
  },
  props: {
    checkedValue: {
      type: String,
    },
  },
  setup(props, ctx) {
    const onAddRow: Function | undefined = inject('addRow');

    const addRow = (item: any) => {
      if (onAddRow) onAddRow(item);
    };
    
    return {
      addRow
    }
  }
})
</script>

<style lang="less" scoped>
.table__cell {
  border-bottom: none;
}
.add-column {
  display: inline-block;
}
</style>