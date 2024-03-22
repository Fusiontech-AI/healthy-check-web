/**
 * v-copyText 按钮防抖
 *
 */

export default {
  beforeMount: (el:any, binding: any) =>{
    console.log(binding, 'binding');
    
    let throttleTime = binding.value; // 防抖时间
    if (!throttleTime) { // 用户若不设置防抖时间，则默认2s
      throttleTime = 2000;
    }
    let cbFun:any;
    el.addEventListener('click', (event:any) => {
      if (!cbFun) { // 第一次执行
        cbFun = setTimeout(() => {
          cbFun = null;
        }, throttleTime);
      } else {
        event && event.stopImmediatePropagation();
      }
    }, true);
  }
}