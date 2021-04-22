import * as service from './service';

export default {
  namespace: 'billWallet',
  state: {
    key: '',

  },
  effects: {
    *fetchQueryAllWallets({ payload, callback }, { call }) {
      const response = yield call(service.findAllWallets, payload);
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
