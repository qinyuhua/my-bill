import { Component } from 'react';
import { Provider } from 'react-redux';
import dva from '@/utils/dva';
import 'taro-ui/dist/style/index.scss'; // 全局引入一次即可
import './app.scss';

const { stores } = dva;
class App extends Component {
  render() {
    return <Provider store={stores}>{this.props.children}</Provider>;
  }
}
export default App;
