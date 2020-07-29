
/**
 * 判断对象是否为空
 * @value {Object}
 */
export const isEmpty =  (value) => {
  let flag = false;
  if (value !== undefined && value !== null) {
    switch (Object.prototype.toString.apply(value)) {
    case '[object String]':
      value = String.trim(value.toLocaleLowerCase());
      flag = (value === 'undefined' || value === 'null' || value.length < 1);
      break;
    case '[object Number]':
      break;
    case '[object Boolean]':
      break;
    case '[object Object]':
      flag = this.isEmptyObject(value);
      break;
    case '[object Array]':
      flag = (value.length < 1);
      break;
    }
  } else {
    flag = true;
  }
  return flag;
};

export const trim = (str) => str.toString().replace(/^\s*|\s$/g, '');

export const isEmptyObject = (obj) => {
  let name;
  for (name in obj) {
    return false;
  }
  return true;
};

/**
 * 深拷贝
 * @param obj
 * @returns {*}
 */
export const deepClone = (obj) => {
  // 判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
  let objClone = Array.isArray(obj) ? [] : {};
  // 进行深拷贝的不能为空，并且是对象或者是
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        objClone[key] = deepClone(obj[key]);
      } else {
        objClone[key] = obj[key];
      }
    }
  }
  return objClone;
};

/**
 * @method 弹簧函数（事件结束后才触发）
 * @param {function} Func 函数
 * @param {int} time 弹性时间
 */
export const debounce = (Func, time = 500) => {
  let current = null;
  return (...args) => {
    if (current) {
      clearTimeout(current);
    }
    current = setTimeout(() => {
      Func.apply(this, args);
      current = null;
    }, time);
  };
};

/**
     * @method 节流函数(固定时间内只会触发一次)
     * @param {function} Func 函数
     * @param {int} time 节流时间
     */
export const throttle = function (Func, time = 500) {
  let current = null;
  let argsNew = [];
  return function (...args) {
    argsNew = args;
    if (current === null) {
      current = setTimeout(() => {
        Func.apply(this, argsNew);
        current = null;
      }, time);
    }
  };
};
