import React, {forwardRef, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import {View, Button, Text, Image} from '@tarojs/components';
import { getCurrentInstance } from '@tarojs/taro';
import {AtIcon} from "taro-ui";
import { replaceYear, numToFixedTwo, numToFixedTwoAndFormat, addZero } from '@/utils/utils';
import iconDetail from '@/assets/image/icon-detail.png';
import iconAdd from '@/assets/image/icon-add.png';
import ModalAdd from './ModalAdd';

import './index.scss';

const Index = (props, ref) => {
  const { dispatch } = props;

  const currentPageUrl = getCurrentInstance().router;
  const { params: { billType = 'ALL' } } = currentPageUrl;

  const [budgetAmount, setBudgetAmount] = useState(currentPageUrl.budgetAmount || 0);
  const [monthBudgetAmount, setMonthBudgetAmount] = useState(currentPageUrl.monthBudgetAmount || 0);
  const [bookName, setBookName] = useState('');
  const [isOpened, setIsOpened] = useState(false);
  const [allAmount, setAllAmount] = useState(0);
  const [list, setList] = useState([]);
  const [currentData, setCurrentData] = useState();
  const [currentDateType, setCurrentDateType] = useState('year');
  const [currentYear, setCurrentYear] = useState('2021');
  const [currentMonth, setcurrentMonth] = useState(3);


  const handlequeryPayAmount = (type = currentDateType, year = currentYear, month = currentMonth) => {
    let startDate = '';
    let endDate = '';

    if (type === 'year') {
      startDate = new Date(`${year}-01-01`);
      endDate = new Date(`${year}-12-31`);
    } else {
      console.log(`${year}-${addZero(month)}-01`);
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
        const data = res[0] || {};
        setList(data.lists);
        setBookName(data.bookName);
        setAllAmount(data.allAmount);
        setBudgetAmount(data.budgetAmount);
        setMonthBudgetAmount(data.monthBudgetAmount);
        setCurrentDateType(type);
      }
    })
  };


  useEffect(() => {
    handlequeryPayAmount();
  }, [billType]);

  const handleAddbooks = (record = undefined) => {
    console.log('添加账单', record);
    setIsOpened(true);
    setCurrentData(record);

  };


  const handleAddBill = (params) => {
    console.log(params);
    if (params._id) {
      dispatch({
        type: 'billInfo/fetchUpdate',
        payload: { ...params },
        callback: (res) => {
          console.log(res);
          setIsOpened(false);
          handlequeryPayAmount();
        }
      });
      return;
    }
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
    handlequeryPayAmount(type);
  };

  return (
    <View className='bill-info-index' ref={ref}>

      <View className='index-fab' onClick={() => handleAddbooks()}>
        <Image src={iconAdd} style={{ width: 40, height: 40 }} />
      </View>

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
            <View
              className='bill-info-percen-alread'
              style={{ width: `${allAmount / (currentDateType === 'year' ? budgetAmount : monthBudgetAmount) * 100 }%`, maxWidth: '100%'}}
            />
          </View>
          <View className='bill-info-percenVal'>
            <Text>{numToFixedTwo(allAmount / (currentDateType === 'year' ? budgetAmount : monthBudgetAmount) * 100)}%预算已用</Text>
            <Text>剩余￥{numToFixedTwoAndFormat((currentDateType === 'year' ? budgetAmount : monthBudgetAmount) - allAmount)}</Text>
          </View>
          <View className='bill-info-all'>
            <View className='amt'>
              <View>总支出</View>
              <View className='num'>￥{numToFixedTwoAndFormat(allAmount)}</View>
            </View>
            <View className='amt'>
              <View>总预算</View>
              <View className='num'>￥{numToFixedTwoAndFormat(currentDateType === 'year' ? budgetAmount : monthBudgetAmount)}</View>
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

      {(!list || list.length === 0) && (
        <Button className='button-short' onClick={() => handleAddbooks()}>添加交易</Button>
      )}

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
