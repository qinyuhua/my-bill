import React, {forwardRef, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { AtIcon  } from 'taro-ui';
import {View, Text, Image} from '@tarojs/components';
import { replaceYear, numToFixedTwoAndFormat, addZero } from '@/utils/utils';
import iconRight from '@/assets/image/icon-right.png';
import iconAdd from '@/assets/image/icon-add.png';
import iconbillType from '@/assets/image/icon-bill-type.png';
import ModalAdd from '@/components/ModalAddBill';
import ModalDate from '@/components/ModalDate';

import iconBilltype_home from '@/assets/image/icon-billtype-home.png';
import iconBilltype_clothes from '@/assets/image/icon-billtype-clothes.png';
import iconBilltype_cosmetices from '@/assets/image/icon-billtype-cosmetices.png';
import iconBilltype_food from '@/assets/image/icon-billtype-food.png';
import iconBilltype_medical from '@/assets/image/icon-billtype-medical.png';
import iconBilltype_news from '@/assets/image/icon-billtype-news.png';
import iconBilltype_oth from '@/assets/image/icon-billtype-oth.png';
import iconBilltype_traffic from '@/assets/image/icon-billtype-traffic.png';
import iconBilltype_ALL from '@/assets/image/icon-billtype-ALL.png';


import './index.scss';

const weekArr = ['日', '一', '二', '三', '四', '五', '六' ];

const Index = (props, ref) => {

  const { dispatch } = props;
  const [total, setTotal] = useState({});
  const [dataList, setDataList] = useState();
  const [isOpened, setIsOpened] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  const [isOpenedAdd, setIsOpenedAdd] = useState(false);
  const [currentData, setCurrentData] = useState({});


  const handleQueryList = (year = currentYear, month = currentMonth) => {
    console.log(currentYear, currentMonth);
    const startDate = new Date(`${year}-${addZero(month)}-01`);
    const endDate = new Date(`${year}-${addZero(month)}-${addZero(new Date(year, month, 0).getDate())}`);
    dispatch({
      type: 'billInfo/fetchQueryListGroup',
      payload: {
        startDate: startDate,
        endDate: endDate,
      },
      callback: (data) => {
        setDataList(data)
        // setTotal({...res});
      }
    });
  };


  const handleQueryPayAmount = (year = currentYear, month = currentMonth) => {

    const startDate = new Date(`${year}-${addZero(month)}-01`);
    const endDate = new Date(`${year}-${addZero(month)}-${addZero(new Date(year, month, 0).getDate())}`);
    dispatch({
      type: 'billInfo/fetchQueryAllAmount',
      payload: {
        startDate,
        endDate,
      },
      callback: (res) => {
        console.log(res);
        setTotal({...res});
      }
    });
  };

  useEffect(() => {
    handleQueryPayAmount();
    handleQueryList();
  }, []);

  const handelGotoAll = () => {
    Taro.navigateTo({ url: '/pages/billType/index'});
  };

  const handleClickMonth = (year, month) => {
    console.log(0, year, month);
    setCurrentYear(year);
    setCurrentMonth(month);
    setIsOpened(false);
    handleQueryPayAmount(year, month);
    handleQueryList(year, month);
  };

  const handleAddBill = () => {
    setIsOpenedAdd(false);
    setCurrentData({});
    handleQueryPayAmount();
    handleQueryList();
  };

  const handleClickUpdate = (record) => {
    setCurrentData({ ...record });
    setIsOpenedAdd(true);
  };

  const handleGotoCharts = () => {
    Taro.navigateTo({ url: '/pages/billChart/index'});
  };

  const handleGotoIncome = () => {
    Taro.navigateTo({ url: '/pages/incomeInfo/index'});
  };

  return (
    <View className='index' ref={ref}>
      <View className='index-fab' onClick={() => handleClickUpdate()}>
        <Image src={iconAdd} style={{ width: 40, height: 40 }} />
      </View>

      <View className='index-fab-type' onClick={() => handleGotoCharts()}>
        <Image src={iconbillType} style={{ width: 40, height: 40 }} />
      </View>

      <View className='index-month' onClick={() => setIsOpened(true)}>
        {currentYear}年{currentMonth}月
        <AtIcon value='chevron-down' size='18' color='#D0D0D0' />
      </View>

      { isOpened && (
        <ModalDate
          isOpened={isOpened}
          onClose={() => setIsOpened(false)}
          handleClickMonth={handleClickMonth}
          currentYear={currentYear}
          currentMonth={currentMonth}
        />
      )}


      <View className='index-header'>
        <View className='index-payinfo'>
          <View className='index-left'>
            <View>{parseInt(currentMonth, 10)}月总支出</View>
            <View className='money'>
              <Text>&yen;</Text>
              <Text className='amt'>{numToFixedTwoAndFormat(total.totalPayAmount)}</Text>
            </View>
          </View>
          <View onClick={handleGotoIncome}>
            <View>{parseInt(currentMonth, 10)}月总收入</View>
            <View className='money'>
              <Text>&yen;</Text>
              <Text className='amt'>{numToFixedTwoAndFormat(total.totalIncomeAmount)}</Text>
            </View>
          </View>
        </View>
        <View className='index-books' onClick={handelGotoAll}>
          <View>全部账单</View>
          <View>
            <Text>剩余{numToFixedTwoAndFormat(total.totalIncomeAmount - total.totalPayAmount)}元</Text>
            <Image src={iconRight} style='width:8px;height:15px;margin-left:10px;' />
          </View>

        </View>
      </View>

      {dataList && dataList.map(item => {
        return (
          <View className='list-body'>
            <View className='list-header'>
              <View>{replaceYear(new Date(item.date), '-')} 星期{weekArr[new Date(item.date).getDay()]}</View>
              <View> 支{numToFixedTwoAndFormat(item.allPayAmount)}&nbsp;&nbsp;收&nbsp;{numToFixedTwoAndFormat(item.allIncomeAmout)}</View>
            </View>
            {item.lists && item.lists.map(lItem => (
              <View className='list-lists' onClick={() => handleClickUpdate(lItem)}>
                <View className='list-li'>
                  <View>
                    <View className='title'>{lItem.billTitle || lItem.bookName}</View>
                    <View className='time'>{lItem.bookName}</View>
                  </View>
                  <View className={`right ${lItem.type === 'income' && 'income'}`}>
                    {lItem.type === 'pay' ? '-' : '+'}
                    {numToFixedTwoAndFormat(lItem.type === 'pay' ? lItem.amount : lItem.income)}
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      })}

      {isOpenedAdd && (
        <ModalAdd
          isOpened={isOpenedAdd}
          onClose={() => setIsOpenedAdd(false)}
          handleAddBill={handleAddBill}
          currentData={currentData}
        />
      )}

    </View>
  )
};

export default connect(({ billInfo }) => ({
  billInfo,
}))(forwardRef(Index));
