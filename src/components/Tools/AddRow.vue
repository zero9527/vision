<template>
  <div class="table__row">
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
    menu: {
      type: Array as PropType<string[]>
    }
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
.add-column {
  display: inline-block;
}
</style>