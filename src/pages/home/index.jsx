import {forwardRef } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import {Image, View, Text } from '@tarojs/components';
import iconBill from '@/assets/image/icon-bill.png';
import './index.scss';

const Index = (props, ref) => {

  const handleGotoBill = () => {
    Taro.navigateTo({ url: '/pages/index/index'});
  };

  return (
    <View className='home-layout' ref={ref}>
      <View className='home-lis'>
        <View className='home-li' onClick={handleGotoBill}>
          <Image src={iconBill} style={{ width: 90, height: 100 }}  />
          <Text>消费</Text>
        </View>
      </View>
    </View>
  )
};

export default connect()(forwardRef(Index));
