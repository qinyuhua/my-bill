import { post } from '@/utils/request';
import { isWeiXin } from '@/utils/platCommon';
import Taro from "@tarojs/taro";
import { addZero } from '@/utils/utils';

// 查询所有账本名称
export async function findAllBooks(params) {
  if (!isWeiXin()) {
    return post('/billbook/findAllBooks', params);
  }

  return {"success":true,"data":[{"_id":"ALL","id":1,"billType":"ALL","bookName":"总账单","monthBudgetAmount":650000,"budgetAmount":7800000,"payAmount":319671,"incomeAmount":1381493,"count":1},{"_id":"home","id":2,"billType":"home","bookName":"住宿","monthBudgetAmount":250000,"budgetAmount":3000000,"payAmount":240330,"incomeAmount":0,"count":4},{"_id":"food","id":4,"billType":"food","bookName":"餐饮","monthBudgetAmount":100000,"budgetAmount":1200000,"payAmount":62299,"incomeAmount":0,"count":11},{"_id":"clothes","id":5,"billType":"clothes","bookName":"服饰","monthBudgetAmount":50000,"budgetAmount":600000,"payAmount":9148,"incomeAmount":0,"count":2},{"_id":"traffic","id":6,"billType":"traffic","bookName":"交通","monthBudgetAmount":50000,"budgetAmount":600000,"payAmount":4894,"incomeAmount":0,"count":22},{"_id":"news","id":8,"billType":"news","bookName":"通讯","monthBudgetAmount":10000,"budgetAmount":120000,"payAmount":3000,"incomeAmount":0,"count":1}]};

}

export async function queryBillBooks(params) {
  if (!isWeiXin()) {
    return post('/billbook/findBillBooks', params);
  }

  const y = new Date().getFullYear();
  const m = addZero(new Date().getMonth() + 1);
  const d = addZero(new Date().getDate());
  const date = `${y}${m}${d}`;
  const allDataList = Taro.getStorageSync(date);
  const allBooksList = Taro.getStorageSync('allBooks') || [];
  const { startDate, endDate } = params;

  const data = [];

  let allPay = 0;
  let allIncome = 0;

  allDataList.map(item => {
    if (new Date(item.date).getTime() >= new Date(startDate).getTime() && new Date(item.date).getTime() <= new Date(endDate).getTime()) {
      if (item.type === 'pay') {
        allPay += item.amount;
      } else {
        allIncome += item.amount;
      }

      const books = allBooksList.find(aItem => aItem.billType === item.billType) || {};
      item = {...item, ...books};
      let cur = data.find(dItem => dItem.billType === item.billType);
      if(cur) {

        cur.lists.push({...item});
        if (item.type === 'pay') {
          cur.payAmount += item.amount;
        } else {
          cur.incomeAmount += item.amount;
        }
        cur.count += 1;
      } else {
        data.push({
          lists: [{...item}],
          _id: item.billType,
          billType: item.billType,
          bookName: item.bookName,
          monthBudgetAmount: item.monthBudgetAmount,
          budgetAmount: item.budgetAmount,
          payAmount: item.type === 'pay' ? item.amount : 0,
          incomeAmount: item.type === 'income' ? item.amount : 0,
          count: 1,

        })
      }
    }
  });

  data.sort((a, b) => b.payAmount - a.payAmount).map(item => {
    if(item.billType === 'ALL') {
      item.payAmount = allPay;
      item.incomeAmount = allIncome;
    }
    return item;
  });

  console.log(3, data)



  return {
    "success":true,
    "data": data
  };

}



export async function queryBillByMonths(params) {
  if (!isWeiXin()) {
    return post('/billbook/findBillByMonths', params);
  }
}


export async function insert(params) {
  return post('/billbook/insert', params);
}

export async function update(params) {
  return post('/billbook/update', params);
}
