import { PropsWithChildren } from 'react';
import { registerAllComponents } from './renderer';
import './app.scss';

// App 启动时注册所有业务组件到 componentMap
registerAllComponents();

function App({ children }: PropsWithChildren) {
  return children;
}

export default App;
