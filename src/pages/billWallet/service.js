import { post } from '@/utils/request';

// 查询所有账本名称
export async function findAllWallets(params) {
  return post('/billWallet/findAllWallets', params);
}

export async function insert(params) {
  return post('/billWallet/insert', params);
}

export async function update(params) {
  return post('/billWallet/update', params);
}
