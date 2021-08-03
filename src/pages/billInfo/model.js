import * as service from './service';
import Taro from '@tarojs/taro';
import { addZero } from '@/utils/utils';

export default {
  namespace: 'billInfo',
  state: {
    key: '',

  },
  effects: {
    *fetchQueryAllAmount({ payload, callback }, { call }) {
      const response = yield call(service.queryAllAmount, payload);
      const { data } = response;
      if (callback) callback(data);
    },
    *fetchInsert({ payload, callback }, { call }) {
      const response = yield call(service.insert, payload);
      const { data } = response;
      if (callback) callback(data);
    },
    *fetchUpdate({ payload, callback }, { call }) {
      const response = yield call(service.update, payload);
      const { data } = response;
      if (callback) callback(data);
    },
    *fetchQueryPayAmount({ payload, callback }, { call }) {
      const response = yield call(service.queryPayAmount, payload);
      const { data } = response;
      if (callback) callback(data);
    },
    *fetchIncomeAmount({ payload, callback }, { call }) {
      const response = yield call(service.queryIncomeAmount, payload);
      const { data } = response;
      if (callback) callback(data);
    },
    *fetchQueryListGroup({ payload, callback }, { call }) {
      const response = yield call(service.queryListGroup, payload);
      const { data } = response;
      if (callback) callback(data);
    },
    *fetchAllList({ payload, callback }, { call }) {
      const response = yield call(service.queryAllList, payload);
      const { data } = response;

      const y = new Date().getFullYear();
      const m = addZero(new Date().getMonth() + 1);
      const d = addZero(new Date().getDate());
      const date = `${y}${m}${d}`;

      try {
        const value = Taro.getStorageSync(date)
        if (!value) {
          Taro.clearStorage();
          Taro.setStorage({
            key: `${date}`,
            data: data
          })
        }
      } catch (e) {
        console.log('1----------------------- catch')
      }

      if (callback) callback(data);
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
