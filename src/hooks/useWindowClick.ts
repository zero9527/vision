import { onMounted } from 'vue';

interface UseWindowClick {
  addListener: () => void;
  removeListener: () => void;
}

/**
 * window点击，模拟clickoutside
 */
function useWindowClick(): UseWindowClick {
  onMounted(() => {});

  const addListener = () => {
    
  };

  const removeListener = () => {};

  const clickHandler = () => {}

  return {
    addListener, 
    removeListener
  }
}

export default useWindowClick;
