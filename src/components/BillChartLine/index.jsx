import {forwardRef, useEffect} from "react";
import F2 from '@antv/f2';
import {connect} from "react-redux";
import Taro  from '@tarojs/taro';
import { View, Canvas } from '@tarojs/components';

const Index = (props, ref) => {

  const render = () => {
    const data = [{
      day: '2021-01',
      value: 300
    }, {
      day: '2021-02',
      value: 400
    }, {
      day: '2021-03',
      value: 350
    }, {
      day: '2021-04',
      value: 500
    }, {
      day: '2021-05',
      value: 490
    }, {
      day: '2021-06',
      value: 600
    }, {
      day: '2021-07',
      value: 900
    }];


    const chart = new F2.Chart({
      id: 'container',
      width: 400,
      height: 400,
      pixelRatio: window.devicePixelRatio,
      context: Taro.createCanvasContext('container')
    });

    chart.source(data, {
      value: {
        tickCount: 5,
        min: 0
      },
      day: {
        range: [ 0, 1 ]
      }
    });
    chart.tooltip({
      showCrosshairs: true,
      showItemMarker: false,
      onShow: function onShow(ev) {
        const items = ev.items;
        items[0].name = null;
        items[0].value = '$ ' + items[0].value;
      }
    });
    chart.axis('day', {
      label: function label(text, index, total) {
        const textCfg = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.line().position('day*value');
    // chart.point().position('day*value').style({
    //   stroke: '#fff',
    //   lineWidth: 1
    // });
    chart.render();
  }

  useEffect(() => {
    render();
  }, [])

  return (
    <View>
      <Canvas id='container' width={400} height={400} />
    </View>
  )
}

export default connect()(forwardRef(Index));
