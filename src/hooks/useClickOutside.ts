export type UseClickOutsideReturns = {
  addListener: () => void;
  removeListener: () => void;
};

/**
 * useClickOutside
 * @description 可以手动添加监听 addListener，移除监听 removeListener，任意地方使用
 * @param target {Element/string} 目标元素或选择器，之外的视为外部
 * @param cb {function} 回调函数
 * @example
 *  const onClickOutside = () => closeDialog();
    const {
      addListener, 
      removeListener 
    } = useClickOutside('.popover__dialog', onClickOutside);
    
    @example
    if (this.outsideHandler) this.outsideHandler.removeListener();
    this.outsideHandler = useClickOutside(cellElement, this.onClickOutside);
    this.outsideHandler.addListener();
 */
export function useClickOutside(
  target: Element | string,
  cb: Function,
): UseClickOutsideReturns {
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
    let _target =
      typeof target === 'string' ? document.querySelector(`${target}`) : target;
    // console.log(isReady, _target, e.target);
    if (isReady && cb && !_target?.contains(e.target as Node)) {
      cb();
      _target = null;
      removeListener();
    }
  };

  return {
    addListener,
    removeListener,
  };
}
