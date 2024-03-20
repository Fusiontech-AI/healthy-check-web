/**
 * 下拉框下拉加载
 *
 */
import _ from 'lodash'
export default {
  updated: (el:any, binding: any)=> {
    const trigger: HTMLElement = el.querySelector('.el-select__wrapper')!;
    const id: string = trigger?.getAttribute('aria-describedby')!;
    if (id) {
      const popper: HTMLElement = document.getElementById(id)!;
      const selectWrap: HTMLElement = popper.querySelector(
        '.el-scrollbar .el-select-dropdown__wrap'
      )!;
      /**
       * scrollHeight 获取元素内容高度(只读)
       * scrollTop 获取或者设置元素的偏移值,
       *  常用于:计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
       * clientHeight 读取元素的可见高度(只读)
       * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
       * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
       */
      // 提前1个元素加载数据
      const debounceScroll = () => {
        const { scrollHeight, scrollTop, clientHeight } = selectWrap;
        const conditon = scrollHeight - scrollTop - 34 < clientHeight;
        if (conditon) {
          binding.value();
        }
      }
      selectWrap.addEventListener('scroll', _.debounce(debounceScroll, 200));
    }
  }
}