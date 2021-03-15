import { create } from 'dva-core';
import createLoading from 'dva-loading';
import models from '@/models/index';
import error from './error';

let app;
let store;
let dispatch;
let registered;

function createApp(opt) {
  app = create(opt);
  app.use(createLoading({}));
  if (!registered) opt.models.forEach((model) => app.model(model));
  registered = true;
  app.start();

  store = app._store;
  app.getStore = () => store;
  app.use({
    onError: error,
  });

  dispatch = store.dispatch;

  app.dispatch = dispatch;
  return app;
}
const dvaApp = createApp({
  initialState: {},
  models: models,
});
const stores = dvaApp.getStore();

export default {
  stores,
  getDispatch() {
    return app.dispatch;
  },
  getStore() {
    return app.getStore();
  },
};
