import React, {forwardRef, useCallback, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { View, Text, Input, Button, Picker } from '@tarojs/components';
import { AtFloatLayout, AtCalendar, AtModal } from 'taro-ui';
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
    dispatch,
  } = props;


  const [amount, setAmount] = useState(currentData && currentData.type === 'pay' ? currentData.amount / 100 : currentData.income / 100);
  const [billTitle, setbillTitle] = useState(currentData.billTitle);
  const [currentType, setCurrentType] = useState(currentData.type || 'pay');
  const [currBillType, setCurrBillType] = useState(currentData.billType || 'ALL');
  const [date, setDate] = useState(currentData.date ?  replaceYear(new Date(currentData.date), '-') : replaceYear(new Date(), '-'));

  const [booksList, setBooksList] = useState([]);
  const [isOpenDate, setIsOpenDate] = useState(false);

  console.log(0, currBillType, currentData);

  const handleQueryAllbooks = () => {
    dispatch({
      type: 'billType/fetchQueryAllBooks',
      payload: {},
      callback: (data) => {
        setBooksList(data);
      }
    });
  };

  useEffect(() => {
    if (!billType || billType === 'ALL') {
      handleQueryAllbooks();
    }
  }, [billType]);

  const handleAdd = () => {
    const { _id } = currentData;

    const params = {
      _id,
      billTitle,
      time: new Date(),
      billType: currBillType,
      type: currentType,

      date,
      month: replaceMonth(date, ''),
    };
    if(currentType === 'pay') {
      params.amount = parseFloat(amount) * 100;
    } else {
      params.__v = parseFloat(amount) * 100;
    }
    if (params._id) {
      dispatch({
        type: 'billInfo/fetchUpdate',
        payload: { ...params },
        callback: (res) => {
          console.log(res);

          handleAddBill();
        }
      });
      return;
    }
    dispatch({
      type: 'billInfo/fetchInsert',
      payload: { ...params },
      callback: (res) => {
        console.log(res);
        handleAddBill();
      }
    });

  };

  const onChangeInputAmount = useCallback((v) => {
    let newValue = v.detail.value;
    setAmount(newValue);
    return newValue;
  }, []);

  const onChangeInputtitle = (v) => {
    let newValue = v.detail.value;
    setbillTitle(newValue);
    return newValue;
  };

  const onDateChange = (e) => {
    console.log(0, e)
    // const v = e.detail.value;
    const v = e.value;
    setDate(v);
    setIsOpenDate(false);
  };


  return (
    <View className='c-bill-modal-add' ref={ref}>
      <AtFloatLayout isOpened={isOpened} onClose={onClose}>

        <View className='c-bill-modal-add-title'>
          {bookName}
        </View>
        <View className='c-bill-modal-add-buttons'>
          <Text className={`c-bill-modal-add-type ${currentType === 'pay' && 'current'}`} onClick={() => setCurrentType('pay')}>支出</Text>
          <Text className={`c-bill-modal-add-type ${currentType === 'income' && 'current'}`} onClick={() => setCurrentType('income')}>收入</Text>
          <Text className='c-bill-modal-button' onClick={handleAdd}>完成</Text>
        </View>
        <View className='c-bill-modal-add-amount'>
          <Text>&yen;</Text>
          <Input
            type='digit'
            placeholder='账单金额'
            value={amount}
            name='amount'
            onInput={onChangeInputAmount}
          />
        </View>
        {(!billType || billType === 'ALL') && (
          <View className='c-bill-modal-add-books'>
            {booksList.map(item => {
              return (
                <View
                  className={`c-book-button ${item.billType === currBillType && 'active'}`}
                  onClick={() => setCurrBillType(item.billType)}
                >
                  {item.bookName}
                </View>
              )
            })}
          </View>
        )}

        <View className='c-bill-modal-add-remark'>
          <Input
            className='c-bill-modal-add-remark-input'
            placeholder='添加备注...'
            value={billTitle}
            name='billTitle'
            onInput={onChangeInputtitle}
          />
          {/*<Picker mode='date' onChange={onDateChange}>*/}
          {/*  <View className='c-bill-modal-add-remark-button'>{date}</View>*/}
          {/*</Picker>*/}
          <View className='c-bill-modal-add-remark-button' onClick={() => setIsOpenDate(true)}>{date}</View>

        </View>
        {/*<Button className='button-short' onClick={handleAdd}>完成</Button>*/}
      </AtFloatLayout>
      <AtModal isOpened={isOpenDate}>
        <AtCalendar currentDate={new Date(date)} onDayClick={onDateChange} />
      </AtModal>
    </View>
  )
};

export default connect(({ global }) => ({
  global,
}))(forwardRef(Index));
