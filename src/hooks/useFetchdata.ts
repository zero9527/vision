import { onBeforeUnmount, onMounted, ref } from 'vue';

interface UseFetchdata {
  isReady?: boolean; // 是否立即请求
  validResponse: (res: any) => boolean; // 验证返回是否正确
  fetchFn: () => Promise<any>; // 请求函数
}

function _validResponse(res: any) {
  return !res?.errorCode && res?.data;
}

/**
 * 获取数据自定义Hook
 */
export function useFetchData({ isReady, fetchFn, validResponse }: UseFetchdata) {
  let isDestroyed = false;
  const errorResData = ref();
  const isLoading = ref(false);
  const resData = ref();

  onMounted(async () => {
    if (typeof fetchFn !== 'function') {
      console.warn('fetchFn: 应该式一个返回Promise的函数！');
      return;
    }
    if (isReady) fetchData();
  });

  onBeforeUnmount(() => {
    isDestroyed = true;
  });

  const fetchData = async () => {
    isLoading.value = true;
    const res = await fetchFn();
    if (!isDestroyed) {
      isLoading.value = false;
      if (validResponse(res)) resData.value = res.data;
      else errorResData.value = res;
    }
  };

  return {
    errorResData,
    isLoading,
    resData,
    fetchData,
  };
}
