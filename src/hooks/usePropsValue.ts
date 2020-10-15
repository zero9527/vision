import { Ref, ref, UnwrapRef, watchEffect } from 'vue';

// 使用一个ref传递props的一个属性，防止v-model的修改导致props属性报错
export function usePropsValue<T>(propsValue: any): Ref<UnwrapRef<T>> {
  const selectValue = ref<T>(propsValue);

  watchEffect(() => {
    selectValue.value = propsValue;
  });

  return selectValue;
}
