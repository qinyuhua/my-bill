import { post } from '@/utils/request';

export async function queryBillBooks(params) {
  return post('/billbook/findBillBooks', params);
}

export async function insert(params) {
  return post('/billbook/insert', params);
}

export async function update(params) {
  return post('/billbook/update', params);
}
