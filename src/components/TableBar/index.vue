<template>
  <div class="table-bar">
    <span 
      v-for="(table, index) in tables" 
      :key="table" 
      class="table-bar__item"
      :class="getActive(table, index)"
      @click="onChangeActive(table)"
    >
      {{ table }}
    </span>
    <Add className="table-bar__item" @click="onAdd" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Add from '../Tools/Add.vue';

export default defineComponent({
  name: 'TableBar',
  props: {
    tables: {
      required: true,
      type: Array as PropType<string[]>,
      default: () => []
    },
    active: {
      required: true,
      type: String,
    }
  },
  components: {
    Add
  },
  setup (props, ctx) {
    const onAdd = () => {
      ctx.emit('add');
    };

    const getActive = (item: string, index: number) => {
      if (!props.active && index === 0) return 'active';
      return props.active === item ? 'active' : '';
    };

    const onChangeActive = (active: string) => {
      ctx.emit('change', active);
    }

    return {
      onAdd,
      getActive,
      onChangeActive
    }
  }
})
</script>

<style lang="less" scoped>
.table-bar {
  margin-bottom: 20px;
  width: 100%;
  border-bottom: 1px solid #ccc;

  &__item {
    padding: 6px 16px;
    display: inline-block;
    user-select: none;
    cursor: pointer;
  }

  .active {
    color: royalblue;
    border: 1px solid #ccc;
    border-bottom: none;
    background-color: rgb(240, 240, 240);
  }
}
</style>