import React, {forwardRef, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import {View, Button, Text, Image} from '@tarojs/components';
import { getCurrentInstance } from '@tarojs/taro';
import { replaceYear, numToFixedTwo, numToFixedTwoAndFormat, addZero } from '@/utils/utils';
import iconDetail from '@/assets/image/icon-detail.png';
import ModalAdd from './ModalAdd';

import './index.scss';
import {AtIcon} from "taro-ui";

const Index = (props, ref) => {
  const { dispatch } = props;

  const currentPageUrl = getCurrentInstance().router;
  const { params: { billType = 'ALL', budgetAmount } } = currentPageUrl;

  const [bookName, setBookName] = useState('');
  const [isOpened, setIsOpened] = useState(false);
  const [allAmount, setAllAmount] = useState(0);
  // const budgetAmount = 3000000;
  const [list, setList] = useState([]);
  const [currentData, setCurrentData] = useState();
  const [currentDateType, setCurrentDateType] = useState('year');
  const [currentYear, setCurrentYear] = useState('2021');
  const [currentMonth, setcurrentMonth] = useState('2021');



  const handlequeryPayAmount = (type = currentDateType, year = currentYear, month = currentMonth) => {
    let startDate = '';
    let endDate = '';

    if (type === 'year') {

      startDate = new Date(`${year}-01-01`);
      endDate = new Date(`${year}-12-31`);
    } else {
      startDate = new Date(`${year}-${addZero(month)}-01`);
      endDate = new Date(`${year}-${addZero(month)}-${addZero(new Date(year, month, 0).getDate())}`);
    }
    dispatch({
      type: 'billInfo/fetchQueryPayAmount',
      payload: {
        billType,
        startDate: startDate,
        endDate: endDate,
      },
      callback: (res) => {
        console.log(1, res);
        const data = res[0] || {};
        setList(data.lists);
        setBookName(data.bookName);
        setAllAmount(data.allAmount);
      }
    })
  };


  useEffect(() => {
    handlequeryPayAmount();
  }, [billType]);

  const handleAddbooks = (record = undefined) => {
    console.log('添加账单');
    setIsOpened(true);
    setCurrentData(record);

  };


  const handleAddBill = (params) => {
    console.log(params);
    dispatch({
      type: 'billInfo/fetchInsert',
      payload: { ...params },
      callback: (res) => {
        console.log(res);
        setIsOpened(false);
        handlequeryPayAmount();
      }
    });
  };

  const handleClickType = (type) => {
    setCurrentDateType(type);
  }


  return (
    <View className='bill-info-index' ref={ref}>
      <View className='bill-info-header'>
        <View className='index-month' onClick={() => setIsOpened(true)}>
          {currentDateType === 'year' ? '2021年' : '2021年3月'}
          <AtIcon value='chevron-down' size='18' color='#D0D0D0' />
        </View>

        <View className='bill-info-body'>
          <View className='title'>
            <Text>{billType === 'ALL' ? '总账单' : bookName}</Text>
            <Text
              onClick={() => handleClickType('month')}
              className={`bill-info-button ${currentDateType === 'month' && 'active'}`}
            >月</Text>
            <Text
              onClick={() => handleClickType('year')}
              className={`bill-info-button ${currentDateType === 'year' && 'active'}`}
            >年</Text>
          </View>

          <View className='bill-info-percen'>
            <View className='bill-info-percen-alread' style={{ width: `${allAmount / budgetAmount * 100}%`}} />
          </View>
          <View className='bill-info-percenVal'>
            <Text>{numToFixedTwo(allAmount / budgetAmount * 100)}%预算已用</Text>
            <Text>剩余￥{numToFixedTwoAndFormat(budgetAmount - allAmount)}</Text>
          </View>
          <View className='bill-info-all'>
            <View className='amt'>
              <View>总支出</View>
              <View className='num'>￥{numToFixedTwoAndFormat(allAmount)}</View>
            </View>
            <View className='amt'>
              <View>总预算</View>
              <View className='num'>￥{numToFixedTwoAndFormat(budgetAmount)}</View>
            </View>

          </View>
        </View>
      </View>


      {(!list || list.length === 0) && (
        <View className='bill-info-detail'>
          <Image src={iconDetail} style='width: 90px; height: 90px;' />
          <View>添加第一笔交易</View>
        </View>
      )}

      <View className='bill-info-lists'>
        {list && list.map(item => {
          return (
            <View className='bill-info-li' onClick={() => handleAddbooks(item)}>
              <View>
                <View className='title'>{item.billTitle}</View>
                <View className='time'>{replaceYear(new Date(item.date), '-')}</View>
              </View>
              <View className='right'>{item.type === 'pay' ? '-' : '+'}{numToFixedTwoAndFormat(item.amount)}</View>
            </View>
          );
        })}
      </View>

      <Button className='button-short' onClick={handleAddbooks}>添加交易</Button>

      {isOpened && (
        <ModalAdd
          isOpened={isOpened}
          onClose={() => setIsOpened(false)}
          handleAddBill={handleAddBill}
          billType={billType}
          bookName={bookName}
          currentData={currentData}
        />
      )}

    </View>
  )
};

export default connect(({ billInfo }) => ({
  billInfo,
}))(forwardRef(Index));
