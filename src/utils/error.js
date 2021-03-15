import Taro from '@tarojs/taro';
import { setModal } from '@/utils/platCommon';

const error = (e) => {
  e.preventDefault();
  // eslint-disable-next-line
  console.log('-------------onError捕获全局异常---------------', e);
  if (typeof e !== 'object') {
    return;
  }

  const { isNotice, errorText, errorMsg, message, errMsg, errText, errorCode, errorMessage } = e;

  // 自定义属性，isNotice来自utils/request.js
  if (typeof isNotice === 'boolean' && !isNotice) {
    return;
  }
  // 校验token  AUTH0001 您没有登录或登录已过期,请重新登录
  if (errorCode === 'AUTH0001') {
    forceLogin(errorText || errorMsg || errorMessage);
    return;
  }

  // 自定义属性，errorText来自utils/request.js
  if ((typeof errorText === 'string' && errorText) || (typeof errorMsg === 'string' && errorMsg)) {
    const option = {
      title: '提示',
      showCancel: false,
      content: errorText || errorMsg || errorMessage,
    };
    setModal(option);
    return;
  }

  // 后端接口属性，异常信息
  if (errorMsg) {
    const option = {
      title: '提示',
      showCancel: false,
      content: errorText || errorMsg,
    };
    setModal(option);
    return;
  }
  const option = {
    title: '提示',
    showCancel: false,
    content: message || errText || errMsg || new Error(e).message || '未知的错误，请先检查网络',
  };
  setModal(option);
};
export default error;

// 判断校验token
export const canFetch = (url = '', msg = '此功能需要登录，请登录') => {
  const target = {
    isFetch: true, // 默认请求，是否请求接口
  };
  // 非登录接口
  if (url === '/product-core/customer/login') {
    return target;
  }

  const token = Taro.getStorageSync('token'); // 获取token,
  const tokenTime = Taro.getStorageSync('tokenTime') || new Date().getTime(); // 获取token,
  const time = new Date().getTime() - tokenTime;
  if (!token || time > 7 * 24 * 60 * 60 * 1000) {
    // 或者token 失效
    target.isFetch = false;
    forceLogin(msg);
  }
  return target;
};

export const forceLogin = (msg = '登录信息已过期，请重新登录') => {
  const success = () => {
    Taro.removeStorageSync('token');
    Taro.removeStorageSync('personData');
    Taro.reLaunch({
      url: '/pages/tabBar/login/index',
    });
  };
  const option = {
    title: '温馨提示',
    content: msg,
    cancelText: '取消',
    confirmText: '去登录',
    success,
  };

  setModal(option);
};
