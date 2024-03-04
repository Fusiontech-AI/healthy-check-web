import { parseTime } from '@/utils/ruoyi';
import { isArray } from '@/utils/is';
import { FieldNamesProps } from '@/components/ProTable/interface';

/**
 * 表格时间格式化
 */
export const formatDate = (cellValue: string) => {
  if (cellValue == null || cellValue == '') return '';
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export const formatTime = (time: string, option: string) => {
  let t: number;
  if (('' + time).length === 10) {
    t = parseInt(time) * 1000;
  } else {
    t = +time;
  }
  const d: any = new Date(t);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(t, option);
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
  }
};

/**
 * @param {string} url
 * @returns {Object}
 */
export const getQueryObject = (url: string) => {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj: { [key: string]: string } = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
};

/**
 * @param {string} input value
 * @returns {number} output value
 */
export const byteLength = (str: string) => {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
};

/**
 * @param {Array} actual
 * @returns {Array}
 */
export const cleanArray = (actual: Array<any>) => {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
};

/**
 * @param {Object} json
 * @returns {Array}
 */
export const param = (json: any) => {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
};

/**
 * @param {string} url
 * @returns {Object}
 */
export const param2Obj = (url: string) => {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
  if (!search) {
    return {};
  }
  const obj: any = {};
  const searchArr = search.split('&');
  searchArr.forEach((v) => {
    const index = v.indexOf('=');
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
};

/**
 * @param {string} val
 * @returns {string}
 */
export const html2Text = (val: string) => {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
};

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export const objectMerge = (target: any, source: any | any[]) => {
  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
};

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export const toggleClass = (element: HTMLElement, className: string) => {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString = classString.substring(0, nameIndex) + classString.substring(nameIndex + className.length);
  }
  element.className = classString;
};

/**
 * @param {string} type
 * @returns {Date}
 */
export const getTime = (type: string) => {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
};

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export const debounce = (func: any, wait: number, immediate: boolean) => {
  let timeout: any, args: any, context: any, timestamp: any, result: any;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return (...args: any) => {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
};

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export const deepClone = (source: any) => {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone' as any);
  }
  const targetObj: any = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
};

/**
 * @param {Array} arr
 * @returns {Array}
 */
export const uniqueArr = (arr: any) => {
  return Array.from(new Set(arr));
};

/**
 * @returns {string}
 */
export const createUniqueString = (): string => {
  const timestamp = +new Date() + '';
  const num = (1 + Math.random()) * 65536;
  const randomNum = parseInt(num + '');
  return (+(randomNum + timestamp)).toString(32);
};

/**
 * Check if an element has a class
 * @param ele
 * @param {string} cls
 * @returns {boolean}
 */
export const hasClass = (ele: HTMLElement, cls: string): boolean => {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};

/**
 * Add class to element
 * @param ele
 * @param {string} cls
 */
export const addClass = (ele: HTMLElement, cls: string) => {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
};

/**
 * Remove class from element
 * @param ele
 * @param {string} cls
 */
export const removeClass = (ele: HTMLElement, cls: string) => {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
};

/**
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = (path: string) => {
  return /^(https?:|http?:|mailto:|tel:)/.test(path);
};

/**
 * @description 处理 ProTable 值为数组 || 无数据
 * @param {*} callValue 需要处理的值
 * @returns {String}
 * */
export function formatValue(callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue)) return callValue.length ? callValue.join(' / ') : '--';
  return callValue ?? '--';
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
  if (!prop.includes('.')) return row[prop] ?? '--';
  prop.split('.').forEach((item) => (row = row[item] ?? '--'));
  return row;
}

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @returns {String}
 * */
export function handleProp(prop: string) {
  const propArr = prop.split('.');
  if (propArr.length == 1) return prop;
  return propArr[propArr.length - 1];
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps, type?: 'tag') {
  const value = fieldNames?.value ?? 'value';
  const label = fieldNames?.label ?? 'label';
  const children = fieldNames?.children ?? 'children';
  let filterData: { [key: string]: any } = {};
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children);
  // 判断是否输出的结果为 tag 类型
  if (type == 'tag') {
    return filterData?.tagType ? filterData.tagType : '';
  } else {
    // return filterData ? filterData[label] : '--';
    return (
      <span>
        {filterData ? (
          <span>{filterData['cssClass'] ? <span style={filterData['cssClass']}>{filterData[label]}</span> : filterData[label]}</span>
        ) : (
          <>--</>
        )}
      </span>
    );
  }
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
  return enumData.reduce((accumulator: any, current: any) => {
    if (accumulator) return accumulator;
    if (current[value] == callValue) return current;
    if (current[children]) return findItemNested(current[children], callValue, value, children);
  }, null);
}

//减法函数
export function accSub(arg1, arg2) {
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //last modify by deeka
  //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg2 * m - arg1 * m) / m).toFixed(n);
}

/**
 * 身份证截取生日字段
 * @param {*} id
 * @returns
 */
export function getBirthday(id) {
  return id.substr(6, 4) + '-' + id.substr(10, 2) + '-' + id.substr(12, 2);
}

/**
 * 通过出生日期获取当前年龄
 * @param strBirthday：指的是出生日期，格式为"1990-01-01",字符串类型
 */
export function getCurrentAgeByBirthDate(birthday) {
  //根据日期算年龄
  birthday = birthday.split('-');
  // 新建日期对象
  const date = new Date();
  // 今天日期，数组，同 birthday
  const today = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  // 分别计算年月日差值
  const age = today.map((val, index) => {
    return val - birthday[index];
  });
  // 当天数为负数时，月减 1，天数加上月总天数
  if (age[2] < 0) {
    // 简单获取上个月总天数的方法，不会错
    const lastMonth = new Date(today[0], today[1], 0);
    age[1]--;
    age[2] += lastMonth.getDate();
  }
  // 当月数为负数时，年减 1，月数加上 12
  if (age[1] < 0) {
    age[0]--;
    age[1] += 12;
  }
  return age[0];
}

/**
 * 身份证获取性别
 * @param {*} id
 * @returns
 */
export function getSex(id, type) {
  // 获取性别 1-男 2-女
  if (parseInt(id.substr(16, 1)) % 2 == 1) {
    return type === 'num' ? '0' : '男';
  } else if (parseInt(id.substr(16, 1)) % 2 == 0) {
    return type === 'num' ? '1' : '女';
  } else {
    return type === 'num' ? '2' : '未知';
  }
}

//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
export function accAdd(arg1, arg2) {
  var r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
