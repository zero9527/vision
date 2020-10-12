<template>
  <a-date-picker 
    v-model:value="selectValue" 
    :getCalendarContainer="triggerNode => triggerNode.parentNode"
    @change="onChange"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DatePicker } from 'ant-design-vue';
import moment from 'moment';
import { usePropsValue } from '/@/hooks';

export default defineComponent({
  name: 'Date',
  components: {
    ADatePicker: DatePicker
  },
  props: {
    value: {
      type: String
    }
  },
  setup(props, ctx) {
    const selectValue = usePropsValue(moment(props.value));

    const onChange = (date: any, dateString: string) => {
      // console.log(date, dateString)
      ctx.emit('valueChange', dateString);
    }

    return {
      selectValue,
      onChange
    }
  }
})
</script>

<style lang="less" scoped>
.date {
  width: 100%;
  padding: 8px 12px;
  border: none;
  outline: none;
}
</style>
