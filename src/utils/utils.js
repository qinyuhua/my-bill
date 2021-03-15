import numeral from 'numeral';

/**
 * 判断数据类型
 * @param data {*} 数据
 * @returns {*}
 */
export const getPrototype = (data) => {
  const str = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Error]': 'error',
  };
  return map[str.call(data)];
};


/**
 * 保留两位有效数字
 * @param num
 * @returns {*}
 */
export const numToFixedTwo = (num) => {
  if (num) {
    return parseFloat(num).toFixed(2);
  }
  return 0;
};


/**
 * 格式化数字 如 10000 => 10,000
 * @param {*} num
 */
export const numToFormat = (num) => {
  return numeral(num).format('0,0');
};

/**
 * 格式化数字并且保留两位小数 如 1000000 => 10,000.00
 * @param {*} num
 */
export const numToFixedTwoAndFormat = (num) => {
  let newNum = num;
  if (typeof newNum === 'string') {
    newNum = parseFloat(newNum);
  }
  return numeral(newNum / 100).format('0,0.00');
};

/**
 * 格式化数字转化为百分比 如 0.5 => 0.5%
 * @param {*} num
 */
export const numToPercentage = (num) => {
  return num + '%';
};



// 添加 0
export const addZero = (num) => {
  return Number(num) < 10 ? `0${num}` : num;
};

export const getMonth = (time, type = '') => {
  let date = time ? new Date(time) : new Date();
  if (typeof time === 'string') {
    // IOS  new Date 时，获取有问题，需要将. - 替换为/
    date = new Date(time.replace(/\./g, '/').replace(/\-/g, '/'));
  }
  const year = date.getFullYear();
  const month = addZero(date.getMonth() + 1);
  if (type === '年') {
    return `${year}年${month}月`;
  }

  return `${year}${type}${month}`;
};

// 获取日期
export const replaceYear = (time, type = '.') => {
  let date = time ? new Date(time) : new Date();
  if (typeof time === 'string') {
    // IOS  new Date 时，获取有问题，需要将. - 替换为/
    date = new Date(time.replace(/\./g, '/').replace(/\-/g, '/'));
  }
  const year = date.getFullYear();
  const month = addZero(date.getMonth() + 1);
  const day = addZero(date.getDate());
  if (type === '年') {
    return `${year}年${month}月${day}日`;
  }

  return `${year}${type}${month}${type}${day}`;
};

// 获取时间
export const replaceHour = (time) => {
  let date = time ? new Date(time) : new Date();
  if (typeof time === 'string') {
    date = new Date(time.replace(/\./g, '/').replace(/\-/g, '/'));
  }
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const seconds = addZero(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

// 新增 年 月 日
export const addDate = (time, len, type = 'day') => {
  let date = time ? new Date(time) : new Date();
  if (typeof time === 'string') {
    date = new Date(time.replace(/\./g, '/').replace(/\-/g, '/'));
  }
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (type === 'year') {
    year += parseInt(len, 10);
  }
  // 新增月份（如果超过一年 需要往年上新增） 通常小于等于12, 大于12 的不考虑
  if (type === 'month') {
    month += parseInt(len, 10);
    // 如果对应的那个月份没有那么多天，就取这个月最后一天
  }
  // 新增月份（如果超过一年 需要往年上新增） 通常小于等于30, 大于30的不考虑
  // 但是需要考虑这一个月份的总天数
  if (type === 'day') {
    day += parseInt(len, 10);
    const days = new Date(year, month, 0).getDate();
    day > days ? (day -= days) : day;
    month += 1;
  }

  if (month > 12) {
    month -= 12;
    year += 1;
  }
  if (type === 'month' && day > new Date(year, month, 0).getDate()) {
    day = new Date(year, month, 0).getDate();
  }

  return new Date(year, month - 1, day);
};

export const replaceDate = (time, type) => `${replaceYear(time, type)} ${replaceHour(time)}`;

