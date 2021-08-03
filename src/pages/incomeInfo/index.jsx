import React, {forwardRef, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import {Image, Text, View} from '@tarojs/components';
import Taro from '@tarojs/taro';
import { replaceYear, numToFixedTwoAndFormat, numToFixedTwo } from '@/utils/utils';
import iconbillIncome from '@/assets/image/icon-bill-income.png';

import './index.scss';

const Index = (props, ref) => {

  const [allData, setAllData] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [allIncomeAmount, setAllIncomeAmount] = useState(0); // 总收入
  const [allPayAmount, setAllPayAmount] = useState(0); // 总收入
  const [curType, setCurType] = useState('income');
  const [curYear] = useState(new Date().getFullYear());

  const handleQueryAll = () => {
    const { dispatch } = props;
    const startDate = new Date(`${curYear}-01-01`);
    const endDate = new Date(`${curYear}-12-30`);
    dispatch({
      type: 'billInfo/fetchIncomeAmount',
      payload: {
        type: 'income',
        startDate,
        endDate,
      },
      callback: (data) => {
        console.log(data);
        const incomeObj = data.find(item => item._id === 'income');
        const payObj = data.find(item => item._id === 'pay');
        const { TotalIncomeAmount } = incomeObj;
        const { TotalAmount } = payObj;
        // console.log(billList);
        setAllData(data);
        // setDataList(billList);
        setAllIncomeAmount(TotalIncomeAmount);
        setAllPayAmount(TotalAmount);
      }

    })
  };

  useEffect(() => {
    const incomeObj = allData.find(item => item._id === 'income') || {};
    const payObj = allData.find(item => item._id === 'pay') || {};
    setDataList(curType === 'pay' ? payObj.billList : incomeObj.billList);
  }, [curType, allData]);

  useEffect(() => {
    handleQueryAll();
  }, []);

  const handleGotoWallet = () => {
    Taro.navigateTo({ url: '/pages/billWallet/index'});
  }


  return (
    <View className='income-info-index' ref={ref}>
      <View className='income-info-type' onClick={handleGotoWallet}>
        <Image src={iconbillIncome} style={{ width: 40, height: 40 }} />
      </View>

      <View className='income-info-percen'>
        <View
          className='income-info-percen-alread'
          style={{ width: `20%`, maxWidth: '100%'}}
        />
      </View>
      <View className='income-info-percenVal'>
        <Text>{numToFixedTwo((allIncomeAmount - allPayAmount) / 10000000 * 100)}%预计收入已完成</Text>
        <Text>剩余&yen;{numToFixedTwoAndFormat(10000000 - (allIncomeAmount - allPayAmount))}</Text>
      </View>

      <View className='income-info-payinfo'>
        <View className={`income-info-left ${curType === 'income' && 'active'}`} onClick={() => setCurType('income')}>
          <View>累计收入</View>
          <View className='money'>
            <Text>&yen;</Text>
            <Text className='amt'>{numToFixedTwoAndFormat(allIncomeAmount - allPayAmount)}</Text>
          </View>
        </View>

        <View className={`income-info-left ${curType === 'pay' && 'active'}`} onClick={() => setCurType('pay')}>
          <View>总收入</View>
          <View className='money'>
            <Text>&yen;</Text>
            <Text className='amt'>{numToFixedTwoAndFormat(allIncomeAmount)}</Text>
          </View>
        </View>
      </View>


      {dataList && dataList.map(item => {
        return (
          <View className='list-lists'>
            <View className='list-li'>
              <View>
                <View className='title'>{item.billTitle || item.bookName}</View>
                <View className='time'>{replaceYear(new Date(item.date), '-')}</View>
              </View>
              <View className={`right ${item.type === 'income'  && 'income'}`}>
                {item.type === 'pay' ? '-' : '+'}
                {numToFixedTwoAndFormat(item.type === 'pay' ? item.amount: item.__v)}
              </View>
            </View>
          </View>
        );
      })}


    </View>
  )
};

export default connect(({ billInfo }) => ({
  billInfo,
}))(forwardRef(Index));
