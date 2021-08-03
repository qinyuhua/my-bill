import React, {forwardRef, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { View, Button, Image, Text } from '@tarojs/components';
import { numToFixedTwo, numToPercentage, numToFixedTwoAndFormat, addZero } from '@/utils/utils';
import Taro  from '@tarojs/taro';


import ModalAdd from './ModalAdd';
import './index.scss';

const Index = (props, ref) => {
  const { dispatch } = props;

  const [isOpened, setIsOpened] = useState(false);
  const [currentData, setCurrentData] = useState(false);
  const [curYear] = useState(new Date().getFullYear());
  const [accountBooks, setAccountBooks] = useState([]);
  const [curShowType, setCurShowType] = useState(false);

  const handleQueryAll = (year = curYear) => {
    console.log(0, 'handleQueryAll');

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    dispatch({
      type: 'billType/fetchQueryBillBooks',
      payload: {
        startDate,
        endDate,
        type: 'pay'
      },
      callback: (res) => {
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
      <View onClick={() => setCurShowType(!curShowType)}>
        展示类型
      </View>
      { curShowType && (
        <View className='bill-type-lists'>
          {accountBooks && accountBooks.length > 0 && accountBooks.map((item) => {
            return (
              <View className='bill-type-lis-body' key={item.id} onClick={(e) => handleGotoInfo(e, item)}>
                <Image src={`../../assets/image/icon-billtype-${item.billType}.png`} style='width:40px;height:40px;border-radius: 4px;' />
                <View>{item.bookName}</View>
              </View>
            );
          })}
        </View>
      )}

      {!curShowType && accountBooks && accountBooks.length > 0 && accountBooks.map((item) => {

        return (
          <View className='bill-type-lis' key={item.id} onClick={(e) => handleGotoInfo(e, item)}>
            <View className='left'>
              <Image src={`../../assets/image/icon-billtype-${item.billType}.png`} style='width:40px;height:40px;border-radius: 4px;' />
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
                  <View className='money'>&yen;{numToFixedTwoAndFormat(item.payAmount)}</View>
                </View>
                <View className='bill-type-all'>
                  <View>总预算</View>
                  <View className='money'>&yen;{numToFixedTwoAndFormat(item.budgetAmount)}</View>
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
