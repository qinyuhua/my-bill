import React, {forwardRef, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { View, Button, Image, Text } from '@tarojs/components';
import { numToFixedTwo, numToPercentage, numToFixedTwoAndFormat } from '@/utils/utils';
import Taro  from '@tarojs/taro';
import iconAll from '@/assets/image/icon-billtype-ALL.png'


import ModalAdd from './ModalAdd';
import './index.scss';

const Index = (props, ref) => {
  const { dispatch } = props;

  const [isOpened, setIsOpened] = useState(false);
  const [currentData, setCurrentData] = useState(false);
  const [curYear] = useState(new Date().getFullYear());
  const [walletLists, setWalletLists] = useState([]);

  const handleQueryAll = (year = curYear) => {
    console.log(0, 'handleQueryAll');

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    dispatch({
      type: 'billWallet/fetchQueryAllWallets',
      payload: {
        startDate,
        endDate,
      },
      callback: (res) => {
        console.log(1, res);
        const { lists } = res;
        setWalletLists(lists);
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
    // return;
    dispatch({
      type: 'billWallet/fetchInsert',
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
      type: 'billWallet/fetchUpdate',
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
    // const { billType, budgetAmount } = record;
    // Taro.navigateTo({ url: `/pages/billInfo/index?billType=${billType}&budgetAmount=${budgetAmount}`});
  };

  const handleUpdate = (e, record) => {
    e.stopPropagation();

    // console.log(record);
    setIsOpened(true);
    setCurrentData({ ...record });
  };

  return (
    <View className='bill-wallet-index' ref={ref}>

      {walletLists && walletLists.length > 0 && walletLists.map((item) => {

        return (
          <View className='bill-wallet-lis' key={item.id} onClick={(e) => handleGotoInfo(e, item)}>
            <View className='left'>
              <Image src={iconAll} style='width:40px;height:40px;border-radius: 4px;' />
            </View>
            <View className='bill-wallet-right'>
              <View className='bill-wallet-title'>
                {item.walletName}
                <Text className='desc'>10%预算已完成</Text>
                <Text className='bill-wallet-update-button' onClick={(e) => handleUpdate(e, item)}>设置</Text>
              </View>
              <View className='bill-wallet-value'>
                <View className='bill-wallet-all'>
                  <View>余额</View>
                  <View className='money'>&yen;{numToFixedTwoAndFormat(item.balance)}</View>
                </View>
                <View className='bill-wallet-all'>
                  <View>总收入</View>
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

export default connect(({ billWallet }) => ({
  billWallet,
}))(forwardRef(Index));
