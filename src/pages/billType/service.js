import { post } from '@/utils/request';
import { isWeiXin } from '@/utils/platCommon';

import billBooks from '../../../mock/billBooks.json';
import billList from '../../../mock/billList.json';


// 查询所有账本名称
export async function findAllBooks(params) {

  if (!isWeiXin()) {
    return post('/billbook/findAllBooks', params);
  }
  return billBooks;

}

export async function queryBillBooks(params) {
  if (!isWeiXin()) {
    return post('/billbook/findBillBooks', params);
  }
  function object(a, b) {
    return b.payAmount - a.payAmount;
  }

  const { startDate, endDate } = params;
  const arr = [];
  let allPayAmount  = 0;
  let allIncomeAmount  = 0;
  billList.data.map(item => {
    if (new Date(item.date) < new Date(startDate) || new Date(item.date) > new Date(endDate)) {
      return ;
    }
    allPayAmount += parseInt(item.amount || 0, 10);
    allIncomeAmount += parseInt(item.income || 0, 10);

    const obj = arr.find(aItem => aItem.billType === item.billType);
    const booksObj = billBooks.data.find(bItem => bItem.billType === item.billType);

    if (!obj) {
      arr.push({
        ...booksObj,
        payAmount: item.amount,
        incomeAmount: item.income,
        count: 1,
      });
    } else {
      obj.payAmount += parseInt(item.amount || 0, 10);
      obj.incomeAmount += parseInt(item.income || 0, 10);
      obj.count += 1;
    }
  });

  const allObj = arr.find(item => item.billType === 'ALL') || {};
  allObj.payAmount = allPayAmount;
  allObj.incomeAmount = allIncomeAmount;
  if (!arr.find(item => item.billType === 'ALL')) {
    arr.push({
      ...allObj,
      billType: 'ALL',
      monthBudgetAmount: 650000,
    });
  }


  console.log(0, arr, allObj);

  arr.sort(object);

  return {
    "success":true,
    "data": arr
  };

}


export async function insert(params) {
  return post('/billbook/insert', params);
}

export async function update(params) {
  return post('/billbook/update', params);
}
