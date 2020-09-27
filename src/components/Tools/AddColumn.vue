<template>
  <pop-over ref="popoverRef">
    <Add className="table__cell" />
    <template v-slot:popover>
      <p>
        名称：<input type="text" v-model="data.label">
      </p>
      <div>
        类型：
        <select>
          <option 
            v-for="item in valueTypeList" 
            :key="item.valueType" 
            :value="item.valueType" 
            :selected="defaultValueType === item.valueType" 
            @click="onSelect(item.valueType)"
          >
            {{ item.label }}
          </option>
        </select>
      </div>
      <p>
        <button :disabled="!fullfilled" @click="onConfirm">确定</button>
      </p>
    </template>
  </pop-over>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, reactive, ref} from 'vue';
import { Table } from '../Table/types.d';
import PopOver from './Popover.vue';
import Add from './Add.vue';

interface ItemType {
  label: string;
  valueType: Table.ColumnItemType;
}

export default defineComponent({
  name: 'AddColumn',
  components: {
    Add,
    PopOver,
  },
  props: {
    defaultValueType: {
      type: String as PropType<Table.ColumnItemType>,
    },
    valueTypeList: {
      type: Array as PropType<ItemType[]>
    }
  },
  setup(props, ctx) {
    const popoverRef = ref<any>(null);
    const data = reactive({ label: '', checkedValueType: props.defaultValueType });

    const fullfilled = computed(() => {
      return data.label && data.checkedValueType;
    })

    const onSelect = (valueType: Table.ColumnItemType) => {
      data.checkedValueType = valueType;
    }

    const onConfirm = () => {
      ctx.emit('confirm', {...data});
      popoverRef.value.closeDialog();
      data.label = '';
      data.checkedValueType = props.defaultValueType;
      popoverRef.value.onAddClick();
    }

    return {
      popoverRef,
      data,
      fullfilled,
      onSelect,
      onConfirm
    }
  }
})
</script>

<style lang="less" scoped>
.add-column {
  display: inline-block;
}
</style>