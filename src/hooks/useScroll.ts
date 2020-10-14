import { onMounted, onUnmounted, ref } from 'vue';

/**
 * composition-api 自定义Hook
 * 注意事项：
 * 1、保持响应性（可以被watch监听到），状态需要使用ref
 * 2、如果使用reactive，return 出去时，使用toRefs包裹
 * 3、外部调用时，如watch，需要 '.value'才能保持响应，如下示例
 */
/**
 * 滚动 hook
 * @param selector class或id选择器，如 '.container'
 * @example 
    const { x, y } = useScroll();
    watchEffect(() => {
      console.log(x.value, y.value);
    });
 */
export function useScroll(selector?: string) {
  const trigger = ref<HTMLElement | undefined>();
  const x = ref(0);
  const y = ref(0);

  const onScroll = (e: Event) => {
    e.preventDefault();
    let el: HTMLElement | null = selector ? document.querySelector(selector) : null;
    if (el) trigger.value = el;
    el = null;
    if (trigger.value) {
      x.value = parseInt(`${trigger.value.scrollLeft}`);
      y.value = parseInt(`${trigger.value.scrollTop}`);
    } else {
      x.value = parseInt(
        `${document.body.scrollLeft || document.documentElement.scrollLeft}`,
      );
      y.value = parseInt(
        `${document.body.scrollTop || document.documentElement.scrollTop}`,
      );
    }
  };

  onMounted(() => {
    window.addEventListener('scroll', onScroll, true);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll, true);
  });

  return {
    trigger,
    x,
    y,
  };
};
