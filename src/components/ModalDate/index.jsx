import React, {forwardRef, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { View, Text, Input, Button, Picker } from '@tarojs/components';
import {AtFloatLayout, AtIcon} from 'taro-ui';
import { addZero, replaceYear, replaceMonth } from '@/utils/utils';
import './index.scss';

const Index = (props, ref) => {
  const {
    isOpened, // 是否open
    onClose, // 关闭事件
    currentYear = new Date().getFullYear(),
    currentMonth = new Date().getMonth() + 1,
    handleClickMonth,

  } = props;

  const [showYear, setShowYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    if (showYear !== new Date().getFullYear()) {
      setMonths(12);
    } else {
      setMonths(new Date().getMonth() + 1);
    }
  }, [showYear]);


  return (
    <View className='c-index-date' ref={ref}>
      <AtFloatLayout
        isOpened={isOpened}
        onClose={onClose}
        className='index-date-layout'
      >
        <View className='index-date-year'>
          <View className='index-date-year-reduce' onClick={() => setShowYear(showYear - 1)}>
            <AtIcon value='chevron-left' size='18' color='#D0D0D0' />
          </View>
          <View>{showYear}</View>
          <View className='index-date-year-add' onClick={() => setShowYear(showYear + 1)}>
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
      </AtFloatLayout>
    </View>
  )
};

export default connect(({ global }) => ({
  global,
}))(forwardRef(Index));
