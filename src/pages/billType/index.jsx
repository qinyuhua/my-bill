import React, {forwardRef, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { View, Button, Image, Text } from '@tarojs/components';
import { numToFixedTwo, numToPercentage, numToFixedTwoAndFormat } from '@/utils/utils';
import Taro  from '@tarojs/taro';
import IconBill from '@/assets/image/bill.png';
import ModalAdd from './ModalAdd';
import './index.scss';

const Index = (props, ref) => {
  const { dispatch } = props;

  const [isOpened, setIsOpened] = useState(false);
  const [currentData, setCurrentData] = useState(false);

  const [accountBooks, setAccountBooks] = useState([]);

  const handleQueryAll = () => {
    console.log(0, 'handleQueryAll');
    dispatch({
      type: 'billType/fetchQueryBillBooks',
      payload: {},
      callback: (res) => {
        console.log(1, res);
        setAccountBooks(res);
      }
    });
  };

  useEffect(() => {
    handleQueryAll();
  }, []);

  const handleAddbooks = () => {
    console.log('添加账本');
    setIsOpened(true);
    setCurrentData(undefined);
  };



  const handleAddBill = (params) => {
    console.log(params);
    dispatch({
      type: 'billType/fetchInsert',
      payload: {
        ...params
      },
      callback: () => {
        setIsOpened(false);
        handleQueryAll();
      }
    })
  };

  const handleUpdateBill = (params) => {
    console.log(params);
    dispatch({
      type: 'billType/fetchUpdate',
      payload: {
        ...params
      },
      callback: () => {
        setIsOpened(false);
        setCurrentData(undefined);
        handleQueryAll();
      }
    })
  };

  const handleGotoInfo = (e, record) => {
    e.stopPropagation();
    if (isOpened) return;
    console.log(record);
    const { billType, budgetAmount } = record;
    Taro.navigateTo({ url: `/pages/billInfo/index?billType=${billType}&budgetAmount=${budgetAmount}`});
  };

  const handleUpdate = (e, record) => {
    e.stopPropagation();

    // console.log(record);
    setIsOpened(true);
    setCurrentData({ ...record });
  };

  return (
    <View className='bill-type-index' ref={ref}>
      {accountBooks && accountBooks.length > 0 && accountBooks.map((item) => {
        return (
          <View className='bill-type-lis' key={item.id} onClick={(e) => handleGotoInfo(e, item)}>
            <View className='left'>
              <Image src={IconBill} style='width:40px;height:70px;' />
            </View>
            <View className='bill-type-right'>
              <View className='bill-type-title'>
                {item.bookName}
                <Text className='desc'>{numToFixedTwo(numToPercentage(item.payAmount/item.budgetAmount * 100))}%预算已用完</Text>
                <Text className='bill-type-update-button' onClick={(e) => handleUpdate(e, item)}>设置</Text>
              </View>
              <View className='bill-type-value'>
                <View className='bill-type-all'>
                  <View>总支出</View>
                  <View className='money'>￥{numToFixedTwoAndFormat(item.payAmount)}</View>
                </View>
                <View className='bill-type-all'>
                  <View>总预算</View>
                  <View className='money'>￥{numToFixedTwoAndFormat(item.budgetAmount)}</View>
                </View>
              </View>
            </View>
          </View>
        );
      })}

      <Button className='button-short' onClick={handleAddbooks}>添加账本</Button>

      {isOpened && (
        <ModalAdd
          isOpened={isOpened}
          onClose={() => setIsOpened(false)}
          handleAddBill={handleAddBill}
          handleUpdateBill={handleUpdateBill}
          currentData={currentData}
        />
      )}

    </View>
  )
};

export default connect(({ billType }) => ({
  billType,
}))(forwardRef(Index));
