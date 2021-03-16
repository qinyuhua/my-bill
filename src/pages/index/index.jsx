import React, {forwardRef, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { AtFloatLayout, AtIcon  } from 'taro-ui';
import {View, Text, Image} from '@tarojs/components';
import { replaceYear, numToFixedTwoAndFormat, addZero } from '@/utils/utils';
import iconRight from '@/assets/image/icon-right.png';
import iconAdd from '@/assets/image/icon-add.png';
import iconbillType from '@/assets/image/icon-bill-type.png';
import ModalAdd from '@/components/ModalAddBill';
import ModalDate from '@/components/ModalDate';
import './index.scss'

const Index = (props, ref) => {

  const { dispatch } = props;
  const [total, setTotal] = useState({});
  const [dataList, setDataList] = useState();
  const [isOpened, setIsOpened] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showYear, setshowYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState();
  const [currentMonth, setCurrentMonth] = useState(3);

  const [isOpenedAdd, setIsOpenedAdd] = useState(false);
  const [currentData, setCurrentData] = useState({});

  useEffect(() => {
    console.log(0, 'useEffects');
    if (showYear !== new Date().getFullYear()) {
      setMonths(12);
    } else {
      setMonths(new Date().getMonth() + 1);
    }
  }, [showYear]);

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
  }

  return (
    <View className='index' ref={ref}>


      <View className='index-fab' onClick={() => handleClickUpdate()}>
        <Image src={iconAdd} style={{ width: 40, height: 40 }} />
      </View>

      <View className='index-fab-type'>
        <Image src={iconbillType} style={{ width: 40, height: 40 }} />
      </View>

      <View className='index-month' onClick={() => setIsOpened(true)}>
        {currentYear}年{currentMonth}月
        <AtIcon value='chevron-down' size='18' color='#D0D0D0' />
      </View>
      {/*<AtFloatLayout
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
        className='index-date-layout'
      >
        <View className='index-date-year'>
          <View className='index-date-year-reduce' onClick={() => setshowYear(showYear - 1)}>
            <AtIcon value='chevron-left' size='18' color='#D0D0D0' />
          </View>
          <View>{showYear}</View>
          <View className='index-date-year-add' onClick={() => setshowYear(showYear + 1)}>
            <AtIcon value='chevron-right' size='18' color='#D0D0D0' />
          </View>
        </View>
        <View className='index-date-body'>
          { new Array(months).fill('').map((item, index) => {
            const key = `${showYear}${addZero(index+1)}`;
            const current = `${currentYear}${addZero(currentMonth)}`;
            return (
              <View
                key={key}
                className={`index-date-button ${key === current && 'index-date-button-active'}`}
                onClick={() => handleClickMonth(showYear, index + 1)}
              >
                {index + 1}月
              </View>
            );
          })}

        </View>
      </AtFloatLayout>*/}
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
              <Text>￥</Text>
              <Text className='amt'>{numToFixedTwoAndFormat(total.totalPayAmount)}</Text>
            </View>
          </View>
          <View>
            <View>{parseInt(currentMonth, 10)}月总收入</View>
            <View className='money'>
              <Text>￥</Text>
              <Text className='amt'>{numToFixedTwoAndFormat(total.totalIncomeAmount)}</Text>
            </View>
          </View>
        </View>
        <View className='index-books' onClick={handelGotoAll}>
          全部账单
          <Image src={iconRight} style='width:8px;height:15px;' />
        </View>
      </View>

      {dataList && dataList.map(item => {
        return (
          <View className='list-body'>
            <View className='list-header'>
              <View>{replaceYear(new Date(item.date), '-')} 星期四</View>
              <View> 支00 收100</View>
            </View>
            {item.lists && item.lists.map(lItem => (
              <View className='list-lists' onClick={() => handleClickUpdate(lItem)}>
                <View className='list-li'>
                  <View>
                    <View className='title'>{lItem.billTitle}</View>
                    <View className='time'>{lItem.bookName}</View>
                  </View>
                  <View className={`right ${lItem.type === 'income' && 'income'}`}>
                    {lItem.type === 'pay' ? '-' : '+'}
                    {numToFixedTwoAndFormat(lItem.amount)}
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
