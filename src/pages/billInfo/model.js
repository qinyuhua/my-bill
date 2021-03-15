import * as service from './service';

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
    *fetchQueryPayAmount({ payload, callback }, { call }) {
      const response = yield call(service.queryPayAmount, payload);
      const { data } = response;
      if (callback) callback(data);
    },
    *fetchQueryList({ payload, callback }, { call }) {
      const response = yield call(service.queryList, payload);
      const { data } = response;
      if (callback) callback(data);
    },
    *fetchQueryListGroup({ payload, callback }, { call }) {
      const response = yield call(service.queryListGroup, payload);
      const { data } = response;
      if (callback) callback(data);
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
