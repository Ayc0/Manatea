import * as React from 'react';
import { Cup, Tea, Listener } from 'manatea';

import getCup from './getCup';

interface State {
  tea: Tea;
}

export default (cup: Cup) => (component: React.ComponentType<any>) =>
  class Consumer extends React.Component<any, State> {
    state: State = { tea: getCup(cup)() };
    listener: Listener = getCup(cup).on((tea: Tea) => this.setState({ tea }));
    componentWillUnmount() {
      if (this.listener.listening) {
        this.listener();
      }
    }
    render() {
      return React.createElement(component, {
        ...this.props,
        tea: this.state.tea,
      });
    }
  };
