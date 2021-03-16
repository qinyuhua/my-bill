import { post } from '@/utils/request';

export async function queryAllAmount(params) {
  return post('/billList/queryAllAmount', params);
}

export async function queryPayAmount(params) {
  return post('/billList/queryPayAmount', params);
}

export async function queryList(params) {
  return post('/billList/queryList', params);
}


export async function queryListGroup(params) {
  return post('/billList/queryListGroup', params);
}

export async function insert(params) {
  return post('/billList/insert', params);
}

export async function update(params) {
  return post('/billList/update', params);
}
