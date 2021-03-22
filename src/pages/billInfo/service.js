import { post } from '@/utils/request';
import { isWeiXin } from '@/utils/platCommon'
import billBooks from '../../../mock/billBooks.json';
import billList from '../../../mock/billList.json';
import income from '../../../mock/income.json';



export async function queryAllAmount(params) {
  if (!isWeiXin()) {
    return post('/billList/queryAllAmount', params);
  }
  console.log(params);

  const { startDate, endDate } = params;
  const { data } = billList;
  let totalPayAmount = 0;
  let totalIncomeAmount = 0;

  data.map(item => {
    if (new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)) {
      totalPayAmount += parseInt(item.amount || 0, 10);
      totalIncomeAmount += parseInt(item.income, 10);
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
  if (!isWeiXin()) {
    return post('/billList/queryPayAmount', params);
  }
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
      obj.allAmount += parseInt(item.amount || 0, 10);
    }


  });

  return {
    "success":true,
    "data": arr
  };
}

export async function queryIncomeAmount(params) {
  if (!isWeiXin()) {
    return post('/billList/queryIncomeAmount', params);
  }

  return income;
}


export async function queryListGroup(params) {
  if (!isWeiXin()) {
    return post('/billList/queryListGroup', params);
  }

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
      obj.allPayAmount += parseInt(item.amount || 0, 10);
      obj.allIncomeAmout += parseInt(item.income || 0, 10);
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
