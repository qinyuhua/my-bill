import React, {forwardRef, useState} from 'react';
import { connect } from 'react-redux';
import { View, Text, Input, Button, Picker } from '@tarojs/components';
import { AtFloatLayout, AtIcon } from "taro-ui";
import { replaceYear, replaceMonth } from '@/utils/utils';
import './index.scss';

const Index = (props, ref) => {
  const {
    isOpened, // 是否open
    billType, // billType
    bookName, // booName
    onClose, // 关闭事件
    handleAddBill, // 新增
    currentData = {},
  } = props;

  console.log(0, currentData);

  const [amount, setAmount] = useState(currentData.amount / 100);
  const [billTitle, setbillTitle] = useState(currentData.billTitle);
  const [currentType, setCurrentType] = useState(currentData.type || 'pay');
  const [date, setDate] = useState(currentData.date ?  replaceYear(new Date(currentData.date), '-') : replaceYear(new Date(), '-'));

  const handleAdd = () => {
    console.log(date);
    const { _id } = currentData;

    const params = {
      _id,
      billTitle,
      time: new Date(),
      billType,
      type: currentType,
      amount: parseFloat(amount) * 100,
      date,
      month: replaceMonth(date, ''),
    };

    console.log(1, params);
    handleAddBill(params);
  };

  const onChangeInputAmount = (v) => {
    let newValue = v.detail.value;
    setAmount(newValue);
    return newValue;
  };
  const onChangeInputtitle = (v) => {
    let newValue = v.detail.value;
    setbillTitle(newValue);
    return newValue;
  };

  const onDateChange = (e) => {
    const v = e.detail.value;
    setDate(v);
  };


  return (
    <View className='bill-info-add' ref={ref}>
      <AtFloatLayout isOpened={isOpened} onClose={onClose}>

        <View className='bill-add-title'>
          {bookName}
        </View>
        <View className='bill-add-buttons'>
          <Text className={`bill-add-type ${currentType === 'pay' && 'current'}`} onClick={() => setCurrentType('pay')}>支出</Text>
          <Text className={`bill-add-type ${currentType === 'income' && 'current'}`} onClick={() => setCurrentType('income')}>收入</Text>
        </View>
        <View className='bill-add-amount'>
          <Text>&yen;</Text>
          <Input
            placeholder='账单金额'
            value={amount}
            name='amount'
            onInput={onChangeInputAmount}
          />
        </View>
        {(!billType || billType === 'ALL') && (
          <View>显示不同的账单类型</View>
        )}

        <View className='bill-add-remark'>
          <Input
            className='bill-add-remark-input'
            placeholder='添加备注...'
            value={billTitle}
            name='billTitle'
            onInput={onChangeInputtitle}
          />
          <Picker mode='date' onChange={onDateChange}>
            <View className='bill-add-remark-button'>{date}</View>
          </Picker>

        </View>

        <Button className='button-short' onClick={handleAdd}>完成</Button>

      </AtFloatLayout>
    </View>
  )
};

export default connect(({ global }) => ({
  global,
}))(forwardRef(Index));
