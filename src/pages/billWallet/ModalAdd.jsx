import React, {forwardRef, useState} from 'react';
import { connect } from 'react-redux';
import { View, Button, Input } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import './index.scss';

const Index = (props, ref) => {
  const { isOpened, onClose, handleAddBill, handleUpdateBill, currentData = {} } = props;

  const { _id } = currentData;

  const [walletName, setWalletName] = useState(currentData.walletName);
  const [walletType, setWalletType] = useState(currentData.walletType);
  const [balance, setBalance] = useState(currentData.balance / 100);
  const [budgetAmount, setBudgetAmount] = useState(currentData.budgetAmount / 100);
  const [monthBudgetAmount, setMonthBudgetAmount] = useState(currentData.monthBudgetAmount / 100);

  console.log(currentData);


  const handleSubmit = () => {
    const params = {
      _id: _id || undefined,
      walletName,
      walletType,
      balance: balance * 100,
      budgetAmount: budgetAmount * 100,
      monthBudgetAmount: monthBudgetAmount * 100,
    };
    if (_id) {
      handleUpdateBill(params);
    } else {
      handleAddBill(params);
    }
  };

  const onChangeInput = (v, type) => {
    let newValue = v.detail.value;
    switch(type) {
      case 'walletName':
        setWalletName(newValue);
        break;
      case 'walletType':
        setWalletType(newValue);
        break;
      case 'balance':
        setBalance(newValue);
        break;
      case 'budgetAmount':
        setBudgetAmount(newValue);
        break;
      case 'monthBudgetAmount':
        setMonthBudgetAmount(newValue);
        break;
    }
    return newValue;
  };

  return (
    <View className='bill-add-index' ref={ref}>
      <AtModal isOpened={isOpened} onClose={onClose} onCancel={onClose}>
        <AtModalHeader>{_id ? '修改账户' : '新建账户'}</AtModalHeader>
        <AtModalContent>
          <View className='bill-add-lis'>
            <View className='bill-add-name'>账户名称</View>
            <Input
              className='bill-add-input'
              type='text'
              placeholder='账户名称'
              value={walletName}
              name='walletName'
              onInput={(e) => onChangeInput(e, 'walletName')}
            />
          </View>
          <View className='bill-add-lis'>
            <View className='bill-add-name'>账户类型</View>
            <Input
              className='bill-add-input'
              type='text'
              placeholder='请输入账户类型'
              value={walletType}
              name='walletType'
              onInput={(e) => onChangeInput(e, 'walletType')}
            />
          </View>
          <View className='bill-add-lis'>
            <View className='bill-add-name'>余额</View>
            <Input
              className='bill-add-input'
              type='text'
              placeholder='请输入余额'
              value={balance}
              name='balance'
              onInput={(e) => onChangeInput(e, 'balance')}
            />
          </View>
          <View className='bill-add-lis'>
            <View className='bill-add-name'>月度预算</View>
            <Input
              className='bill-add-input'
              type='text'
              placeholder='请输入收入预算'
              value={monthBudgetAmount}
              name='monthBudgetAmount'
              onInput={(e) => onChangeInput(e, 'monthBudgetAmount')}
            />
          </View>
          <View className='bill-add-lis'>
            <View className='bill-add-name'>年预算</View>
            <Input
              className='bill-add-input'
              type='text'
              placeholder='请输入收入预算'
              value={budgetAmount}
              name='budgetAmount'
              onInput={(e) => onChangeInput(e, 'budgetAmount')}
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
