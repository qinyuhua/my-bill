import React, {forwardRef, useCallback, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import {Image, Text, View} from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import ModalDate from '@/components/ModalDate';
import BillChartLine from '@/components/BillChartLine';
import { numToFixedTwo, numToFixedTwoAndFormat, addZero } from '@/utils/utils';
import iconRight from '@/assets/image/icon-right.png';


import './index.scss';

const Index = (props, ref) => {
  const { dispatch } = props;

  const [curYear, setCurYear] = useState(new Date().getFullYear());
  const [curMonth, setCurMonth] = useState(new Date().getMonth() + 1);
  const [isOpened, setIsOpened] = useState(false);
  const [type, setType] = useState('month');
  const [allPay, setAllPay] = useState({});
  // const [allIncome, setAllIncome] = useState(0);
  const [accountBooks, setAccountBooks] = useState([]);
  const [monthPay, setMonthPay] = useState([]);


  const handleQueryAll = useCallback((t = type, year = curYear, month = curMonth) => {
    console.log(0, 'handleQueryAll', t);

    let startDate = '';
    let endDate = '';
    if (t === 'year') {
      const curM = new Date().getMonth() + 1;
      startDate = new Date(`${year}-01-01`);
      endDate = new Date(`${year}-${addZero(curM)}-${addZero(new Date(year, curM, 0).getDate())}`);
    } else {
      console.log(`${year}-${addZero(month)}-01`);
      startDate = new Date(`${year}-${addZero(month)}-01`);
      endDate = new Date(`${year}-${addZero(month)}-${addZero(new Date(year, month, 0).getDate())}`);
    }

    dispatch({
      type: 'billType/fetchQueryBillBooks',
      payload: {
        startDate,
        endDate,
        // type: 'pay'
      },
      callback: (data) => {

        console.log(4, data);

        const allData = data.find(item => item.billType === "ALL") || {};
        // const { incomeAmount } = allData;
        setType(t);
        setAllPay(allData);
        // setAllIncome(incomeAmount);
        // data.remove(allData);
        setAccountBooks(data);

        setCurYear(year);
        setCurMonth(month);
        setIsOpened(false);

      }
    });
  }, [type]);

  const handelQueryByMonths = () => {
    console.log(3, 'handelQueryByMonths', type);
    if (type === 'year') {
      dispatch({
        type: 'billType/fetchBillByMonths',
        payload: {},
        callback: (resData) => {
          console.log(6, resData);
          setMonthPay(resData);
        }
      })
    }
  };

  useEffect(() => {
    handleQueryAll();
    handelQueryByMonths();
  }, [type]);



  const handleClickMonth = (year, month) => {
    console.log(0, year, month);
    handleQueryAll(type, year, month);
  };

  const handleGotoBillInfo = (record) => {
    const { billType, budgetAmount, monthBudgetAmount } = record;
    Taro.navigateTo({
      url: `/pages/billInfo/index?billType=${billType}&budgetAmount=${budgetAmount}&monthBudgetAmount=${monthBudgetAmount}&curDateType=${type}`
    });
  };

  let n = 0;
  const curMonthBud = (allPay.monthBudgetAmount) * (new Date().getMonth() + 1);

  return (
    <View className='bill-chart-index' ref={ref}>
      <View className='bill-chart-type'>
        <View className={`bill-chart-month ${type === 'month' && 'active'}`} onClick={() => setType('month')}>月报</View>
        <View className={`bill-chart-month ${type === 'year' && 'active'}`} onClick={() => setType('year')}>年报</View>
      </View>
      {type === 'month' && (
        <View className='index-month' onClick={() => setIsOpened(true)}>
          {curYear}年{curMonth}月
          <AtIcon value='chevron-down' size='18' color='#D0D0D0' />
        </View>
      )}


      <View className='bill-chart-percen'>
        <View
          className='bill-chart-percen-alread'
          style={{ width: `${allPay.payAmount / (type === 'year' ? curMonthBud : allPay.monthBudgetAmount) * 100 }%`}}
        />
      </View>
      <View className='bill-chart-percenVal'>
        <Text>
          {allPay.payAmount > (type === 'year' ? curMonthBud : allPay.monthBudgetAmount) ?
            (<Text className='colorRed'>已超预算</Text>)
            : `${numToFixedTwo(allPay.payAmount / (type === 'year' ? curMonthBud : allPay.monthBudgetAmount) * 100)}%预算已用`}</Text>
        <Text>&yen;{numToFixedTwoAndFormat(type === 'year' ? curMonthBud : allPay.monthBudgetAmount)}预算</Text>
        <Text>
          { allPay.payAmount > (type === 'year' ? curMonthBud : allPay.monthBudgetAmount) ? '已超' : '剩余' }&yen;
          {numToFixedTwoAndFormat(Math.abs((type === 'year' ? curMonthBud : allPay.monthBudgetAmount) - allPay.payAmount))}</Text>
      </View>

      <View className='index-payinfo'>
        <View className='index-left'>
          <View>{type ==='month' ? `${parseInt(curMonth, 10)}月总支出` : `${parseInt(curYear, 10)}年总支出`}</View>
          <View className='money'>
            <Text>&yen;</Text>
            <Text className='amt'>{numToFixedTwoAndFormat(allPay.payAmount)}</Text>
          </View>
        </View>
        <View className='index-left'>
          <View>{type ==='month' ? `${parseInt(curMonth, 10)}月总收入` : `${parseInt(curYear, 10)}年总收入`}</View>
          <View className='money'>
            <Text>&yen;</Text>
            <Text className='amt'>{numToFixedTwoAndFormat(allPay.incomeAmount)}</Text>
          </View>
        </View>
      </View>

      <View className='index-incomeinfo'>
        <View className='index-left'>
          <View>结余（元）</View>
          <View className='money'>
            <Text>&yen;</Text>
            <Text className='amt'>{numToFixedTwoAndFormat(allPay.incomeAmount - allPay.payAmount)}</Text>
          </View>
        </View>
        <View className='index-left'>
          <View>
            {allPay.payAmount > (type === 'year' ? curMonthBud : allPay.monthBudgetAmount) ? '已超预算' : '剩余预算'}
          </View>
          <View className='money'>
            <Text>&yen;</Text>
            <Text className='amt'>
              {numToFixedTwoAndFormat(Math.abs((type === 'year' ? curMonthBud : allPay.monthBudgetAmount) - allPay.payAmount))}
            </Text>
          </View>
        </View>
      </View>


      <View className='bill-chart-lis'>
        {accountBooks && accountBooks.map(item => {
          if (item.billType === 'ALL') return;
          if (item.payAmount === 0) return;
          n += 1;
          return (
            <View className='bill-chart-li' onClick={() => handleGotoBillInfo(item)}>
              <View className='number'>{n}</View>
              <View
                className='bill-li-back'
                style={`width:${(item.payAmount / allPay.payAmount * 100) < 70 ? (item.payAmount / allPay.payAmount * 100) + 30 : (item.payAmount / allPay.payAmount * 100)}%`}
              />
              <View className='bill-li-body'>
                <View className='bill-li-left' >
                  <View>{item.bookName}</View>
                  <View className='count'>{item.count}笔</View>
                </View>
                <View className='bill-li-right'>
                  <Text
                    className={`${item.payAmount > (type === 'month' ? item.monthBudgetAmount : item.monthBudgetAmount * (new Date().getMonth() + 1)) && 'colorRed'}`}
                  >
                    -{numToFixedTwoAndFormat(item.payAmount)}
                  </Text>
                  <Image className='rightIcon' src={iconRight} style='width:8px;height:13px;' />

                </View>
              </View>
            </View>
          );
        })}
      </View>
      <BillChartLine />

      {/*<View className='bill-chart-lis'>
        {monthPay && monthPay.map((item, index) => {
          return (
            <View className='bill-chart-li'>
              <View className='number'>{index + 1}</View>
              <View
                className='bill-li-back'
                style={`width:${(item.allPayAmount / 650000 * 100) < 70 ? (item.allPayAmount / 650000 * 100) + 30 : (item.allPayAmount / 650000 * 100)}%`}
              />
              <View className='bill-li-body'>
                <View className='bill-li-left' >
                  <View>{item._id.month}</View>
                  <View className='count'>{item.count}笔</View>
                </View>
                <View className='bill-li-right'>
                  <Text
                    className={`${item.allPayAmount > 650000 && 'colorRed'}`}
                  >
                    -{numToFixedTwoAndFormat(item.allPayAmount)}
                  </Text>
                  <Image className='rightIcon' src={iconRight} style='width:8px;height:13px;' />

                </View>
              </View>
            </View>
          );
        })}
      </View>*/}

      { isOpened && (
        <ModalDate
          isOpened={isOpened}
          onClose={() => setIsOpened(false)}
          handleClickMonth={handleClickMonth}
          currentYear={curYear}
          currentMonth={curMonth}
        />
      )}

    </View>
  )
};

export default connect(({ billInfo }) => ({
  billInfo,
}))(forwardRef(Index));
