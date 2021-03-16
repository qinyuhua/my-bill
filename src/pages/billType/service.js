import { post } from '@/utils/request';

// 查询所有账本名称
export async function findAllBooks(params) {
  return post('/billbook/findAllBooks', params);
}

export async function queryBillBooks(params) {
  return post('/billbook/findBillBooks', params);
}


export async function insert(params) {
  return post('/billbook/insert', params);
}

export async function update(params) {
  return post('/billbook/update', params);
}
