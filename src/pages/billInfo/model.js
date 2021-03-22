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
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
