/**
 * useClickOutside
 * @param targetSelector {string} 目标元素选择器，之外的视为外部
 * @param cb {function} 回调函数
 */
export function useClickOutside(targetSelector: string, cb: Function) {
  let isReady = false;

  const addListener = () => {
    isReady = true;
    window.addEventListener('click', clickHandler, false);
  };

  const removeListener = () => {
    isReady = false;
    window.removeEventListener('click', clickHandler, false);
  };

  const clickHandler = (e: MouseEvent) => {
    let target = document.querySelector(`${targetSelector}`);
    // console.log(isReady, target, e.target);
    if (isReady && cb && !target?.contains(e.target as Node)) {
      cb();
      target = null;
      removeListener();
    }
  }

  return {
    addListener, 
    removeListener
  }
}
