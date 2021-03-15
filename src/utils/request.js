import Taro from '@tarojs/taro';
import { getPrototype } from './utils';
import { canFetch } from './error';
import { ISALIPAYDD, ISH5PLAT } from './platCommon';

// 请求域名

let accountInfo = '';
let envVersion = 'develop';
// eslint-disable-next-line
console.log('request.js', JSON.stringify(process.env), process.env.TARO_ENV);

// production
if (['alipay', 'alipay-dd', 'dd'].indexOf(process.env.TARO_ENV) > -1) {
  envVersion = 'develop';
} else if (process.env.TARO_ENV === 'weapp') {
  // 微信小程序
  accountInfo = Taro.getAccountInfoSync();
  // @ts-ignore
  envVersion = accountInfo.miniProgram.envVersion;
}
const baseApi = {
  // 小程序开发版，调后端测试环境
  // develop: 'http://10.254.24.80:80',
  // develop: 'https://xyd.mandao.com',
  develop: 'http://10.0.70.65:3131',
  // 小程序体验版，调后端测试环境
  trial: 'http://10.0.70.65:3131',
  // 小程序正式版，调后端生产环境
  release: 'http://10.0.70.65:3131',
};
const BASE_URL = baseApi[envVersion];
// console.log(BASE_URL);
// console.log('-----小程序环境-----');

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 异常处理
const handleError = (error) => {
  const { status, message, errorMsg } = error;
  const errorText = status ? codeMessage[status] : message || errorMsg;
  Object.assign(error, { errorText });
  throw error;
};

// 处理成功的事件
const handleSuccess = (response, isIntercept, isNotice) => {
  // eslint-disable-next-line
  console.log('响应参数', response);
  if (getPrototype(response) === 'object') {
    const data = response.data || {};
    if (typeof data !== 'object') {
      throw { isNotice: false };
    }
    const { success } = data;
    if (success || isIntercept) {
      return data;
    }
    data.isNotice = isNotice;
    throw data;
    return;
  }
  throw response;
};

export async function post(url, params = {}, others = {}) {
  const {
    isNotice = true, // 是否显示通知提醒框，默认弹出
    isIntercept = false, // 是否拦截，是否把后端返回的错误信息（success：false）给model层，默认否
  } = others;

  // eslint-disable-next-line
  console.log('请求参数', ISALIPAYDD, BASE_URL + url, JSON.stringify(params));
  const options = {
    url: BASE_URL + url,
    method: 'POST',
    data: ISALIPAYDD ? JSON.stringify(params) : params,
    dataType: 'json',
    header: {
      'content-type': 'application/json', // 默认值
    },
  };
  if (ISH5PLAT) {
    // options.jsonp = true;
    options.mode = 'cors';
  }
  return Taro.request(options)
    .then((response) => handleSuccess(response, isIntercept, isNotice))
    .catch((e) => handleError(e));
}

