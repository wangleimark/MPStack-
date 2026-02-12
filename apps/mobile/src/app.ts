import { Component, PropsWithChildren } from 'react';
import { registerAllComponents } from './renderer';
import './app.scss';

// App 启动时注册所有业务组件到 componentMap
registerAllComponents();

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    console.log('[MPSTACK] App launched, components registered.');
  }

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
