import { post } from '@/utils/request';
import billBooks from '../../../mock/billBooks.json';
import billList from '../../../mock/billList.json';



export async function queryAllAmount(params) {
  // return post('/billList/queryAllAmount', params);
  console.log(params);

  const { startDate, endDate } = params;
  const { data } = billList;
  let totalPayAmount = 0;
  let totalIncomeAmount = 0;

  data.map(item => {
    if (new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)) {
      totalPayAmount += item.amount;
      totalIncomeAmount += item.income;
    }
  });

  return {
    "success":true,
      "data":{
      "totalPayAmount":totalPayAmount,
      "totalIncomeAmount":totalIncomeAmount
    }
  };
}

export async function queryPayAmount(params) {
  // return post('/billList/queryPayAmount', params);
  console.log(params);

  const { startDate, endDate, billType } = params;
  const { data } = billList;
  const arr = [];

  const bookObj = billBooks.data.find(bItem => bItem.billType === billType);


  data.map(item => {
    if (new Date(item.date) < new Date(startDate) || new Date(item.date) > new Date(endDate) || item.billType !== billType) {
      return ;
    }
    const obj = arr.find(aItem => aItem.billType === billType);
    if (!obj) {
      arr.push({
        ...bookObj,
        allAmount: item.amount,
        lists: [item]
      });
    } else {
      obj.lists.push({ ...item });
      obj.allAmount += item.amount;
    }


  });

  return {
    "success":true,
    "data": arr
  };
}

export async function queryList(params) {
  return post('/billList/queryList', params);
}


export async function queryListGroup(params) {
  // return post('/billList/queryListGroup', params);

  function object(a, b) {
    return new Date(b.date) - new Date(a.date);
  }

  const arr = [];

  const { startDate, endDate } = params;
  const { data } = billList;

  data.map(item => {
    if (new Date(item.date) < new Date(startDate) || new Date(item.date) > new Date(endDate)) {
      return ;
    }
    const obj = arr.find(aItem => aItem.date === item.date);
    const booksObj = billBooks.data.find(bItem => bItem.billType === item.billType);
    item.bookName = booksObj.bookName;
    if (!obj) {
      arr.push({
        lists: [item],
        date: item.date,
        allPayAmount: item.amount,
        allIncomeAmout: item.income,
      });
    } else {
      obj.lists.push(item);
      obj.allPayAmount += item.amount;
      obj.allIncomeAmout += item.income;
    }
    return item;
  });

  console.log(11, arr);

  arr.sort(object);

  return {
    "success":true,
    "data": arr
  };

}

export async function insert(params) {
  return post('/billList/insert', params);
}

export async function update(params) {
  return post('/billList/update', params);
}
