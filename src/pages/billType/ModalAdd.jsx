import React, {forwardRef, useState} from 'react';
import { connect } from 'react-redux';
import { View, Button, Input } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import './index.scss';

const Index = (props, ref) => {
  const { isOpened, onClose, handleAddBill, handleUpdateBill, currentData } = props;

  const { id, bookName } = currentData;

  const [billName, setBillName] = useState(bookName);
  const [billType, setBillType] = useState(currentData.billType);
  const [budgetAmount, setBudgetAmount] = useState(currentData.budgetAmount / 100);
  const [monthBudgetAmount, setMonthBudgetAmount] = useState(currentData.monthBudgetAmount / 100);

  console.log(currentData);


  const handleSubmit = () => {
    const params = {
      id: id || undefined,
      bookName: billName,
      budgetAmount: budgetAmount * 100,
      monthBudgetAmount: monthBudgetAmount * 100,
      billType,
    };
    if (id) {
      handleUpdateBill(params);
    } else {
      handleAddBill(params);
    }
  }

  const onChangeInput = (v) => {
    let newValue = v.detail.value;
    setBillName(newValue);
    return newValue;
  };
  const onChangeInputBudget = (v) => {
    let newValue = v.detail.value;
    setBudgetAmount(newValue);
    return newValue;
  };
  const onChangeInputType = (v) => {
    let newValue = v.detail.value;
    setBillType(newValue);
    return newValue;
  };
  const onChangeMonthBudge = (v) => {
    let newValue = v.detail.value;
    setMonthBudgetAmount(newValue);
    return newValue;
  };

  return (
    <View className='bill-add-index' ref={ref}>
      <AtModal isOpened={isOpened} onClose={onClose} onCancel={onClose}>
        <AtModalHeader>{id ? '修改账本' : '新建账本'}</AtModalHeader>
        <AtModalContent>
          <View className='bill-add-lis'>
            <View className='bill-add-name'>账本名称</View>
            <Input
              className='bill-add-input'
              type='text'
              placeholder='账单名称'
              value={billName}
              name='billName'
              onInput={onChangeInput}
            />
          </View>
          <View className='bill-add-lis'>
            <View className='bill-add-name'>账单类型</View>
            <Input
              className='bill-add-input'
              type='text'
              placeholder='请输入账单类型'
              value={billType}
              name='billType'
              onInput={onChangeInputType}
            />
          </View>
          <View className='bill-add-lis'>
            <View className='bill-add-name'>月度预算</View>
            <Input
              className='bill-add-input'
              type='text'
              placeholder='请输入支出预算'
              value={monthBudgetAmount}
              name='monthBudgetAmount'
              onInput={onChangeMonthBudge}
            />
          </View>
          <View className='bill-add-lis'>
            <View className='bill-add-name'>年预算</View>
            <Input
              className='bill-add-input'
              type='text'
              placeholder='请输入支出预算'
              value={budgetAmount}
              name='budgetAmount'
              onInput={onChangeInputBudget}
            />
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={onClose}>取消</Button>
          <Button onClick={handleSubmit}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
};

export default connect(({ global }) => ({
  global,
}))(forwardRef(Index));
