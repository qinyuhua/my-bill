import * as service from './service';

export default {
  namespace: 'billType',
  state: {
    key: '',

  },
  effects: {
    *fetchQueryAllBooks({ payload, callback }, { call }) {
      const response = yield call(service.findAllBooks, payload);
      const { data } = response;
      if (callback) callback(data);
    },
    *fetchQueryBillBooks({ payload, callback }, { call }) {
      const response = yield call(service.queryBillBooks, payload);
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
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
